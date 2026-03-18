"""
AGFA HE IT — Data Extraction Script
Parses all 4 Excel pivot cache files → outputs JSON for the React dashboard.
Run: py -3 extract_data.py
Output: frontend/public/data/*.json
"""
import sys, io, os, json, zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'Data')
OUT_DIR  = os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'data')
os.makedirs(OUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# CORE PARSER
# ─────────────────────────────────────────────
def get_shared_items(field_elem):
    si = field_elem.find(f'{NS}sharedItems')
    if si is None:
        return []
    items = []
    for child in si:
        tag = child.tag.replace(NS, '')
        if tag in ('s', 'n', 'd'):
            items.append(child.get('v', ''))
        elif tag == 'm':
            items.append(None)
    return items

def parse_cache(zip_path, defn_name, records_name, max_rows=None):
    with zipfile.ZipFile(zip_path) as z:
        defn = ET.fromstring(z.read(defn_name))
        cf = defn.find(f'{NS}cacheFields')
        fields = []
        for f in cf.findall(f'{NS}cacheField'):
            fields.append({'name': f.get('name'), 'items': get_shared_items(f)})

        recs = ET.fromstring(z.read(records_name))
        rows = []
        for count, r in enumerate(recs):
            if max_rows and count >= max_rows:
                break
            row = {}
            for i, child in enumerate(r):
                if i >= len(fields):
                    break
                f = fields[i]
                tag = child.tag.replace(NS, '')
                if tag == 'x':
                    idx = int(child.get('v', 0))
                    row[f['name']] = f['items'][idx] if idx < len(f['items']) else None
                elif tag == 'n':
                    v = child.get('v', None)
                    row[f['name']] = float(v) if v is not None else None
                elif tag in ('s', 'd'):
                    row[f['name']] = child.get('v', '')
                elif tag == 'm':
                    row[f['name']] = None
            rows.append(row)
        return rows

def save_json(name, data):
    path = os.path.join(OUT_DIR, name)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    print(f'  Saved {name}: {len(data):,} records → {os.path.getsize(path)//1024}KB')

# ─────────────────────────────────────────────
# FILE 1 — ORDER INTAKE (OI HEC view pivot table)
# ─────────────────────────────────────────────
print('\n[1/4] Extracting Order Intake (OI)...')
OI_PATH = os.path.join(DATA_DIR, 'OI HEC view pivot table (1).xlsx')

# Key figures we want for the dashboard
OI_KF_KEEP = {'MONTH ACT', 'MONTH FOR', 'MONTH LY', 'MONTH BUD',
              'YTD ACT', 'YTD BUD', 'YTD LY',
              'QTD ACT', 'QTD BUD',
              'FY BUD', 'FY (A+F)',
              'Q1 (A+F)', 'Q2 (A+F)', 'Q3 (A+F)', 'Q4 (A+F)'}

FA_DESC_MAP = {
    '010H': 'Hardware', '010S': 'Own Licenses', '010T': '3rd Party Licenses',
    '010I': 'Implementation Services', '010M': 'Managed Services',
    '010R': 'Recurring Services', '010U': 'Upgrades & Updates',
}

oi_raw = parse_cache(OI_PATH,
                     'xl/pivotCache/pivotCacheDefinition2.xml',
                     'xl/pivotCache/pivotCacheRecords2.xml')

oi_records = []
for r in oi_raw:
    kf = r.get('Key Figure')
    if kf not in OI_KF_KEEP:
        continue
    val = r.get('Value')
    if val is None:
        continue
    snap = r.get('Snapshot', '')
    bu = r.get('BU code') or 'Unknown'
    region = r.get('Region') or r.get('Region Grp') or 'Unknown'
    fa = r.get('FA code', '')
    fa_desc = r.get('FA descr') or FA_DESC_MAP.get(fa, fa)
    btype = r.get('Type Bus D') or 'Not Classified'
    oi_records.append({
        'snapshot': snap,
        'bu': bu,
        'region': region,
        'fa_code': fa,
        'fa_desc': fa_desc,
        'business_type': btype,
        'key_figure': kf,
        'value_keur': round(val / 1000, 3)
    })

save_json('oi_data.json', oi_records)

# ─────────────────────────────────────────────
# FILE 2 — ORDER BOOK OVERVIEW
# ─────────────────────────────────────────────
print('\n[2/4] Extracting Order Book Overview (OB)...')
OB_OV_PATH = os.path.join(DATA_DIR, '7.14 Order Book Overview pivot (BRM HQ views).xlsx')

ob_raw = parse_cache(OB_OV_PATH,
                     'xl/pivotCache/pivotCacheDefinition1.xml',
                     'xl/pivotCache/pivotCacheRecords1.xml')

ob_ov_records = []
for r in ob_raw:
    val = r.get('Val')
    if val is None:
        continue
    try:
        val = float(val)
    except (TypeError, ValueError):
        continue
    period = r.get('Period', '')
    year = r.get('Year', '')
    mth = r.get('Mth name', '')
    bu = r.get('BU c') or 'Unknown'
    bd = r.get('BD c') or ''
    region = r.get('Region') or r.get('RGrp lvl1') or 'Unknown'
    fa_grp = r.get('FA Grp2') or r.get('FA Grp') or 'Unknown'
    bucket = r.get('Key Fig Detail2') or r.get('Key Fig Detail') or 'Unknown'
    geo_fin = r.get('GeoFin') or ''
    ob_ov_records.append({
        'period': period,
        'year': str(year),
        'month': mth,
        'bu': bu,
        'bd': bd,
        'region': region,
        'fa_grp2': fa_grp,
        'bucket': bucket,
        'geo_fin': geo_fin,
        'value_keur': round(val, 3)
    })

save_json('ob_overview.json', ob_ov_records)

# ─────────────────────────────────────────────
# FILE 3 — ORDER BOOK DETAILED
# ─────────────────────────────────────────────
print('\n[3/4] Extracting Order Book Detailed...')
OB_DET_PATH = os.path.join(DATA_DIR, 'Order Book detailed pivot.xlsm')

ob_det_raw = parse_cache(OB_DET_PATH,
                         'xl/pivotCache/pivotCacheDefinition1.xml',
                         'xl/pivotCache/pivotCacheRecords1.xml')

ob_det_records = []
for r in ob_det_raw:
    val = r.get('Val')
    if val is None:
        continue
    try:
        val = float(val)
    except (TypeError, ValueError):
        continue
    customer = r.get('Sold to Name') or r.get('Customer') or 'Unknown'
    project_code = r.get('Proj def code') or ''
    project_desc = r.get('Proj def descr') or ''
    bu = r.get('BU') or 'Unknown'
    region = r.get('Region') or r.get('RGrp lvl1') or 'Unknown'
    fa_code = r.get('FA code') or ''
    fa_desc = r.get('FA descr') or FA_DESC_MAP.get(fa_code, fa_code)
    crm_id = r.get('CRM Opport ID') or ''
    pl_year = r.get('Pl Rec Year') or ''
    pl_qtr = r.get('Pl Rec Qtr') or ''
    line_item = r.get('Line Item') or ''
    rep_year = r.get('Reporting Year') or ''
    rep_month = r.get('Reporting month') or ''
    ob_det_records.append({
        'customer': customer,
        'project_code': project_code,
        'project_desc': project_desc,
        'bu': bu,
        'region': region,
        'fa_code': fa_code,
        'fa_desc': fa_desc,
        'crm_id': crm_id,
        'pl_year': str(pl_year),
        'pl_qtr': str(pl_qtr),
        'line_item': line_item,
        'rep_year': str(rep_year),
        'rep_month': str(rep_month),
        'value_keur': round(val / 1000, 3)
    })

save_json('ob_detailed.json', ob_det_records)

# ─────────────────────────────────────────────
# FILE 4 — TACO P&L
# ─────────────────────────────────────────────
print('\n[4/4] Extracting TACO P&L...')
TACO_PATH = os.path.join(DATA_DIR, '20-TACO pivot 2025 Selectable x-rate.xlsm')

taco_raw = parse_cache(TACO_PATH,
                       'xl/pivotCache/pivotCacheDefinition1.xml',
                       'xl/pivotCache/pivotCacheRecords1.xml')

taco_records = []
for r in taco_raw:
    act = r.get('Actuals')
    bud = r.get('Budget')
    aly = r.get('Actuals LY')
    # Skip records where all are None/0
    if act is None and bud is None and (aly is None or aly == 0.0):
        continue
    month_str = r.get('Month', '')
    try:
        month_int = int(month_str) if month_str else 0
    except ValueError:
        month_int = 0
    bu = r.get('BU c') or 'Unknown'
    region = r.get('Reg c') or r.get('Region') or r.get('RGrp lvl1') or 'Unknown'
    fa_ranked = r.get('FA ranked') or ''
    fa_detail = r.get('FA ranked detail') or ''
    # Extract FA line number (e.g. '02' from '02 - Net Sales Hardware Equi')
    fa_line = fa_ranked[:2] if fa_ranked and len(fa_ranked) >= 2 else ''
    taco_records.append({
        'month': month_int,
        'bu': bu,
        'region': region,
        'fa_ranked': fa_ranked,
        'fa_detail': fa_detail,
        'fa_line': fa_line,
        'actuals_keur': round(act / 1000, 3) if act is not None else None,
        'budget_keur': round(bud / 1000, 3) if bud is not None else None,
        'actuals_ly_keur': round(aly / 1000, 3) if aly is not None else None,
    })

save_json('taco_data.json', taco_records)

# ─────────────────────────────────────────────
# METADATA — filter options
# ─────────────────────────────────────────────
print('\nGenerating metadata...')

def unique_sorted(records, key):
    return sorted(set(r[key] for r in records if r.get(key)))

meta = {
    'oi': {
        'snapshots': unique_sorted(oi_records, 'snapshot'),
        'bus': unique_sorted(oi_records, 'bu'),
        'regions': unique_sorted(oi_records, 'region'),
        'fa_groups': list({r['fa_code']: r['fa_desc'] for r in oi_records}.items()),
        'business_types': unique_sorted(oi_records, 'business_type'),
        'key_figures': unique_sorted(oi_records, 'key_figure'),
    },
    'ob': {
        'periods': unique_sorted(ob_ov_records, 'period'),
        'years': unique_sorted(ob_ov_records, 'year'),
        'bus': unique_sorted(ob_ov_records, 'bu'),
        'regions': unique_sorted(ob_ov_records, 'region'),
        'fa_grp2': unique_sorted(ob_ov_records, 'fa_grp2'),
        'buckets': unique_sorted(ob_ov_records, 'bucket'),
    },
    'taco': {
        'months': sorted(set(r['month'] for r in taco_records if r['month'])),
        'bus': unique_sorted(taco_records, 'bu'),
        'regions': unique_sorted(taco_records, 'region'),
        'fa_lines': unique_sorted(taco_records, 'fa_ranked'),
    }
}
save_json('metadata.json', meta)

print('\n✓ All data extracted successfully.')
print(f'  Output directory: {OUT_DIR}')
