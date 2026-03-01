# Transaction Dashboard

A React-based dashboard for viewing and filtering financial transactions.

## Getting Started

### What You Need
- Node.js version 18 or higher
- A Next.js project with App Router and TailwindCSS

### Setup Steps

Clone the repo and install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

That's it! The dashboard should load and start fetching transactions.

---

## How It Works

### The Big Picture

The dashboard fetches transaction data from an API, lets you filter and search through it, and shows you useful stats. As you scroll down, it automatically loads more transactions.

### Project Structure

```
/app/page.tsx                    → Entry point
/components/TransactionDashboard → Main component
/hooks           → this folder handles reuseable logic
/services/transaction.ts         → API logic
```

Everything else supports these core pieces.

---

## Architecture & Design Decisions

### 1. **Custom Hooks for Logic Separation**

**What we did:** Created `useTransactions`, `useInfiniteScroll`, and `useDebounce` hooks.

**Why:** Keeps business logic separate from UI components. Makes the code easier to test and reuse. The dashboard component just connects the pieces together.

**Example:** `useTransactions` handles all the API fetching, error handling, and pagination logic. The component just calls it and displays the results.

---

### 2. **Debounced Search**

**What we did:** Search waits 500ms after you stop typing before making an API call.

**Why:** Without this, we'd make an API call for every keystroke. If you type "Laura", that's 4 API calls. With debouncing, we only make 1 call after you finish typing.

**Trade-off:** There's a small delay (500ms) before search results appear. But this saves bandwidth and prevents overwhelming the API with requests.

---

### 3. **Intersection Observer for Infinite Scroll**

**What we did:** Used the browser's Intersection Observer API to detect when you've scrolled 70% down the page.

**Why:** This is way more efficient than listening to scroll events. Scroll events fire constantly, which can slow down the page. Intersection Observer only fires when needed.

**How it works:** There's an invisible "sentinel" div at the bottom of the list. When it comes into view (at 70% scroll), we load more transactions.

---

### 4. **Client-Side Filtering**

**What we did:** Fetch all transactions from the API, then filter them in the browser.

**Why:** The mock API doesn't support filtering parameters. In a real app, you'd filter on the server.

**Trade-off:** Less efficient for large datasets, but works fine for this demo. We fetch 16 items at a time, so it's not a huge amount of data to filter.

**Future improvement:** Move filtering to the server once we have a proper API.

---

### 5. **Memoized Insights Calculation**

**What we did:** Used React's `useMemo` to calculate stats (total amount, success rate).

**Why:** These calculations run over all loaded transactions. If we did this on every render, it would slow down the UI. `useMemo` only recalculates when the transaction list actually changes.

**Example:** When you scroll and load 16 more transactions, insights recalculate.

---

### 6. **Request Cancellation with AbortController**

**What we did:** Cancel pending API requests when filters change.

**Why:** Imagine you search for "John", then immediately search for "Jane". Without cancellation, both requests would complete, and you might see results for "John" after "Jane" (race condition).

**How it works:** Each API request gets a unique "abort controller". When a new request starts, we cancel the old one.

---

### 7. **Separate Loading States**

**What we did:** Different loading indicators for initial load vs. loading more.

**Why:** Better user experience. When you first open the page, you see skeleton loaders. When you scroll for more, you see a small spinner at the bottom. The page doesn't flash or jump around.

---

### 8. **Component Composition**

**What we did:** Split the UI into small, focused components (SearchBar, FilterBar, InsightsPanel, etc.).

**Why:** Each component has one job. This makes the code easier to understand, test, and modify. You can change the FilterBar without touching the TransactionList.

**Example:** The TransactionCard component only knows how to display one transaction. It doesn't know about filtering, loading, or anything else.

---

## Trade-offs We Considered

### 1. **Client-Side vs. Server-Side Filtering**

**Decision:** Client-side filtering for now.

**Why:** The mock API doesn't support it. In production, you'd definitely want server-side filtering for better performance.

**Impact:** Works fine for small-to-medium datasets. Would need refactoring for thousands of transactions.

---

### 2. **Debounce Delay (500ms)**

**Decision:** 500ms delay on search.

**Why:** Balances between responsiveness and not hammering the API. 300ms felt too quick 1000ms felt too slow (users wait too long).

**Impact:** Slight delay before results appear, but much fewer API calls.

---

### 3. **Pagination Size (16 items)**

**Decision:** Load 16 transactions per page.

**Why:** 
- Too few (like 5): Users scroll constantly, many API calls
- Too many (like 100): Slow initial load, heavy filtering

16 feels like a sweet spot. Mobile users see multiple items, desktop users don't wait long.

---

### 4. **No Virtual Scrolling**

**Decision:** Regular DOM rendering, no virtualization.

**Why:** Keeps the code simpler. Virtual scrolling (only rendering visible items) is complex and only necessary for huge lists (10,000+ items).

**When to reconsider:** If you're loading thousands of transactions, implement virtual scrolling with a library like `react-window`.

---

### 5. **Error Handling**

**Decision:** Show error messages with a retry button, but don't persist errors across filter changes.

**Why:** If an API call fails, you should know. But if you then change a filter, we clear the error and try again. This feels more natural than showing stale errors.

---

## Key Configuration

If you need to tweak behavior:

- **API endpoint:** `services/transactionApi.ts` → `BASE_URL`
- **Items per page:** `services/transactionApi.ts` → `ITEMS_PER_PAGE`
- **Search delay:** `hooks/useDebounce.ts` → `delay` parameter
- **Scroll threshold:** `hooks/useInfiniteScroll.ts` → `threshold` (0.7 = 70%)

---

## What's Next?

If you're extending this dashboard, consider:

1. **Server-side filtering** for better performance
2. **URL parameters** so filters persist on page refresh
3. **Export to CSV** for downloading transaction data
4. **Sorting** by date, amount, or status
5. **Virtual scrolling** if you have massive datasets
6. **Real-time updates** with WebSockets for live transaction feeds

---

## Questions?

The code is commented and organized to be readable. Start with `TransactionDashboard.tsx` to see how everything connects, then explore the hooks and services to understand the data flow.
