import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TimeRange } from '../../types';
import { subMonths, subYears, format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { it } from 'date-fns/locale';

interface TransactionChartProps {
  transactions: Transaction[];
  timeRange: TimeRange;
}

export function TransactionChart({ transactions, timeRange }: TransactionChartProps) {
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case '1M':
        return { start: subMonths(now, 1), end: now };
      case '3M':
        return { start: subMonths(now, 3), end: now };
      case '6M':
        return { start: subMonths(now, 6), end: now };
      case '1Y':
        return { start: subYears(now, 1), end: now };
      case 'ALL':
        return { start: new Date(0), end: now };
    }
  };

  const prepareChartData = () => {
    const dateRange = getDateRange();
    const monthlyData = new Map();

    transactions
      .filter((t) => isWithinInterval(new Date(t.date), dateRange))
      .forEach((t) => {
        const monthKey = format(new Date(t.date), 'yyyy-MM');
        const monthLabel = format(new Date(t.date), 'MMM yyyy', { locale: it });
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthLabel,
            income: 0,
            expenses: 0,
          });
        }

        const data = monthlyData.get(monthKey);
        if (t.type === 'income') {
          data.income += t.amount;
        } else {
          data.expenses += t.amount;
        }
      });

    return Array.from(monthlyData.values());
  };

  const chartData = prepareChartData();

  return (
    <div className="h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickMargin={10}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `€${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend />
          <Bar dataKey="income" name="Entrate" fill="#10B981" />
          <Bar dataKey="expenses" name="Uscite" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}