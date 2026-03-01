import { Transaction, AggregatedInsights } from '../types/transaction';

export function calculateInsights(transactions: Transaction[]): AggregatedInsights {
  if (transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalSuccessAmount: 0,
      successRate: 0,
      topCategory: null,
    };
  }

  let totalSuccessAmount = 0;
  let successCount = 0;
  const categoryTotals: Record<string, number> = {};

  for (const transaction of transactions) {
    const amount = parseFloat(transaction.amount);

    if (transaction.status) {
      successCount++;
      totalSuccessAmount += amount;
    }

    // Track category totals
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }
    categoryTotals[transaction.category] += amount;
  }

  const successRate = (successCount / transactions.length) * 100;

  // Find top category
  let topCategory: { name: string; amount: number } | null = null;
  let maxAmount = 0;

  for (const [category, amount] of Object.entries(categoryTotals)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      topCategory = { name: category, amount };
    }
  }

  return {
    totalTransactions: transactions.length,
    totalSuccessAmount,
    successRate,
    topCategory,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getStatusColor(status: boolean): {
  bg: string;
  text: string;
  label: string;
} {
  if (status) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Success',
    };
  }
  return {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Failed',
  };
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    withdrawal: 'bg-purple-100 text-purple-800',
    deposit: 'bg-blue-100 text-blue-800',
    transfer: 'bg-yellow-100 text-yellow-800',
    payment: 'bg-pink-100 text-pink-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}
