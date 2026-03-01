"use client";

import { useMemo, useState } from "react";
import {TransactionFilters} from "../types/transaction"
import { useDebounce } from "../hooks/debounce";
import { useInfiniteScroll } from "../hooks/infiniteScroll";
import { useTransactions } from "../hooks/transaction";
import { InsightsPanel } from "./InsightsPanel";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { TransactionList } from "./TransactionList";
const TransactionDashboard = () => {

  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({
    status: [],
    category: '',
    dateRange: { start: '', end: '' },
    search: '',
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  // Update filters when debounced search changes
   const activeFilters: TransactionFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

    // Fetch transactions with filters
  const {
    transactions,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useTransactions(activeFilters);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore || isLoading,
    threshold: 0.7,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl text-center font-bold text-gray-900 mb-2">
            Transaction Dashboard
          </h1>
        </div>

        <InsightsPanel transactions={transactions} />

        <SearchBar value={searchInput} onChange={handleSearchChange} />

        <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />

        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          onRetry={refresh}
          sentinelRef={sentinelRef as React.RefObject<HTMLDivElement> | null}
        />
      </div>
    </div>
  )
}

export default TransactionDashboard;