import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useWalletStore } from '../../store/useWalletStore';
import { addMonths, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { GoalTracker } from './GoalTracker';

export function BudgetView() {
  const transactions = useTransactionStore((state) => state.transactions);
  const wallets = useWalletStore((state) => state.wallets);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('all');

  const calculateFutureBalance = () => {
    const today = new Date();
    const futureData = [];
    
    // Calculate initial balance
    let runningBalance = selectedWalletId === 'all'
      ? wallets.reduce((acc, w) => acc + w.balance, 0)
      : wallets.find(w => w.id === selectedWalletId)?.balance || 0;

    // Add savings to initial balance if viewing all wallets
    if (selectedWalletId === 'all') {
      runningBalance += wallets.reduce((acc, w) => acc + (w.savings || 0), 0);
    }

    const relevantTransactions = transactions.filter(t => 
      selectedWalletId === 'all' || t.walletId === selectedWalletId
    );

    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(today, i);
      let monthlyChange = 0;

      relevantTransactions
        .filter((t) => t.isRecurring)
        .forEach((t) => {
          const amount = t.type === 'income' ? t.amount : -t.amount;
          
          if (t.recurrence?.frequency === 'monthly') {
            monthlyChange += amount;
          } else if (t.recurrence?.frequency === 'weekly') {
            monthlyChange += amount * 4;
          } else if (t.recurrence?.frequency === 'daily') {
            monthlyChange += amount * 30;
          } else if (t.recurrence?.frequency === 'yearly') {
            monthlyChange += amount / 12;
          } else if (t.recurrence?.frequency === 'custom' && t.recurrence?.customDays) {
            monthlyChange += amount * (30 / t.recurrence.customDays);
          }
        });

      runningBalance += monthlyChange;
      futureData.push({
        month: format(monthDate, 'MMMM yyyy', { locale: it }),
        balance: Math.round(runningBalance),
        change: monthlyChange,
      });
    }

    return futureData;
  };

  const forecastData = calculateFutureBalance();

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-4 md:p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Previsione Patrimonio</h2>
          <select
            value={selectedWalletId}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white rounded-lg px-3 py-2"
          >
            <option value="all">Tutti i portafogli</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                angle={-45}
                textAnchor="end"
                height={60}
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
              <Line 
                type="monotone" 
                dataKey="balance" 
                name="Patrimonio"
                stroke="#3B82F6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="change" 
                name="Variazione Mensile"
                stroke="#10B981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-xl">
        <GoalTracker />
      </div>

      <div className="bg-gray-800 p-4 md:p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Dettagli Previsione</h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {forecastData.map((data) => (
            <div key={data.month} className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">{data.month}</p>
                <p className="text-sm text-gray-400">
                  Variazione: {data.change >= 0 ? '+' : ''}€{data.change.toLocaleString()}
                </p>
              </div>
              <div className={`font-bold ${data.balance >= 0 ? 'text-green-500' : 'text-red-500'} mt-2 md:mt-0`}>
                €{data.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}