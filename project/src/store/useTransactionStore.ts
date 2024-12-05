import { create } from 'zustand';
import { Transaction, FrequencyType } from '../types';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { useWalletStore } from './useWalletStore';

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addRecurringTransaction: (
    transaction: Omit<Transaction, 'id'>,
    frequency: FrequencyType,
    customDays?: number
  ) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  
  addTransaction: (transaction) => {
    const { updateWalletBalance } = useWalletStore.getState();
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    
    updateWalletBalance(
      transaction.walletId,
      transaction.amount,
      transaction.type === 'income' ? 'add' : 'subtract'
    );
    
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
  },
  
  addRecurringTransaction: (transaction, frequency, customDays) => {
    const getNextDate = (date: Date) => {
      switch (frequency) {
        case 'daily':
          return addDays(date, 1);
        case 'weekly':
          return addWeeks(date, 1);
        case 'monthly':
          return addMonths(date, 1);
        case 'yearly':
          return addYears(date, 1);
        case 'custom':
          return addDays(date, customDays || 1);
      }
    };

    const { updateWalletBalance } = useWalletStore.getState();
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      isRecurring: true,
      recurrence: {
        frequency,
        nextDate: getNextDate(new Date(transaction.date)).toISOString(),
        customDays,
      },
    };
    
    updateWalletBalance(
      transaction.walletId,
      transaction.amount,
      transaction.type === 'income' ? 'add' : 'subtract'
    );
    
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
  },
  
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));