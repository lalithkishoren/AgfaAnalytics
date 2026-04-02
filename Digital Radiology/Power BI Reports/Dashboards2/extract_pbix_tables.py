"""
Extract all tables from a Power BI .pbix file into CSV or Excel files.

Usage:
    python extract_pbix_tables.py <path_to_pbix>

Supports two IDF formats:

  OLD format (.idfx files):
    The idfxmeta block is embedded at the END of the .idfx file, preceded by
    the CP tag b'<1:CP\x00'.  get_meta_from_idf_bytes() locates and parses it.

  NEW format (.idf files):
    A separate .idfmeta file exists alongside the .idf file in the file_log.
    The meta is read by appending 'meta' to the IDF filename (e.g.
    '...0.idf' -> '...0.idfmeta') and parsing with IdfmetaParser.from_io().
    If the idfmeta indicates count_bit_packed==0 and distinct_states==0 the
    column/table is empty (typically DirectQuery with no cached data).

Output:
    - CSV  if table rows < 500,000
    - Excel (.xlsx) if table rows >= 500,000
Output folder: <pbix_name> extracted_tables/  (next to the PBIX file)
"""

import sys
import io
import os
import struct
from collections import defaultdict
from decimal import Decimal

sys.path.insert(0, r'C:\Users\vajra\AppData\Local\Programs\Python\Python311\Lib\site-packages')

import pandas as pd
from pbixray.pbix_unpacker import PbixUnpacker
from pbixray.meta.metadata_handler import MetadataHandler
from pbixray.utils import get_data_slice, AMO_PANDAS_TYPE_MAPPING
from pbixray.column_data.idfmeta import IdfmetaParser
from pbixray.column_data.idf import ColumnDataIdf
from pbixray.column_data.dictionary import ColumnDataDictionary
from pbixray.column_data.hidx import ColumnDataHidx
from pbixray.huffman import decompress_encode_array, build_huffman_tree, decode_substring
from kaitaistruct import KaitaiStream

# ─── Configuration ────────────────────────────────────────────────────────────

LARGE_TABLE_THRESHOLD = 500_000  # rows >= this → save as Excel

# Accept PBIX path from command line, fall back to Partner Dashboard
if len(sys.argv) > 1:
    PBIX_PATH = sys.argv[1]
else:
    PBIX_PATH = (
        r"c:/Users/vajra/OneDrive/Documents/Work/AGFA Analysis"
        r"/AgfaAnalytics/Digital Radiology/Power BI Reports"
        r"/Dashboards2/Partner Dashboard.pbix"
    )

# Auto-derive output folder: "<pbix stem> extracted_tables" next to the PBIX file
_pbix_stem = os.path.splitext(os.path.basename(PBIX_PATH))[0]
OUTPUT_DIR = os.path.join(os.path.dirname(PBIX_PATH), f"{_pbix_stem} extracted_tables")

# Tables whose names contain these substrings are considered system/template tables
SKIP_TABLE_PATTERNS = [
    "DateTableTemplate_",
    "LocalDateTable_",
]

# Embedded idfxmeta CP tag (always present at the end of old-format IDF files)
CP_TAG = b'\x3c\x31\x3a\x43\x50\x00'

# ─── Helper: extract embedded idfxmeta from IDF bytes ─────────────────────────

def get_meta_from_idf_bytes(idf_bytes: bytes) -> dict:
    """
    OLD format (.idfx): the idfxmeta block is appended to the end of the .idfx
    file, preceded by the CP tag.  Locate it with rfind(), parse with
    IdfmetaParser, and return the three values needed by the decoder.
    """
    pos = idf_bytes.rfind(CP_TAG)
    if pos < 0:
        raise ValueError("No embedded idfxmeta CP tag found in IDF file")
    meta = IdfmetaParser.from_io(io.BytesIO(idf_bytes[pos:]))
    return {
        "min_data_id":      meta.blocks.cp.cs.ss.min_data_id,
        "count_bit_packed": meta.blocks.cp.cs.cs.count_bit_packed,
        "bit_width":        meta.bit_width,
        "distinct_states":  meta.blocks.cp.cs.ss.distinct_states,
    }


def get_meta_from_separate_idfmeta(data_model, idf_name: str) -> dict:
    """
    NEW format (.idf): the metadata lives in a separate .idfmeta file whose
    name is the IDF filename with 'meta' appended (e.g. '...0.idf' ->
    '...0.idfmeta').  Parse with IdfmetaParser.from_io() and return the same
    dict shape as get_meta_from_idf_bytes().
    """
    idfmeta_name = idf_name + "meta"
    data = get_data_slice(data_model, idfmeta_name)
    meta = IdfmetaParser.from_io(io.BytesIO(data))
    return {
        "min_data_id":      meta.blocks.cp.cs.ss.min_data_id,
        "count_bit_packed": meta.blocks.cp.cs.cs.count_bit_packed,
        "bit_width":        meta.bit_width,
        "distinct_states":  meta.blocks.cp.cs.ss.distinct_states,
    }

# ─── Helper: truncate IDF bytes to the segment portion only ───────────────────

def segment_bytes_only(idf_bytes: bytes) -> bytes:
    """
    OLD format (.idfx): strip the trailing embedded idfxmeta blob so that
    ColumnDataIdf can parse only the segment data.
    NEW format (.idf): CP_TAG is absent (rfind returns -1), so the full bytes
    are returned unchanged — which is exactly what we want.
    """
    pos = idf_bytes.rfind(CP_TAG)
    return idf_bytes[:pos] if pos > 0 else idf_bytes

# ─── Core decoding helpers (mirrors VertiPaqDecoder logic) ────────────────────

def _read_bitpacked(sub_segment, bit_width: int, min_data_id: int) -> list:
    mask = (1 << bit_width) - 1
    res = []
    for u8le in sub_segment:
        for _ in range(64 // bit_width):
            res.append(min_data_id + (u8le & mask))
            u8le >>= bit_width
    return res


def _read_rle_bit_packed_hybrid(
    idf_bytes: bytes,
    entries: int,
    min_data_id: int,
    bit_width: int,
) -> list:
    """
    Decode the RLE / bit-packed hybrid vector stored in the .idfx segment.
    `entries` is count_bit_packed from the metadata (number of values to pull
    from the bit-packed sub-segment).
    """
    seg_bytes = segment_bytes_only(idf_bytes)

    with io.BytesIO(seg_bytes) as f:
        column_data = ColumnDataIdf(KaitaiStream(f))

    seg = column_data.segments[0]
    bitpacked_values: list = []
    bit_packed_offset = 0

    if entries > 0:
        size = seg.sub_segment_size
        # Edge case: column with a single zero-length sub-segment = all nulls / single value
        if size == 1 and seg.sub_segment[-1].bit_length() == 0:
            bitpacked_values = [min_data_id] * entries
        else:
            bitpacked_values = _read_bitpacked(seg.sub_segment, bit_width, min_data_id)

    vector: list = []
    for entry in seg.primary_segment:
        if entry.data_value + bit_packed_offset == 0xFFFFFFFF:
            n = entry.repeat_value
            vector += bitpacked_values[bit_packed_offset: bit_packed_offset + n]
            bit_packed_offset += n
        else:
            vector += [entry.data_value] * entry.repeat_value

    return vector


def _read_dictionary(dictionary_bytes: bytes, min_data_id: int) -> dict:
    """Parse a .dictionary file and return an index→value mapping."""
    with io.BytesIO(dictionary_bytes) as f:
        dictionary = ColumnDataDictionary.from_io(f)

    DT = ColumnDataDictionary.DictionaryTypes
    if dictionary.dictionary_type == DT.xm_type_string:
        hashtable: dict = {}
        index = min_data_id

        pages = dictionary.data.dictionary_pages
        record_handles = (
            dictionary.data.dictionary_record_handles_vector_info
            .vector_of_record_handle_structures
        )
        rh_map: dict = defaultdict(list)
        for handle in record_handles:
            rh_map[handle.page_id].append(handle.bit_or_byte_offset)

        for page_id, page in enumerate(pages):
            if page.page_compressed:
                cs = page.string_store
                full_ea = decompress_encode_array(cs.encode_array)
                htree = build_huffman_tree(full_ea)
                if page_id in rh_map:
                    offsets = rh_map[page_id]
                    for i in range(len(offsets)):
                        start = offsets[i]
                        end = offsets[i + 1] if i + 1 < len(offsets) else cs.store_total_bits
                        hashtable[index] = decode_substring(
                            cs.compressed_string_buffer, htree, start, end
                        )
                        index += 1
                del htree
            else:
                raw = page.string_store.uncompressed_character_buffer
                for token in raw.split('\0')[:-1]:
                    hashtable[index] = token
                    index += 1
        return hashtable

    elif dictionary.dictionary_type in (DT.xm_type_long, DT.xm_type_real):
        values = dictionary.data.vector_of_vectors_info.values
        return {i: v for i, v in enumerate(values, start=min_data_id)}

    return {}


def _handle_special_cases(series: pd.Series, data_type: int) -> pd.Series:
    if data_type == 9:
        return pd.to_datetime(series, unit='d', origin='1899-12-30', errors='coerce')
    elif data_type == 10:
        return series.apply(lambda x: Decimal(x) / 10000 if pd.notnull(x) else None)
    return series

# ─── Main column extraction ────────────────────────────────────────────────────

def extract_column(column_metadata: pd.Series, data_model) -> pd.Series:
    """
    Extract a single column.  Supports two IDF formats:

    - OLD (.idfx): meta is embedded at the end of the IDF file (CP tag).
    - NEW (.idf):  meta lives in a separate .idfmeta file.

    Returns a pandas Series, or raises ValueError for empty/DirectQuery columns.
    """
    idf_name  = column_metadata["IDF"]
    idf_bytes = get_data_slice(data_model, idf_name)

    # ── Choose meta source based on file extension ──────────────────────────
    if idf_name.endswith(".idfx"):
        # Old format: idfxmeta embedded inside the .idfx file
        meta = get_meta_from_idf_bytes(idf_bytes)
    else:
        # New format (.idf): separate .idfmeta file
        meta = get_meta_from_separate_idfmeta(data_model, idf_name)

    min_data_id      = meta["min_data_id"]
    count_bit_packed = meta["count_bit_packed"]
    bit_width        = meta["bit_width"]
    distinct_states  = meta["distinct_states"]

    # ── Empty / DirectQuery detection ───────────────────────────────────────
    # When count_bit_packed == 0 and distinct_states == 0 there is no cached
    # data (table is empty or served via DirectQuery).
    if count_bit_packed == 0 and distinct_states == 0:
        if pd.isnull(column_metadata["Dictionary"]) and pd.isnull(column_metadata["HIDX"]):
            raise ValueError(
                f"Column '{column_metadata['ColumnName']}' appears empty "
                "(count_bit_packed=0, distinct_states=0, no Dictionary/HIDX) — "
                "likely DirectQuery with no cached data"
            )

    if pd.notnull(column_metadata["Dictionary"]):
        # String / categorical / numeric-dictionary column
        dict_bytes = get_data_slice(data_model, column_metadata["Dictionary"])
        null_adj = 1 if column_metadata["IsNullable"] else 0
        dictionary = _read_dictionary(dict_bytes, min_data_id=min_data_id)
        vector = _read_rle_bit_packed_hybrid(
            idf_bytes, count_bit_packed, min_data_id - null_adj, bit_width
        )
        series = pd.Series(vector).map(dictionary)

    elif pd.notnull(column_metadata["HIDX"]):
        # Numeric column backed by a hash index
        vector = _read_rle_bit_packed_hybrid(
            idf_bytes, count_bit_packed, min_data_id, bit_width
        )
        series = pd.Series(vector).add(column_metadata["BaseId"]) / column_metadata["Magnitude"]

    else:
        raise ValueError(
            f"Column '{column_metadata['ColumnName']}' has neither Dictionary nor HIDX"
        )

    # Special-case handling (dates, decimals)
    series = _handle_special_cases(series, column_metadata["DataType"])

    # Cast to the correct pandas dtype where possible
    dtype = AMO_PANDAS_TYPE_MAPPING.get(column_metadata["DataType"], "object")
    if dtype == "decimal.Decimal":
        dtype = "object"
    try:
        series = series.astype(dtype)
    except (TypeError, ValueError):
        pass  # keep as-is if cast fails

    return series

# ─── Table extraction ──────────────────────────────────────────────────────────

def should_skip_table(table_name: str) -> bool:
    return any(table_name.startswith(p) for p in SKIP_TABLE_PATTERNS)


def extract_table(table_name: str, schema_df: pd.DataFrame, data_model) -> tuple:
    """
    Extract all columns for one table.
    Returns (DataFrame, list_of_column_errors).
    """
    table_schema = schema_df[schema_df["TableName"] == table_name]
    data: dict = {}
    errors: list = []

    for _, col_meta in table_schema.iterrows():
        col_name = col_meta["ColumnName"]
        # Skip RowNumber columns (internal surrogate key)
        if col_name.startswith("RowNumber"):
            continue
        try:
            data[col_name] = extract_column(col_meta, data_model)
        except Exception as exc:
            errors.append(f"  Column '{col_name}': {exc}")

    if not data:
        # Check whether all failures were the empty/DirectQuery sentinel
        dq_markers = [e for e in errors if "DirectQuery" in e or "appears empty" in e]
        if dq_markers and len(dq_markers) == len(errors):
            errors = ["  [table appears empty — possibly DirectQuery with no cached data]"]
        return pd.DataFrame(), errors

    # All series should be the same length; if not, truncate/pad to the modal length
    lengths = [len(s) for s in data.values()]
    if len(set(lengths)) > 1:
        modal_len = max(set(lengths), key=lengths.count)
        fixed = {}
        for k, v in data.items():
            if len(v) == modal_len:
                fixed[k] = v
            else:
                errors.append(
                    f"  Column '{k}' length {len(v)} != modal {modal_len}; dropped"
                )
        data = fixed

    return pd.DataFrame(data), errors

# ─── Entry point ──────────────────────────────────────────────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Loading PBIX: {os.path.basename(PBIX_PATH)}")
    unpacker     = PbixUnpacker(PBIX_PATH)
    meta_handler = MetadataHandler(unpacker.data_model)
    schema_df    = meta_handler.metadata.schema_df
    data_model   = unpacker.data_model

    all_tables = schema_df["TableName"].unique()
    print(f"Found {len(all_tables)} tables in schema.\n")

    results = []

    for table_name in sorted(all_tables):
        if should_skip_table(table_name):
            print(f"[SKIP]  {table_name}  (system/template table)")
            results.append((table_name, "skipped", 0, 0, [], ""))
            continue

        print(f"[TABLE] {table_name}")
        try:
            df, col_errors = extract_table(table_name, schema_df, data_model)

            if df.empty:
                print(f"        -> empty DataFrame")
                results.append((table_name, "empty", 0, 0, col_errors, ""))
            else:
                rows, cols = df.shape
                # Sanitise filename
                safe_name = (
                    table_name
                    .replace("/", "_")
                    .replace("\\", "_")
                    .replace(":", "_")
                    .replace("*", "_")
                    .replace("?", "_")
                    .replace('"', "_")
                    .replace("<", "_")
                    .replace(">", "_")
                    .replace("|", "_")
                )
                if rows >= LARGE_TABLE_THRESHOLD:
                    out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.xlsx")
                    df.to_excel(out_path, index=False, engine="openpyxl")
                else:
                    out_path = os.path.join(OUTPUT_DIR, f"{safe_name}.csv")
                    df.to_csv(out_path, index=False, encoding="utf-8-sig")
                print(f"        -> {rows:,} rows x {cols} cols  ->  {os.path.basename(out_path)}")
                results.append((table_name, "ok", rows, cols, col_errors, out_path))

            if col_errors:
                print(f"        Column errors ({len(col_errors)}):")
                for e in col_errors:
                    print(f"         {e}")

        except Exception as exc:
            print(f"        -> TABLE-LEVEL ERROR: {exc}")
            results.append((table_name, "error", 0, 0, [str(exc)], ""))

    # ─── Summary ─────────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    ok      = [(n, r, c, p) for n, s, r, c, _, p in results if s == "ok"]
    skipped = [n             for n, s, *_     in results if s == "skipped"]
    empty   = [n             for n, s, *_     in results if s == "empty"]
    errors  = [n             for n, s, *_     in results if s == "error"]

    print(f"  Saved:   {len(ok)} tables")
    for n, r, c, p in ok:
        ext = os.path.splitext(p)[1].upper()
        print(f"    [{ext[1:]}] {n}  ({r:,} rows, {c} cols)")

    if skipped:
        print(f"\n  Skipped: {len(skipped)} system/template tables")
        for n in skipped:
            print(f"    {n}")

    if empty:
        print(f"\n  Empty:   {len(empty)}")
        for n in empty:
            print(f"    {n}")

    if errors:
        print(f"\n  Failed:  {len(errors)}")
        for n in errors:
            print(f"    {n}")

    print(f"\nOutput directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
