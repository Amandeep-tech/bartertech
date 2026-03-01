"use client";

import { useMemo } from 'react';
import { Transaction } from '../types/transaction';
import { calculateInsights, formatCurrency } from '../utils/transactionUtils';

interface InsightsPanelProps {
  transactions: Transaction[];
}

export function InsightsPanel({ transactions }: InsightsPanelProps) {
  const insights = useMemo(() => calculateInsights(transactions), [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InsightCard
        title="Total Transactions"
        value={insights.totalTransactions.toLocaleString()}
        icon="📊"
      />
      <InsightCard
        title="Total Success Amount"
        value={formatCurrency(insights.totalSuccessAmount)}
        icon="💰"
      />
      <InsightCard
        title="Success Rate"
        value={`${insights.successRate.toFixed(1)}%`}
        icon="✓"
        subtitle={`${Math.round(
          (insights.successRate / 100) * insights.totalTransactions
        )} successful`}
      />
      <InsightCard
        title="Top Category"
        value={insights.topCategory?.name || 'N/A'}
        icon="🏆"
        subtitle={
          insights.topCategory
            ? formatCurrency(insights.topCategory.amount)
            : undefined
        }
      />
    </div>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
}

function InsightCard({ title, value, icon, subtitle }: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
