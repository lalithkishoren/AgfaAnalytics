import React from 'react';

export type DataConfidence = 'verified' | 'derived' | 'estimated' | 'proxy';

export interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  dataConfidence: DataConfidence;
  dataNote?: string;
  icon?: React.ReactNode;
}

export interface GlobalFilters {
  year: string;
  bu: string;
  budgetClass: string;
  region: string;
}

export const TAB_LABELS = [
  'Data Overview',
  'Executive Summary',
  'Revenue & Margin',
  'Order Pipeline',
  'Product Mix',
  'Geographic',
  'Order Explorer',
];
