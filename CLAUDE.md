# Digital Hydrogen — Zirfon BI Dashboard

## Project
Agfa Digital Hydrogen business analytics for Zirfon membrane sales. React dashboard deployed to Firebase.

## Stack
- **Frontend**: React 18, TypeScript 5, MUI v7, Recharts, MUI X DataGrid
- **Data pipeline**: Python 3 + Pandas (`process_data.py`) — 7 Excel files → 9 JSON files
- **Hosting**: Firebase (`dhydrogen-dashboard`) — https://dhydrogen-dashboard.web.app

## Commands
```bash
# Dashboard
cd dashboard && npm start          # Dev server (port 3000)
cd dashboard && npm run build      # Production build

# Deploy
cd dashboard && firebase use dhydrogen-dashboard && firebase deploy --only hosting

# Data pipeline (regenerate JSON from Excel)
python process_data.py             # Outputs to dashboard/public/data/
```

## Key Files
- `dashboard/src/App.tsx` — Root component, tab routing, app-level filters, drill-down navigation
- `dashboard/src/hooks/useFilters.ts` — Global filter state (useReducer)
- `dashboard/src/types/index.ts` — All TypeScript interfaces, NavigateAction, FilterAction
- `dashboard/src/tabs/` — 7 tab components (DataOverviewTab, OverviewTab, PipelineTab, RevenueTab, MarginTab, ForecastTab, CustomerTab)
- `dashboard/src/components/KpiCard.tsx` — KPI card with 4-level data confidence system
- `dashboard/src/components/DataConfidenceLegend.tsx` — Trust indicator legend
- `dashboard/src/components/FilterBar.tsx` — Shared filter bar (Year, Quarter, Product, Region, Customer)
- `process_data.py` — Python data pipeline (Excel → JSON)
- `Data/` — Source Excel files (DO NOT commit to git)

## Architecture Rules
- **Data confidence**: Every KPI must have a `dataConfidence` level (verified/derived/estimated/proxy) and a `dataNote` explaining the source. This is non-negotiable — the user's team flagged data trust as the #1 concern.
- **App-level filters**: All tabs share filters via `useFilters()` in App.tsx. Do not add tab-local filter state.
- **Drill-down**: KPI cards and charts should be clickable where possible, using `onNavigate({ tab, filters })`.
- **Hardcoded values**: Several KPIs are hardcoded (budget €17.3M, forecast €6.2M, LY €30.8M, forecast composition). These must always be marked as `dataConfidence="estimated"`.

## Data Sources
1. Customer Master.xlsx — 304 customers
2. Quotation.xlsx — 1,337 quotes (2023–2025)
3. AP1 SAP extract on sales orders 2026.xlsx — 46 orders
4. Sales zirfon GHS.xlsx — 920 orders (central hub)
5. FY 2025.xls — Controller's SAP BI workbook
6. ACTFY2025_Forecasting file.xlsx — Forecasting workbook
7. Sales Forecast February2026.xlsx — Latest FY2026 forecast

## Analysis Docs
- `Data_Analysis_Findings.md` — File-by-file data analysis
- `Controller_Analytics_Blueprint.md` — KPIs, data gaps (G1-G14), questions (Q1-Q22)
- `Existing_Reports_Analysis.md` — FY2025 & forecasting workbook analysis
