import { useReducer, useCallback, useMemo } from 'react';
import { GlobalFilters, FilterAction } from '../types';

const initialFilters: GlobalFilters = {
  year: 2026,
  quarter: 'all',
  product: 'all',
  region: 'all',
  customer: 'all',
  forType: 'all',
  thirdPartyOrIco: 'all',
};

function filterReducer(state: GlobalFilters, action: FilterAction): GlobalFilters {
  switch (action.type) {
    case 'SET_YEAR': return { ...state, year: action.payload };
    case 'SET_QUARTER': return { ...state, quarter: action.payload };
    case 'SET_PRODUCT': return { ...state, product: action.payload };
    case 'SET_REGION': return { ...state, region: action.payload };
    case 'SET_CUSTOMER': return { ...state, customer: action.payload };
    case 'SET_FOR_TYPE': return { ...state, forType: action.payload };
    case 'SET_THIRD_PARTY': return { ...state, thirdPartyOrIco: action.payload };
    case 'SET_MULTIPLE': return { ...state, ...action.payload };
    case 'RESET_ALL': return initialFilters;
    default: return state;
  }
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const setYear = useCallback((v: number | 'all') => dispatch({ type: 'SET_YEAR', payload: v }), []);
  const setQuarter = useCallback((v: string | 'all') => dispatch({ type: 'SET_QUARTER', payload: v }), []);
  const setProduct = useCallback((v: string | 'all') => dispatch({ type: 'SET_PRODUCT', payload: v }), []);
  const setRegion = useCallback((v: string | 'all') => dispatch({ type: 'SET_REGION', payload: v }), []);
  const setCustomer = useCallback((v: string | 'all') => dispatch({ type: 'SET_CUSTOMER', payload: v }), []);
  const setForType = useCallback((v: string | 'all') => dispatch({ type: 'SET_FOR_TYPE', payload: v }), []);
  const setThirdParty = useCallback((v: string | 'all') => dispatch({ type: 'SET_THIRD_PARTY', payload: v }), []);
  const setMultiple = useCallback((v: Partial<GlobalFilters>) => dispatch({ type: 'SET_MULTIPLE', payload: v }), []);
  const resetAll = useCallback(() => dispatch({ type: 'RESET_ALL' }), []);

  const actions = useMemo(() => ({
    setYear, setQuarter, setProduct, setRegion, setCustomer, setForType, setThirdParty, setMultiple, resetAll,
  }), [setYear, setQuarter, setProduct, setRegion, setCustomer, setForType, setThirdParty, setMultiple, resetAll]);

  return { filters, actions };
}

// Quarter helper
export function getQuarter(month: number): string {
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}
