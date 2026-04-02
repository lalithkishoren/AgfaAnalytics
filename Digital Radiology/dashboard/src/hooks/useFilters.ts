import { useReducer, useCallback, useMemo } from 'react';
import { GlobalFilters, FilterAction } from '../types';

const initialFilters: GlobalFilters = {
  year: 2026,
  quarter: 'all',
  equipment: 'all',
  region: 'all',
};

function filterReducer(state: GlobalFilters, action: FilterAction): GlobalFilters {
  switch (action.type) {
    case 'SET_YEAR': return { ...state, year: action.payload };
    case 'SET_QUARTER': return { ...state, quarter: action.payload };
    case 'SET_EQUIPMENT': return { ...state, equipment: action.payload };
    case 'SET_REGION': return { ...state, region: action.payload };
    case 'SET_MULTIPLE': return { ...state, ...action.payload };
    case 'RESET_ALL': return initialFilters;
    default: return state;
  }
}

export function useFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const setYear = useCallback((v: number | 'all') => dispatch({ type: 'SET_YEAR', payload: v }), []);
  const setQuarter = useCallback((v: string | 'all') => dispatch({ type: 'SET_QUARTER', payload: v }), []);
  const setEquipment = useCallback((v: string | 'all') => dispatch({ type: 'SET_EQUIPMENT', payload: v }), []);
  const setRegion = useCallback((v: string | 'all') => dispatch({ type: 'SET_REGION', payload: v }), []);
  const setMultiple = useCallback((v: Partial<GlobalFilters>) => dispatch({ type: 'SET_MULTIPLE', payload: v }), []);
  const resetAll = useCallback(() => dispatch({ type: 'RESET_ALL' }), []);

  const actions = useMemo(() => ({
    setYear, setQuarter, setEquipment, setRegion, setMultiple, resetAll,
  }), [setYear, setQuarter, setEquipment, setRegion, setMultiple, resetAll]);

  return { filters, actions };
}
