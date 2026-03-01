import { Transaction, TransactionFilters } from '../types/transaction';

const BASE_URL = 'https://696e0139d7bacd2dd7155c6a.mockapi.io/barter-tech/transactions';
const ITEMS_PER_PAGE = 16;

export class TransactionApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'TransactionApiError';
  }
}

interface FetchTransactionsParams {
  page: number;
  filters: TransactionFilters;
  signal?: AbortSignal;
}

export async function fetchTransactions({
  page,
  filters,
  signal,
}: FetchTransactionsParams): Promise<{
  data: Transaction[];
  hasMore: boolean;
  nextPage: number;
}> {
  try {
    const url = `${BASE_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`;
    
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new TransactionApiError(
        `Failed to fetch transactions: ${response.statusText}`,
        response.status
      );
    }

    const data: Transaction[] = await response.json();

    // Client-side filtering since the API doesn't support query params
    const filteredData = applyFilters(data, filters);

    // Check if there's more data by seeing if we got a full page
    const hasMore = data.length === ITEMS_PER_PAGE;

    return {
      data: filteredData,
      hasMore,
      nextPage: page + 1,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new TransactionApiError('Request was cancelled');
      }
      throw new TransactionApiError(error.message);
    }
    throw new TransactionApiError('An unknown error occurred');
  }
}

function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return transactions.filter((transaction) => {
    // Status filter
    if (filters.status.length > 0) {
      const transactionStatus = getTransactionStatus(transaction.status);
      if (!filters.status.includes(transactionStatus)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const transactionDate = new Date(transaction.createdAt);
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (transactionDate < startDate) {
          return false;
        }
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (transactionDate > endDate) {
          return false;
        }
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = transaction.name.toLowerCase().includes(searchLower);
      const idMatch = transaction.id.toLowerCase().includes(searchLower);
      if (!nameMatch && !idMatch) {
        return false;
      }
    }

    return true;
  });
}

function getTransactionStatus(status: boolean): 'success' | 'failed' | 'pending' {
  // For this demo, we'll map boolean to success/failed
  // In a real app, you might have a tri-state value
  return status ? 'success' : 'failed';
}
