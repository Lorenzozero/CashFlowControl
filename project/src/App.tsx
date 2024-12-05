import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { BalanceCard } from './components/Dashboard/BalanceCard';
import { TransactionForm } from './components/Transactions/TransactionForm';
import { TransactionList } from './components/Transactions/TransactionList';
import { BudgetView } from './components/Budget/BudgetView';
import { WalletsView } from './components/Wallets/WalletsView';
import { TransactionChart } from './components/Dashboard/TransactionChart';
import { TimeRangeSelector } from './components/Dashboard/TimeRangeSelector';
import { useTransactionStore } from './store/useTransactionStore';
import { useWalletStore } from './store/useWalletStore';
import { useAppStore } from './store/useAppStore';
import { TimeRange } from './types';

function App() {
  const transactions = useTransactionStore((state) => state.transactions);
  const wallets = useWalletStore((state) => state.wallets);
  const currentView = useAppStore((state) => state.currentView);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');

  const calculateTotals = () => {
    const monthlyTransactions = transactions.filter(t => {
      if (!t.isRecurring) return true;
      
      const amount = t.type === 'income' ? t.amount : -t.amount;
      switch (t.recurrence?.frequency) {
        case 'daily':
          return amount / 30; // Dividi per 30 giorni
        case 'weekly':
          return amount / 4; // Dividi per 4 settimane
        case 'monthly':
          return amount; // Mantieni l'importo mensile
        case 'yearly':
          return amount / 12; // Dividi per 12 mesi
        case 'custom':
          if (t.recurrence.customDays) {
            return amount * (30 / t.recurrence.customDays); // Calcola la proporzione mensile
          }
          return amount;
        default:
          return amount;
      }
    }).reduce(
      (acc, transaction) => {
        let amount = transaction.amount;
        if (transaction.isRecurring) {
          switch (transaction.recurrence?.frequency) {
            case 'daily':
              amount = amount / 30;
              break;
            case 'weekly':
              amount = amount / 4;
              break;
            case 'yearly':
              amount = amount / 12;
              break;
            case 'custom':
              if (transaction.recurrence.customDays) {
                amount = amount * (30 / transaction.recurrence.customDays);
              }
              break;
          }
        }
        
        if (transaction.type === 'income') {
          acc.income += amount;
        } else {
          acc.expenses += amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );

    return monthlyTransactions;
  };

  const { income, expenses } = calculateTotals();
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
  const totalSavings = wallets.reduce((acc, wallet) => acc + wallet.savings, 0);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <BalanceCard
                title="Saldo Totale"
                amount={totalBalance}
                trend={12}
                type="balance"
              />
              <BalanceCard
                title="Entrate Mensili"
                amount={income}
                trend={8}
                type="income"
              />
              <BalanceCard
                title="Uscite Mensili"
                amount={expenses}
                trend={-5}
                type="expense"
              />
            </div>

            <div className="mt-8 bg-gray-800 p-4 md:p-6 rounded-xl">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Andamento Transazioni</h3>
                <TimeRangeSelector
                  selectedRange={timeRange}
                  onRangeChange={setTimeRange}
                />
              </div>
              <TransactionChart
                transactions={transactions}
                timeRange={timeRange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-8">
              <TransactionList />
              <TransactionForm />
            </div>
          </>
        );
      case 'transactions':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <TransactionList />
            <TransactionForm />
          </div>
        );
      case 'wallets':
        return <WalletsView />;
      case 'budget':
        return <BudgetView />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8">
        <header>
          <h2 className="text-2xl md:text-3xl font-bold">
            {currentView === 'dashboard' && 'Benvenuto'}
            {currentView === 'transactions' && 'Gestione Transazioni'}
            {currentView === 'wallets' && 'Gestione Portafogli'}
            {currentView === 'budget' && 'Previsioni Budget'}
          </h2>
          <p className="text-gray-400">
            {currentView === 'dashboard' && `Patrimonio totale: €${(totalBalance + totalSavings).toLocaleString()}`}
            {currentView === 'transactions' && 'Gestisci le tue entrate e uscite'}
            {currentView === 'wallets' && 'Gestisci i tuoi conti e risparmi'}
            {currentView === 'budget' && 'Analisi e previsioni del patrimonio'}
          </p>
        </header>

        {renderContent()}
      </div>
    </Layout>
  );
}

export default App;