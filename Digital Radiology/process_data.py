"""
AGFA Digital Radiology Analytics — Data Pipeline
Reads source CSV files and produces JSON files in dashboard/public/data/
"""

import os
import json
import csv
import traceback
from datetime import datetime
from collections import defaultdict

# ─── Paths ─────────────────────────────────────────────────────────────────

BASE = 'C:/Users/vajra/OneDrive/Documents/Work/AGFA Analysis/AgfaAnalytics/Digital Radiology/Power BI Reports'
OUT_DIR = 'C:/Users/vajra/OneDrive/Documents/Work/AGFA Analysis/AgfaAnalytics/Digital Radiology/dashboard/public/data'

CSV_PATHS = {
    'DataWeek':        BASE + '/Dashboards2/Commercial Analytics - Weekly FC Tracker extracted_tables/DataWeek.csv',
    'msd_data':        BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/msd data.csv',
    'opportunity':     BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/opportunity.csv',
    'mapping':         BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/mapping.csv',
    'T_funnel_health': BASE + '/Dashboards3/Commercial Analytics - OI & Funnel Health Cockpit extracted_tables/T funnel health.csv',
    'Others':          BASE + '/Dashboards3/Commercial Analytics - OI & Funnel Health Cockpit extracted_tables/Others.csv',
    'raw_data':        BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/raw data.csv',
    'T_funnel_evo':    BASE + '/Dashboards3/Commercial Analytics - Funnel Evolution Tracker extracted_tables/T funnel evolution tracker.csv',
    'opportunityproduct': BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/opportunityproduct.csv',
    'account':         BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/account.csv',
    'FeedFile':        BASE + '/Dashboards2/Partner Dashboard extracted_tables/FeedFile.csv',
    'DealerList':      BASE + '/Dashboards2/Partner Dashboard extracted_tables/DealerList xl.csv',
    'DealerTargets':   BASE + '/Dashboards2/Partner Dashboard extracted_tables/DealerList_TargetSetting xl.csv',
    'ProductFamily':   BASE + '/Dashboards2/Partner Dashboard extracted_tables/ProductFamilyList xl.csv',
    'RegionPartner':   BASE + '/Dashboards2/Partner Dashboard extracted_tables/Region partner dashboard xl.csv',
    'NewCluster':      BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/New Cluster_ Region Table.csv',
    'msd_subregion':   BASE + '/Dashboards1/Commercial Analytics - OIT Margin & Product Mix 2026 extracted_tables/msd data sub-region.csv',
}

os.makedirs(OUT_DIR, exist_ok=True)


def safe_float(val, default=0.0):
    try:
        if val is None or str(val).strip() in ('', 'None', 'nan', 'NaN', 'NULL', 'null'):
            return default
        return float(str(val).replace(',', '').strip())
    except Exception:
        return default


def safe_int(val, default=0):
    try:
        return int(safe_float(val, default))
    except Exception:
        return default


def read_csv_file(name, max_rows=None):
    """Read a CSV file, return list of dicts. Returns empty list on error."""
    path = CSV_PATHS.get(name, '')
    if not os.path.exists(path):
        print(f"  [WARN] File not found: {path}")
        return []
    try:
        rows = []
        with open(path, encoding='utf-8-sig', errors='replace', newline='') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if max_rows and i >= max_rows:
                    break
                rows.append(row)
        print(f"  [OK] {name}: {len(rows):,} rows loaded")
        return rows
    except Exception as e:
        print(f"  [ERROR] {name}: {e}")
        return []


def write_json(filename, data):
    path = os.path.join(OUT_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, default=str)
    size_kb = os.path.getsize(path) / 1024
    print(f"  [OUT] {filename} written ({size_kb:.1f} KB)")


# ═══════════════════════════════════════════════════════════════════════════════
# 1. kpis.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_kpis(msd_rows, funnel_rows, data_week_rows):
    print("\n[1/10] Building kpis.json ...")
    kpis = {
        "currentWeek": "W12",
        "lastRefreshed": "2026-03-21",
        "oitYTD2026": 0,
        "oitFY2025": 0,
        "oitFY2024": 0,
        "openPipelineTotal": 0,
        "openPipelineCount": 0,
        "wonDeals2026": 0,
        "rtCY_W12": 0,
        "rtBT_W12": 0,
        "rtPY_W12": 0,
        "plannedRecoCount": 0,
        "sapOrderCount": 0,
    }

    for row in msd_rows:
        state = str(row.get('statecodename', '')).strip()
        year_val = str(row.get('Year_Actual', '')).strip()
        av = safe_float(row.get('actualvalue_base', 0))
        ev = safe_float(row.get('estimatedvalue_base', 0))

        if state == 'Won':
            if year_val == '2026':
                kpis['oitYTD2026'] += av
                kpis['wonDeals2026'] += 1
            elif year_val == '2025':
                kpis['oitFY2025'] += av
            elif year_val == '2024':
                kpis['oitFY2024'] += av

            # SAP order count
            sap = str(row.get('agfa_saporderid', '')).strip()
            if sap and sap not in ('', 'None', 'nan'):
                kpis['sapOrderCount'] += 1

        if state == 'Open':
            kpis['openPipelineTotal'] += ev
            kpis['openPipelineCount'] += 1
            # Planned reco count
            prd = str(row.get('agfa_plannedrevenuerecognitiondate', '')).strip()
            if prd and prd not in ('', 'None', 'nan', 'NaT'):
                kpis['plannedRecoCount'] += 1

    # RT CY/BT/PY at W12.0 — aggregate across all destinations
    rt_cy = rt_bt = rt_py = 0.0
    for row in funnel_rows:
        wk = str(row.get('Week', '')).strip()
        try:
            w_num = float(wk)
        except Exception:
            continue
        if abs(w_num - 12.0) < 0.01:
            rt_cy += safe_float(row.get('RT CY', 0))
            rt_bt += safe_float(row.get('RT BT', 0))
            rt_py += safe_float(row.get('RT PY', 0))

    kpis['rtCY_W12'] = round(rt_cy, 2)
    kpis['rtBT_W12'] = round(rt_bt, 2)
    kpis['rtPY_W12'] = round(rt_py, 2)

    write_json('kpis.json', kpis)
    return kpis


# ═══════════════════════════════════════════════════════════════════════════════
# 2. oit_trend.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_oit_trend(msd_rows):
    print("\n[2/10] Building oit_trend.json ...")
    # Target periods
    periods = []
    for y in [2024, 2025, 2026]:
        for q in ['Q1', 'Q2', 'Q3', 'Q4']:
            if y == 2026 and q in ['Q2', 'Q3', 'Q4']:
                continue
            periods.append(f"{y}-{q}")

    agg = defaultdict(lambda: {'oitEUR': 0.0, 'dealCount': 0})

    for row in msd_rows:
        state = str(row.get('statecodename', '')).strip()
        if state != 'Won':
            continue
        yq = str(row.get('YearQuarter', '')).strip()
        # YearQuarter might be like "2024-Q1" or "2024 Q1"
        yq_clean = yq.replace(' ', '-')
        if yq_clean not in periods:
            # Try building from year + quarter
            yr = str(row.get('Year_Actual', '')).strip()
            qt = str(row.get('Quarter_Actual', '')).strip()
            if yr and qt:
                yq_clean = f"{yr}-{qt}"
        if yq_clean in periods:
            av = safe_float(row.get('actualvalue_base', 0))
            agg[yq_clean]['oitEUR'] += av
            agg[yq_clean]['dealCount'] += 1

    result = []
    for p in periods:
        result.append({
            'period': p,
            'oitEUR': round(agg[p]['oitEUR'], 2),
            'dealCount': agg[p]['dealCount'],
        })

    write_json('oit_trend.json', result)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# 3. pipeline_funnel.json
# ═══════════════════════════════════════════════════════════════════════════════

FLAG_ORDER = [
    ('Won', 1),
    ('Included and Secured', 2),
    ('Included', 3),
    ('Included with Risk', 4),
    ('Upside', 5),
    ('Pipeline', 6),
]
FLAG_ALIASES = {
    'included and secured': 'Included and Secured',
    'included with risk': 'Included with Risk',
    'included': 'Included',
    'won': 'Won',
    'upside': 'Upside',
    'pipeline': 'Pipeline',
}

def normalize_flag(f):
    return FLAG_ALIASES.get(str(f).strip().lower(), str(f).strip())


def build_pipeline_funnel(dw_rows):
    print("\n[3/10] Building pipeline_funnel.json ...")

    # W12 snapshot
    snap_agg = defaultdict(lambda: {'amount': 0.0, 'weighted': 0.0, 'count': 0})
    week_agg = defaultdict(lambda: defaultdict(lambda: {'amount': 0.0}))

    WEEKS = ['W03','W04','W05','W06','W07','W08','W09','W10','W11','W12']

    for row in dw_rows:
        snap_wk = str(row.get('Snapshot Week', '')).strip()
        flag_raw = str(row.get('Forecast Flag', '')).strip()
        flag = normalize_flag(flag_raw)
        amt = safe_float(row.get('Amount in EUR', 0))
        w_amt = safe_float(row.get('Weighted Amount in EUR', 0))
        status = str(row.get('Opportunity status', '')).strip()

        if snap_wk == 'W12':
            snap_agg[flag]['amount'] += amt
            snap_agg[flag]['weighted'] += w_amt
            snap_agg[flag]['count'] += 1

        # Weekly trend — only open opps
        if snap_wk in WEEKS and status.lower() not in ('lost', 'cancelled', 'won'):
            week_agg[snap_wk][flag]['amount'] += amt

    snapshot = []
    for flag, sort_order in FLAG_ORDER:
        d = snap_agg.get(flag, {'amount': 0.0, 'weighted': 0.0, 'count': 0})
        snapshot.append({
            'flag': flag,
            'sortOrder': sort_order,
            'amountEUR': round(d['amount'], 2),
            'weightedEUR': round(d['weighted'], 2),
            'count': d['count'],
        })

    weekly_trend = []
    for wk in WEEKS:
        entry = {'week': wk}
        total_open = 0.0
        for flag, _ in FLAG_ORDER:
            key = flag.replace(' ', '').replace('&', 'And').replace('and', 'And')
            # Safe key for JSON
            safe_key = {
                'Won': 'Won',
                'IncludedandSecured': 'IncludedAndSecured',
                'IncludedAndSecured': 'IncludedAndSecured',
                'Included': 'Included',
                'IncludedwithRisk': 'IncludedWithRisk',
                'IncludedWithRisk': 'IncludedWithRisk',
                'Upside': 'Upside',
                'Pipeline': 'Pipeline',
            }.get(flag.replace(' ', ''), flag.replace(' ', ''))

            amt = week_agg[wk].get(flag, {}).get('amount', 0.0)
            amt_m = round(amt / 1_000_000, 3)
            entry[safe_key] = amt_m
            if flag != 'Won':
                total_open += amt
        entry['totalOpen'] = round(total_open / 1_000_000, 3)
        weekly_trend.append(entry)

    write_json('pipeline_funnel.json', {'snapshot': snapshot, 'weeklyTrend': weekly_trend})


# ═══════════════════════════════════════════════════════════════════════════════
# 4. equipment_mix.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_equipment_mix(msd_rows):
    print("\n[4/10] Building equipment_mix.json ...")

    def agg_by_equip(rows):
        agg = defaultdict(lambda: {'eur': 0.0, 'deals': 0})
        for row in rows:
            eq = str(row.get('Equipment type', '') or row.get('agfa_maintypecodename', '')).strip()
            if not eq or eq in ('', 'None', 'nan'):
                eq = 'Unknown'
            av = safe_float(row.get('actualvalue_base', 0))
            agg[eq]['eur'] += av
            agg[eq]['deals'] += 1
        return sorted([
            {'type': k, 'eurM': round(v['eur'] / 1_000_000, 2), 'deals': v['deals']}
            for k, v in agg.items()
        ], key=lambda x: -x['eurM'])

    won_2026 = [r for r in msd_rows if str(r.get('statecodename','')).strip() == 'Won' and str(r.get('Year_Actual','')).strip() == '2026']
    won_2025 = [r for r in msd_rows if str(r.get('statecodename','')).strip() == 'Won' and str(r.get('Year_Actual','')).strip() == '2025']
    won_2024 = [r for r in msd_rows if str(r.get('statecodename','')).strip() == 'Won' and str(r.get('Year_Actual','')).strip() == '2024']

    # For Q1 2026, filter by Quarter_Actual = Q1
    won_2026_q1 = [r for r in won_2026 if str(r.get('Quarter_Actual','')).strip() in ('Q1', '1')]

    write_json('equipment_mix.json', {
        'oit2026Q1': agg_by_equip(won_2026_q1 or won_2026),
        'oit2025FY': agg_by_equip(won_2025),
        'oit2024FY': agg_by_equip(won_2024),
    })


# ═══════════════════════════════════════════════════════════════════════════════
# 5. region_breakdown.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_region_breakdown(msd_rows, dw_rows):
    print("\n[5/10] Building region_breakdown.json ...")

    def agg_by_region_msd(rows):
        agg = defaultdict(lambda: {'eur': 0.0, 'deals': 0})
        for row in rows:
            reg = str(row.get('REGION', '')).strip()
            if not reg or reg in ('', 'None', 'nan'):
                reg = 'Unknown'
            av = safe_float(row.get('actualvalue_base', 0))
            agg[reg]['eur'] += av
            agg[reg]['deals'] += 1
        return sorted([
            {'region': k, 'eurM': round(v['eur'] / 1_000_000, 2), 'deals': v['deals']}
            for k, v in agg.items()
        ], key=lambda x: -x['eurM'])

    won_2026 = [r for r in msd_rows if str(r.get('statecodename','')).strip() == 'Won' and str(r.get('Year_Actual','')).strip() == '2026']
    won_2025 = [r for r in msd_rows if str(r.get('statecodename','')).strip() == 'Won' and str(r.get('Year_Actual','')).strip() == '2025']

    # Pipeline W12 from DataWeek
    pipeline_w12_agg = defaultdict(lambda: {'won': 0.0, 'committed': 0.0, 'upside': 0.0})
    for row in dw_rows:
        snap_wk = str(row.get('Snapshot Week', '')).strip()
        if snap_wk != 'W12':
            continue
        reg = str(row.get('Group of Regions', '') or row.get('Subregion', '')).strip()
        flag = normalize_flag(str(row.get('Forecast Flag', '')).strip())
        amt = safe_float(row.get('Amount in EUR', 0))
        if flag == 'Won':
            pipeline_w12_agg[reg]['won'] += amt
        elif flag in ('Included and Secured', 'Included', 'Included with Risk'):
            pipeline_w12_agg[reg]['committed'] += amt
        elif flag in ('Upside', 'Pipeline'):
            pipeline_w12_agg[reg]['upside'] += amt

    pipeline_w12 = sorted([
        {
            'region': k,
            'wonEUR': round(v['won'] / 1_000_000, 2),
            'committedEUR': round(v['committed'] / 1_000_000, 2),
            'upsideEUR': round(v['upside'] / 1_000_000, 2),
        }
        for k, v in pipeline_w12_agg.items()
    ], key=lambda x: -(x['wonEUR'] + x['committedEUR'] + x['upsideEUR']))

    write_json('region_breakdown.json', {
        'oitByRegion2026': agg_by_region_msd(won_2026),
        'oitByRegion2025': agg_by_region_msd(won_2025),
        'pipelineW12': pipeline_w12,
    })


# ═══════════════════════════════════════════════════════════════════════════════
# 6. kam_scorecard.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_kam_scorecard(dw_rows):
    print("\n[6/10] Building kam_scorecard.json ...")

    WEEKS = ['W03','W04','W05','W06','W07','W08','W09','W10','W11','W12']

    # Collect open opp data per KAM per week
    # Key: KAM name → week → {amount, weighted, flag}
    kam_data = defaultdict(lambda: defaultdict(lambda: {'amount': 0.0, 'weighted': 0.0, 'flag': ''}))
    kam_region = {}

    for row in dw_rows:
        snap_wk = str(row.get('Snapshot Week', '')).strip()
        if snap_wk not in WEEKS:
            continue
        status = str(row.get('Opportunity status', '')).strip().lower()
        if status in ('lost', 'cancelled', 'won'):
            continue
        kam = str(row.get('Opportunity Owner', '')).strip()
        if not kam or kam in ('', 'None', 'nan'):
            continue
        amt = safe_float(row.get('Amount in EUR', 0))
        w_amt = safe_float(row.get('Weighted Amount in EUR', 0))
        flag = normalize_flag(str(row.get('Forecast Flag', '')).strip())
        region = str(row.get('Group of Regions', '') or row.get('Subregion', '')).strip()

        kam_data[kam][snap_wk]['amount'] += amt
        kam_data[kam][snap_wk]['weighted'] += w_amt
        if not kam_data[kam][snap_wk]['flag']:
            kam_data[kam][snap_wk]['flag'] = flag
        if kam not in kam_region:
            kam_region[kam] = region

    # Sort by W12 amount descending, take top 15
    def w12_amt(kam):
        return kam_data[kam].get('W12', {}).get('amount', 0.0)

    top_kams = sorted(kam_data.keys(), key=w12_amt, reverse=True)[:15]

    kams_list = []
    for kam in top_kams:
        weekly_amounts = [round(kam_data[kam].get(wk, {}).get('amount', 0.0) / 1_000_000, 3) for wk in WEEKS]
        weekly_weighted = [round(kam_data[kam].get(wk, {}).get('weighted', 0.0) / 1_000_000, 3) for wk in WEEKS]
        w12 = kam_data[kam].get('W12', {})
        kams_list.append({
            'name': kam,
            'region': kam_region.get(kam, ''),
            'weeklyAmounts': weekly_amounts,
            'weeklyWeighted': weekly_weighted,
            'w12Amount': round(w12.get('amount', 0.0) / 1_000_000, 3),
            'w12Weighted': round(w12.get('weighted', 0.0) / 1_000_000, 3),
            'flagW12': w12.get('flag', ''),
        })

    write_json('kam_scorecard.json', {'weeks': WEEKS, 'kams': kams_list})


# ═══════════════════════════════════════════════════════════════════════════════
# 7. funnel_health.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_funnel_health(funnel_rows):
    print("\n[7/10] Building funnel_health.json ...")

    # Aggregate across all destinations by week number
    week_agg = defaultdict(lambda: {'rtCY': 0.0, 'rtBT': 0.0, 'rtPY': 0.0, 'rtFC': 0.0, 'CY': 0.0})

    for row in funnel_rows:
        wk_raw = str(row.get('Week', '')).strip()
        try:
            wk_num = float(wk_raw)
        except Exception:
            continue
        if wk_num < 1 or wk_num > 52:
            continue
        wk_int = int(round(wk_num))
        week_agg[wk_int]['rtCY'] += safe_float(row.get('RT CY', 0))
        week_agg[wk_int]['rtBT'] += safe_float(row.get('RT BT', 0))
        week_agg[wk_int]['rtPY'] += safe_float(row.get('RT PY', 0))
        week_agg[wk_int]['rtFC'] += safe_float(row.get('RT FC', 0))
        week_agg[wk_int]['CY'] += safe_float(row.get('CY', 0))

    # Build output sorted by week
    result = []
    prev_cy = 0.0
    for wk in sorted(week_agg.keys()):
        d = week_agg[wk]
        weekly_cy = d['CY']
        result.append({
            'week': wk,
            'label': f'W{wk:02d}',
            'rtCY': round(d['rtCY'] / 1_000_000, 3),
            'rtBT': round(d['rtBT'] / 1_000_000, 3),
            'rtPY': round(d['rtPY'] / 1_000_000, 3),
            'rtFC': round(d['rtFC'] / 1_000_000, 3),
            'weeklyCY': round(weekly_cy / 1_000_000, 3),
        })
        prev_cy = d['rtCY']

    write_json('funnel_health.json', result)


# ═══════════════════════════════════════════════════════════════════════════════
# 8. win_loss.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_win_loss(opp_rows, msd_rows):
    print("\n[8/10] Building win_loss.json ...")

    # Build opportunityid → region map from msd_data
    opp_region_map = {}
    for row in msd_rows:
        oid = str(row.get('opportunityid', '')).strip()
        reg = str(row.get('REGION', '')).strip()
        if oid and reg:
            opp_region_map[oid] = reg

    won = lost = open_c = 0
    by_region = defaultdict(lambda: {'won': 0, 'lost': 0})
    by_size = {'<100k': {'won': 0, 'lost': 0}, '100k-500k': {'won': 0, 'lost': 0}, '500k-1M': {'won': 0, 'lost': 0}, '>1M': {'won': 0, 'lost': 0}}
    closed_by_qtr = defaultdict(lambda: {'won': 0, 'wonEUR': 0.0, 'lost': 0})

    for row in opp_rows:
        state = str(row.get('statecodename', '')).strip()
        oid = str(row.get('opportunityid', '')).strip()
        reg_raw = opp_region_map.get(oid, 'Unknown')
        close_date = str(row.get('actualclosedate', '') or row.get('estimatedclosedate', '')).strip()

        if state == 'Won':
            won += 1
            by_region[reg_raw]['won'] += 1
            # Quarter from actualclosedate
            try:
                if close_date and len(close_date) >= 7:
                    y = int(close_date[:4])
                    m = int(close_date[5:7])
                    q = (m - 1) // 3 + 1
                    key = f"{y}-Q{q}"
                    closed_by_qtr[key]['won'] += 1
                    closed_by_qtr[key]['wonEUR'] += safe_float(row.get('actualvalue_base', 0))
            except Exception:
                pass
        elif state in ('Lost', 'Cancelled', 'Dead'):
            lost += 1
            by_region[reg_raw]['lost'] += 1
            try:
                if close_date and len(close_date) >= 7:
                    y = int(close_date[:4])
                    m = int(close_date[5:7])
                    q = (m - 1) // 3 + 1
                    key = f"{y}-Q{q}"
                    closed_by_qtr[key]['lost'] += 1
            except Exception:
                pass
        else:
            open_c += 1

        # Deal size band
        size_val = safe_float(row.get('estimatedvalue_base', 0) or row.get('actualvalue_base', 0))
        band = '<100k' if size_val < 100_000 else ('100k-500k' if size_val < 500_000 else ('500k-1M' if size_val < 1_000_000 else '>1M'))
        if state == 'Won':
            by_size[band]['won'] += 1
        elif state in ('Lost', 'Cancelled', 'Dead'):
            by_size[band]['lost'] += 1

    win_rate = round(won / (won + lost) * 100, 1) if (won + lost) > 0 else 0

    by_region_list = []
    for reg, d in sorted(by_region.items()):
        total = d['won'] + d['lost']
        wr = round(d['won'] / total * 100, 1) if total > 0 else 0
        by_region_list.append({'region': reg, 'won': d['won'], 'lost': d['lost'], 'winRate': wr})
    by_region_list.sort(key=lambda x: -x['won'])

    by_size_list = [
        {'band': b, 'won': d['won'], 'lost': d['lost'],
         'winRate': round(d['won'] / (d['won'] + d['lost']) * 100, 1) if (d['won'] + d['lost']) > 0 else 0}
        for b, d in by_size.items()
    ]

    # By equipment type from msd_data
    by_equip = defaultdict(lambda: {'won': 0, 'lost': 0})
    for row in msd_rows:
        state = str(row.get('statecodename', '')).strip()
        eq = str(row.get('Equipment type', '') or row.get('agfa_maintypecodename', '')).strip() or 'Unknown'
        if state == 'Won':
            by_equip[eq]['won'] += 1
        elif state in ('Lost', 'Cancelled', 'Dead'):
            by_equip[eq]['lost'] += 1

    by_equip_list = []
    for eq, d in sorted(by_equip.items()):
        total = d['won'] + d['lost']
        wr = round(d['won'] / total * 100, 1) if total > 0 else 0
        by_equip_list.append({'equipment': eq, 'won': d['won'], 'lost': d['lost'], 'winRate': wr})
    by_equip_list.sort(key=lambda x: -x['won'])

    # closed by quarter sorted
    cqtr_list = []
    for k in sorted(closed_by_qtr.keys()):
        d = closed_by_qtr[k]
        if k[:4].isdigit() and int(k[:4]) >= 2022:
            cqtr_list.append({
                'period': k,
                'won': d['won'],
                'wonEUR': round(d['wonEUR'] / 1_000_000, 2),
                'lost': d['lost'],
            })

    write_json('win_loss.json', {
        'overall': {'won': won, 'lost': lost, 'open': open_c, 'winRate': win_rate},
        'byRegion': by_region_list[:15],
        'byEquipment': by_equip_list,
        'byDealSize': by_size_list,
        'closedByQuarter': cqtr_list,
    })


# ═══════════════════════════════════════════════════════════════════════════════
# 9. feedfile_summary.json  — 1M+ rows, chunked
# ═══════════════════════════════════════════════════════════════════════════════

def build_feedfile_summary():
    print("\n[9/10] Building feedfile_summary.json (chunked) ...")

    path = CSV_PATHS['FeedFile']
    pf_path = CSV_PATHS['ProductFamily']

    # Load product family list for type mapping
    pf_map = {}  # product family name → type
    try:
        pf_rows = read_csv_file('ProductFamily')
        for row in pf_rows:
            # FeedFile uses 'Product Family Name', ProductFamily CSV uses 'PF Name'
            pf_name = str(row.get('PF Name', '') or row.get('Product Family Name', '') or row.get('ProductFamilyName', '') or '').strip()
            pf_type = str(row.get('TYPE', '') or row.get('Type', '') or '').strip()
            if pf_name:
                pf_map[pf_name] = pf_type
        print(f"  Product family map: {len(pf_map)} entries")
    except Exception as e:
        print(f"  [WARN] ProductFamily load failed: {e}")

    if not os.path.exists(path):
        print(f"  [WARN] FeedFile not found: {path}")
        write_json('feedfile_summary.json', {
            'revenueByYear': [], 'revenueByYearAndType': [], 'topDealers': [], 'channelMix': []
        })
        return

    rev_by_year = defaultdict(float)
    rev_by_year_type = defaultdict(float)
    dealer_year = defaultdict(float)
    dealer_id_map = {}
    channel_year = defaultdict(float)

    chunk_size = 100_000
    total_rows = 0
    chunk_num = 0

    with open(path, encoding='utf-8-sig', errors='replace', newline='') as f:
        reader = csv.DictReader(f)
        chunk = []
        for row in reader:
            chunk.append(row)
            if len(chunk) >= chunk_size:
                chunk_num += 1
                total_rows += len(chunk)
                print(f"  Processing chunk {chunk_num} ({total_rows:,} rows total)...")
                _process_feedfile_chunk(chunk, pf_map, rev_by_year, rev_by_year_type, dealer_year, dealer_id_map, channel_year)
                chunk = []
        if chunk:
            chunk_num += 1
            total_rows += len(chunk)
            print(f"  Processing final chunk {chunk_num} ({total_rows:,} rows total)...")
            _process_feedfile_chunk(chunk, pf_map, rev_by_year, rev_by_year_type, dealer_year, dealer_id_map, channel_year)

    print(f"  FeedFile total rows processed: {total_rows:,}")

    rev_by_year_list = [
        {'year': int(y), 'eurM': round(v / 1_000_000, 2)}
        for y, v in sorted(rev_by_year.items()) if str(y).isdigit()
    ]

    rev_by_year_type_list = []
    for (y, t), v in sorted(rev_by_year_type.items()):
        if str(y).isdigit():
            rev_by_year_type_list.append({'year': int(y), 'type': t, 'eurM': round(v / 1_000_000, 2)})

    top_dealers = sorted([
        {'name': name, 'sapId': did, 'eurM': round(v / 1_000_000, 2)}
        for (name, did), v in dealer_year.items()
    ], key=lambda x: -x['eurM'])[:15]

    channel_mix_list = []
    for (ch, y), v in sorted(channel_year.items()):
        if str(y).isdigit():
            channel_mix_list.append({'channel': ch, 'year': int(y), 'eurM': round(v / 1_000_000, 2)})

    write_json('feedfile_summary.json', {
        'revenueByYear': rev_by_year_list,
        'revenueByYearAndType': rev_by_year_type_list,
        'topDealers': top_dealers,
        'channelMix': channel_mix_list,
    })


def _process_feedfile_chunk(chunk, pf_map, rev_by_year, rev_by_year_type, dealer_year, dealer_id_map, channel_year):
    for row in chunk:
        try:
            yr = str(row.get('Year', '') or '').strip()
            if not yr or not yr.isdigit():
                # Try to extract from Posting Date
                pd_str = str(row.get('Posting Date', '') or '').strip()
                if len(pd_str) >= 4:
                    yr = pd_str[:4]
                else:
                    continue
            if not yr.isdigit():
                continue

            nt = safe_float(row.get('Net Turnover EUR', 0))
            if nt == 0:
                continue

            rev_by_year[yr] += nt

            # Type from ProductFamily
            pf_name = str(row.get('Product Family Name', '') or '').strip()
            pf_type = pf_map.get(pf_name, 'Other')
            if not pf_type:
                pf_type = 'Other'
            rev_by_year_type[(yr, pf_type)] += nt

            # Dealer aggregation
            dealer_name = str(row.get('Bill-to party', '') or row.get('Destination', '') or '').strip()
            dealer_id = str(row.get('Bill-to party', '') or '').strip()
            if dealer_name:
                dealer_year[(dealer_name, dealer_id)] += nt

            # Channel
            channel = str(row.get('SAP channel_', '') or '').strip()
            if channel:
                channel_year[(channel, yr)] += nt
        except Exception:
            pass


# ═══════════════════════════════════════════════════════════════════════════════
# 10. dealer_targets.json
# ═══════════════════════════════════════════════════════════════════════════════

def build_dealer_targets():
    print("\n[10/10] Building dealer_targets.json ...")
    try:
        dealer_rows = read_csv_file('DealerList')
        target_rows = read_csv_file('DealerTargets')

        # Build lookup from DealerList: sapId → market
        dealer_map = {}
        for row in dealer_rows:
            sid = str(row.get('SAP ID', '') or row.get('DealerSapId', '') or '').strip()
            market = str(row.get('Market', '') or row.get('DealerMarket', '') or row.get('Region', '') or '').strip()
            if sid:
                dealer_map[sid] = market

        result = []
        for row in target_rows:
            sid = str(row.get('SAP ID', '') or row.get('DealerSapId', '') or '').strip()
            yr_raw = str(row.get('Year', '') or row.get('TargetYear', '') or '2026').strip()
            try:
                yr = int(float(yr_raw))
            except Exception:
                yr = 2026
            market = dealer_map.get(sid, str(row.get('Market', '') or '').strip())
            q1 = safe_float(row.get('Q1', 0) or row.get('TargetQ1', 0))
            q2 = safe_float(row.get('Q2', 0) or row.get('TargetQ2', 0))
            q3 = safe_float(row.get('Q3', 0) or row.get('TargetQ3', 0))
            q4 = safe_float(row.get('Q4', 0) or row.get('TargetQ4', 0))
            actual = safe_float(row.get('Actual', 0) or row.get('ActualEUR', 0))
            fc = safe_float(row.get('Forecast', 0) or row.get('ForecastEUR', 0))
            result.append({
                'dealerMarket': market,
                'dealerSapId': sid,
                'targetYear': yr,
                'targetQ1': q1,
                'targetQ2': q2,
                'targetQ3': q3,
                'targetQ4': q4,
                'actualEUR': actual,
                'forecastEUR': fc,
            })

        write_json('dealer_targets.json', result)
    except Exception as e:
        print(f"  [ERROR] dealer_targets: {e}")
        write_json('dealer_targets.json', [])


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("AGFA Digital Radiology — Data Pipeline")
    print(f"Output: {OUT_DIR}")
    print("=" * 60)

    # Load shared datasets
    print("\n[LOAD] Loading shared CSV files ...")
    msd_rows = read_csv_file('msd_data')
    dw_rows = read_csv_file('DataWeek')
    funnel_rows = read_csv_file('T_funnel_health')
    opp_rows = read_csv_file('opportunity')

    # Build all JSON outputs
    try:
        build_kpis(msd_rows, funnel_rows, dw_rows)
    except Exception as e:
        print(f"[ERROR] kpis.json: {e}")
        traceback.print_exc()

    try:
        build_oit_trend(msd_rows)
    except Exception as e:
        print(f"[ERROR] oit_trend.json: {e}")
        traceback.print_exc()

    try:
        build_pipeline_funnel(dw_rows)
    except Exception as e:
        print(f"[ERROR] pipeline_funnel.json: {e}")
        traceback.print_exc()

    try:
        build_equipment_mix(msd_rows)
    except Exception as e:
        print(f"[ERROR] equipment_mix.json: {e}")
        traceback.print_exc()

    try:
        build_region_breakdown(msd_rows, dw_rows)
    except Exception as e:
        print(f"[ERROR] region_breakdown.json: {e}")
        traceback.print_exc()

    try:
        build_kam_scorecard(dw_rows)
    except Exception as e:
        print(f"[ERROR] kam_scorecard.json: {e}")
        traceback.print_exc()

    try:
        build_funnel_health(funnel_rows)
    except Exception as e:
        print(f"[ERROR] funnel_health.json: {e}")
        traceback.print_exc()

    try:
        build_win_loss(opp_rows, msd_rows)
    except Exception as e:
        print(f"[ERROR] win_loss.json: {e}")
        traceback.print_exc()

    try:
        build_feedfile_summary()
    except Exception as e:
        print(f"[ERROR] feedfile_summary.json: {e}")
        traceback.print_exc()

    try:
        build_dealer_targets()
    except Exception as e:
        print(f"[ERROR] dealer_targets.json: {e}")
        traceback.print_exc()

    print("\n" + "=" * 60)
    print("Pipeline complete.")
    print(f"JSON files written to: {OUT_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
