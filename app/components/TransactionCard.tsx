"use client";

import { Transaction } from '../types/transaction';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getCategoryColor,
} from '../utils/transactionUtils';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const statusStyle = getStatusColor(transaction.status);
  const categoryStyle = getCategoryColor(transaction.category);
  const amount = parseFloat(transaction.amount);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar and Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <img
            src={transaction.avatar}
            alt={transaction.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                transaction.name
              )}&background=random`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {transaction.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">ID: {transaction.id}</p>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}
              >
                {transaction.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Amount and Date */}
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900 mb-1">
            {formatCurrency(amount, transaction.currency)}
          </p>
          <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
