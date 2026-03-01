"use client";

export function TransactionSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar skeleton */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
          
          <div className="flex-1">
            {/* Name skeleton */}
            <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
            
            {/* ID skeleton */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            
            {/* Badges skeleton */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="text-right">
          {/* Amount skeleton */}
          <div className="h-7 bg-gray-200 rounded w-24 mb-2 ml-auto" />
          
          {/* Date skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32 ml-auto" />
        </div>
      </div>
    </div>
  );
}
