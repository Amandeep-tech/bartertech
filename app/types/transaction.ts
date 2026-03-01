export interface Transaction {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  amount: string;
  currency: string;
  category: string;
  status: boolean;
}

export type TransactionStatus = 'success' | 'failed' | 'pending';
export type TransactionCategory = 'withdrawal' | 'deposit' | 'transfer' | 'payment';

export interface TransactionFilters {
  status: TransactionStatus[];
  category: TransactionCategory | '';
  dateRange: {
    start: string;
    end: string;
  };
  search: string;
}

export interface AggregatedInsights {
  totalTransactions: number;
  totalSuccessAmount: number;
  successRate: number;
  topCategory: {
    name: string;
    amount: number;
  } | null;
}

export interface ApiResponse {
  data: Transaction[];
  hasMore: boolean;
  nextPage: number;
}
