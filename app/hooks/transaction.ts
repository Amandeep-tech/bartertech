"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Transaction, TransactionFilters } from '../types/transaction';
import { fetchTransactions, TransactionApiError } from '../services/transaction';

interface UseTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useTransactions(filters: TransactionFilters): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadTransactions = useCallback(
    async (page: number, isInitial: boolean) => {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      if (isInitial) {
        setIsLoading(true);
        setTransactions([]);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);

      try {
        const result = await fetchTransactions({
          page,
          filters: filtersRef.current,
          signal: abortController.signal,
        });

        if (!abortController.signal.aborted) {
          setTransactions((prev) => (isInitial ? result.data : [...prev, ...result.data]));
          setHasMore(result.hasMore);
          setCurrentPage(result.nextPage);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          const errorMessage =
            err instanceof TransactionApiError
              ? err.message
              : 'Failed to load transactions';
          setError(errorMessage);
          setHasMore(false);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    []
  );

  // Initial load and filter changes
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    loadTransactions(1, true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, loadTransactions]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && !isLoading && hasMore) {
      loadTransactions(currentPage, false);
    }
  }, [currentPage, hasMore, isLoading, isLoadingMore, loadTransactions]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    loadTransactions(1, true);
  }, [loadTransactions]);

  return {
    transactions,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
