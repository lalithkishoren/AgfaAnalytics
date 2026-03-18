import React, { createContext, useContext, useReducer, useMemo, useEffect, ReactNode } from 'react';
import { FilterState } from '../types';

// ── Region → country mappings ─────────────────────────────────────────────────
// OI data uses these region names (canonical display names for Country filter)
export const REGION_TO_COUNTRIES: Record<string, string[]> = {
  EMEA: ['Benelux', 'Direct Export', 'France', 'Iberia', 'Italy', 'Nordic', 'United Kingdom', 'World Wide'],
  Americas: ['Canada', 'Latin America & Mexico', 'USA'],
  APAC: ['AsPac'],
};

// OB data uses slightly different region names
export const OB_REGION_TO_COUNTRIES: Record<string, string[]> = {
  EMEA: ['BeNeLux', 'Dach', 'Direct Export', 'France', 'Iberia', 'Italy', 'Nordic', 'UK', 'Worldwide'],
  Americas: ['Canada', 'Latam', 'N.America', 'USA'],
  APAC: ['Aspac'],
};

// ── Filter helpers (exported so tabs can import them) ────────────────────────
/** Returns true if the given OI region value passes the current region/country filter. */
export function matchOIRegion(
  region: string,
  selectedRegion: string[],
  selectedCountry: string[],
): boolean {
  if (selectedCountry.length > 0) return selectedCountry.includes(region);
  if (selectedRegion.length > 0) {
    return selectedRegion.some((rg) => (REGION_TO_COUNTRIES[rg] ?? []).includes(region));
  }
  return true;
}

// TACO data uses short region codes — group mapping
export const TACO_REGION_TO_COUNTRIES: Record<string, string[]> = {
  EMEA:     ['BNLU', 'DACH', 'DE', 'EUR', 'FRAN', 'IBER', 'ITAL', 'NORD', 'UK', 'WW'],
  Americas: ['CANA', 'LA&M', 'USA'],
  APAC:     ['ASEA', 'ASP'],
};

// OI country name → TACO region code mapping
export const OI_TO_TACO_REGION: Record<string, string | string[]> = {
  'Benelux':                'BNLU',
  'Direct Export':          'DE',
  'France':                 'FRAN',
  'Iberia':                 'IBER',
  'Italy':                  'ITAL',
  'Nordic':                 'NORD',
  'United Kingdom':         'UK',
  'World Wide':             'WW',
  'Canada':                 'CANA',
  'Latin America & Mexico': 'LA&M',
  'USA':                    'USA',
  'AsPac':                  ['ASEA', 'ASP'],
};

/**
 * Full TACO region filter — handles region group (EMEA/Americas/APAC)
 * and country sub-filter (OI canonical names mapped to TACO codes).
 */
export function matchTACOFull(
  region: string,
  selectedRegion: string[],
  selectedCountry: string[],
): boolean {
  if (selectedCountry.length > 0) {
    // Expand OI country names to TACO codes
    const tacoCodes: string[] = selectedCountry.flatMap((c) => {
      const mapped = OI_TO_TACO_REGION[c];
      if (!mapped) return [c]; // pass through if no mapping
      return Array.isArray(mapped) ? mapped : [mapped];
    });
    return tacoCodes.includes(region);
  }
  if (selectedRegion.length > 0) {
    return selectedRegion.some((rg) => (TACO_REGION_TO_COUNTRIES[rg] ?? []).includes(region));
  }
  return true;
}

// OI country name → OB region name mapping (for cross-dataset country sub-filter)
export const OI_TO_OB_COUNTRY: Record<string, string> = {
  'Benelux':                   'BeNeLux',
  'United Kingdom':            'UK',
  'World Wide':                'Worldwide',
  'Latin America & Mexico':    'Latam',
  'AsPac':                     'Aspac',
  // identical names (mapped anyway for completeness)
  'Canada': 'Canada', 'France': 'France', 'Iberia': 'Iberia',
  'Italy': 'Italy', 'Nordic': 'Nordic', 'USA': 'USA',
  'Direct Export': 'Direct Export',
};

/** Returns true if the given OB region value passes the current region filter (high-level group only). */
export function matchOBRegion(region: string, selectedRegion: string[]): boolean {
  if (selectedRegion.length === 0) return true;
  return selectedRegion.some((rg) => (OB_REGION_TO_COUNTRIES[rg] ?? []).includes(region));
}

/**
 * Full OB region filter — handles both region-group (EMEA/Americas/APAC)
 * and country sub-filter (OI canonical names mapped to OB names).
 */
export function matchOBFull(
  region: string,
  selectedRegion: string[],
  selectedCountry: string[],
): boolean {
  if (selectedCountry.length > 0) {
    // Map OI country names to OB region names for comparison
    const obEquivalents = selectedCountry.map((c) => OI_TO_OB_COUNTRY[c] ?? c);
    return obEquivalents.includes(region);
  }
  if (selectedRegion.length > 0) {
    return selectedRegion.some((rg) => (OB_REGION_TO_COUNTRIES[rg] ?? []).includes(region));
  }
  return true;
}

/** Returns true if the given BU passes the BU filter (empty = all). */
export function matchBU(bu: string, selectedBU: string[]): boolean {
  return selectedBU.length === 0 || selectedBU.includes(bu);
}

// ── Reducer ───────────────────────────────────────────────────────────────────

type FilterAction =
  | { type: 'SET_BU'; payload: string[] }
  | { type: 'SET_REGION'; payload: string[] }
  | { type: 'SET_COUNTRY'; payload: string[] }
  | { type: 'SET_YEAR'; payload: string }
  | { type: 'SET_PERIOD'; payload: string }
  | { type: 'SET_SNAPSHOT'; payload: string }
  | { type: 'RESET' };

const initialState: FilterState = {
  selectedBU: ['S1'],
  selectedRegion: [],
  selectedCountry: [],
  selectedYear: '2025',
  selectedPeriod: '2026-01',
  selectedSnapshot: '2026-01',
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_BU':
      return { ...state, selectedBU: action.payload };
    case 'SET_REGION':
      // Clearing region also clears country (cascade)
      return { ...state, selectedRegion: action.payload, selectedCountry: [] };
    case 'SET_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'SET_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SET_PERIOD':
      return { ...state, selectedPeriod: action.payload };
    case 'SET_SNAPSHOT':
      return { ...state, selectedSnapshot: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface FilterContextValue {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  buOptions: string[];
  regionOptions: string[];
  countryOptions: string[];
  snapshotOptions: string[];
  periodOptions: string[];
  yearOptions: string[];
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, dispatch] = useReducer(filterReducer, initialState);

  const buOptions = ['S1', 'S2', 'S3', 'S4', 'J0', 'JA', 'K1', 'K2', 'K4'];
  const regionOptions = ['EMEA', 'Americas', 'APAC'];
  const snapshotOptions = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05',
    '2025-06', '2025-07', '2025-08', '2025-09', '2025-10',
    '2025-11', '2025-12', '2026-01',
  ];
  const periodOptions = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05',
    '2025-06', '2025-07', '2025-08', '2025-09', '2025-10',
    '2025-11', '2025-12', '2026-01', '2026-02',
  ];
  const yearOptions = ['2025', '2026'];

  // Country options cascade from selected region groups
  const countryOptions = useMemo(() => {
    if (filters.selectedRegion.length === 0) {
      return Object.values(REGION_TO_COUNTRIES).flat().sort();
    }
    return filters.selectedRegion
      .flatMap((rg) => REGION_TO_COUNTRIES[rg] ?? [])
      .sort();
  }, [filters.selectedRegion]);

  useEffect(() => {
    fetch('/data/metadata.json')
      .then((r) => r.json())
      .catch(() => null); // silently fall back to static defaults
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        dispatch,
        buOptions,
        regionOptions,
        countryOptions,
        snapshotOptions,
        periodOptions,
        yearOptions,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
