/** Format EUR values: 1234567 → "€1.23M" or "€1,235K" */
export function fmtEur(value: number, compact = true): string {
  if (value === 0) return '€0';
  if (compact) {
    if (Math.abs(value) >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  }
  return `€${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Format as kEUR: 1234567 → "1,235 kEUR" */
export function fmtKEur(value: number): string {
  return `${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })} kEUR`;
}

/** Format percentage: 0.514 → "51.4%" */
export function fmtPct(value: number, decimals = 1): string {
  if (isNaN(value) || !isFinite(value)) return '—';
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(decimals)}%`;
}

/** Format number with commas: 1234567 → "1,234,567" */
export function fmtNum(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

/** Format square meters: 12345 → "12,345 m²" */
export function fmtM2(value: number): string {
  return `${fmtNum(value)} m²`;
}

/** Determine KPI status color */
export function kpiStatus(value: number, thresholdGreen: number, thresholdAmber: number): 'green' | 'amber' | 'red' {
  if (value >= thresholdGreen) return 'green';
  if (value >= thresholdAmber) return 'amber';
  return 'red';
}

/** Variance color: positive = green, negative = red */
export function varianceColor(value: number): string {
  return value >= 0 ? '#2E7D32' : '#D32F2F';
}

/** Month names */
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
