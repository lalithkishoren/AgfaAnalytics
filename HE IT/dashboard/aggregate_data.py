"""
AGFA HE IT — Data Aggregation Script
Reads raw JSON files → produces compact summary JSONs for the dashboard frontend.
Run after extract_data.py: py -3 aggregate_data.py
"""
import sys, io, json, os
from collections import defaultdict
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DATA_DIR = os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'data')

def load(name):
    with open(os.path.join(DATA_DIR, name), encoding='utf-8') as f:
        return json.load(f)

def save(name, data):
    path = os.path.join(DATA_DIR, name)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    size = os.path.getsize(path) // 1024
    print(f'  {name}: {len(data):,} records → {size}KB')

def agg_sum(records, group_keys, value_keys):
    buckets = defaultdict(lambda: defaultdict(float))
    for r in records:
        key = tuple(str(r.get(k, '') or '') for k in group_keys)
        for vk in value_keys:
            v = r.get(vk)
            if v is not None:
                buckets[key][vk] += v
    result = []
    for key, vals in buckets.items():
        row = {group_keys[i]: key[i] for i in range(len(group_keys))}
        row.update({k: round(v, 2) for k, v in vals.items()})
        result.append(row)
    return result

# ─────────────────────────────────────────────
# OI AGGREGATIONS
# ─────────────────────────────────────────────
print('\nAggregating OI...')
oi = load('oi_data.json')

# Monthly MONTH ACT/FOR/LY/BUD by BU × Region × FA
oi_month_kf = {'MONTH ACT', 'MONTH FOR', 'MONTH LY', 'MONTH BUD'}
oi_for_chart = [r for r in oi if r['key_figure'] in oi_month_kf]
oi_monthly = agg_sum(oi_for_chart,
                     ['snapshot', 'bu', 'region', 'fa_code', 'fa_desc', 'business_type', 'key_figure'],
                     ['value_keur'])
save('oi_monthly.json', oi_monthly)

# YTD by BU × key figure (for KPI cards)
oi_ytd_kf = {'YTD ACT', 'YTD BUD', 'YTD LY'}
oi_for_ytd = [r for r in oi if r['key_figure'] in oi_ytd_kf]
oi_ytd = agg_sum(oi_for_ytd, ['snapshot', 'bu', 'key_figure'], ['value_keur'])
save('oi_ytd.json', oi_ytd)

# FY totals for headline KPIs
oi_fy_kf = {'FY BUD', 'FY (A+F)'}
oi_for_fy = [r for r in oi if r['key_figure'] in oi_fy_kf]
oi_fy = agg_sum(oi_for_fy, ['snapshot', 'bu', 'key_figure'], ['value_keur'])
save('oi_fy.json', oi_fy)

# Business type mix by snapshot × BU
oi_btype = agg_sum(
    [r for r in oi if r['key_figure'] == 'MONTH ACT'],
    ['snapshot', 'bu', 'business_type'],
    ['value_keur']
)
save('oi_business_type.json', oi_btype)

# ─────────────────────────────────────────────
# OB OVERVIEW AGGREGATIONS
# ─────────────────────────────────────────────
print('\nAggregating OB Overview...')
ob = load('ob_overview.json')

# By period × BU × bucket (for timeline chart)
ob_timeline = agg_sum(ob, ['period', 'year', 'month', 'bu', 'bucket'], ['value_keur'])
save('ob_timeline.json', ob_timeline)

# By period × BU × region × bucket
ob_regional = agg_sum(ob, ['period', 'bu', 'region', 'bucket'], ['value_keur'])
save('ob_regional.json', ob_regional)

# By period × BU × FA Group
ob_fa = agg_sum(ob, ['period', 'bu', 'fa_grp2'], ['value_keur'])
save('ob_fa.json', ob_fa)

# ─────────────────────────────────────────────
# OB DETAILED AGGREGATIONS
# ─────────────────────────────────────────────
print('\nAggregating OB Detailed...')
ob_det = load('ob_detailed.json')

# Top customers by total backlog value (absolute)
cust_agg = defaultdict(float)
for r in ob_det:
    c = r.get('customer', 'Unknown')
    v = r.get('value_keur', 0) or 0
    cust_agg[c] += v

top_customers = sorted(
    [{'customer': k, 'value_keur': round(v, 2)} for k, v in cust_agg.items() if v != 0],
    key=lambda x: abs(x['value_keur']),
    reverse=True
)[:50]
save('ob_top_customers.json', top_customers)

# Planned recognition schedule by year × quarter × BU
ob_schedule = agg_sum(
    [r for r in ob_det if r.get('pl_year') and r.get('pl_year') != 'None'],
    ['pl_year', 'pl_qtr', 'bu', 'fa_desc', 'line_item'],
    ['value_keur']
)
save('ob_schedule.json', ob_schedule)

# Flat detail for DataGrid (limited to manageable size, latest rep_year)
# Keep only records with a non-zero value
ob_grid = [r for r in ob_det if r.get('value_keur') and r['value_keur'] != 0][:5000]
save('ob_grid.json', ob_grid)

# ─────────────────────────────────────────────
# TACO AGGREGATIONS
# ─────────────────────────────────────────────
print('\nAggregating TACO...')
taco = load('taco_data.json')

# P&L summary by month × BU × FA line (all lines)
taco_monthly = agg_sum(
    [r for r in taco if r.get('month', 0) > 0],
    ['month', 'bu', 'fa_ranked', 'fa_detail', 'fa_line'],
    ['actuals_keur', 'budget_keur', 'actuals_ly_keur']
)
save('taco_monthly.json', taco_monthly)

# P&L summary by month × BU only (for top-level KPI trend)
taco_by_month_bu = agg_sum(
    [r for r in taco if r.get('month', 0) > 0],
    ['month', 'bu'],
    ['actuals_keur', 'budget_keur', 'actuals_ly_keur']
)
save('taco_by_month_bu.json', taco_by_month_bu)

# P&L by BU × region × month for regional view
taco_regional = agg_sum(
    [r for r in taco if r.get('month', 0) > 0],
    ['month', 'bu', 'region'],
    ['actuals_keur', 'budget_keur', 'actuals_ly_keur']
)
save('taco_regional.json', taco_regional)

# Key P&L line summary — Top-level lines only for waterfall
KEY_PL_LINES = {
    '02', '07', '09', '11',  # Net Sales components
    '26',                     # Net Sales Total
    '29',                     # Gross Margin / COGS start
    '55',                     # TACO Margin
    '63',                     # Product Contribution
    '85',                     # TACO Contribution
}
taco_key_lines = agg_sum(
    [r for r in taco if r.get('fa_line', '') in KEY_PL_LINES and r.get('month', 0) > 0],
    ['month', 'bu', 'fa_ranked', 'fa_line'],
    ['actuals_keur', 'budget_keur', 'actuals_ly_keur']
)
save('taco_key_lines.json', taco_key_lines)

print('\n✓ All aggregations complete.')
