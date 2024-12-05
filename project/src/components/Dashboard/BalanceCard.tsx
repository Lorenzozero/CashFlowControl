import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  trend: number;
  type: 'income' | 'expense' | 'balance';
}

export function BalanceCard({ title, amount, trend, type }: BalanceCardProps) {
  const getColorClass = () => {
    switch (type) {
      case 'income':
        return 'bg-green-500/10 text-green-500';
      case 'expense':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  return (
    <div className={`p-6 rounded-xl ${getColorClass()}`}>
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">€{amount.toLocaleString()}</span>
        <div className="flex items-center text-sm">
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
}