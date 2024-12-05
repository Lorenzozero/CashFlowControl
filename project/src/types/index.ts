export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  walletId: string;
  isRecurring: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    nextDate: string;
    customDays?: number;
  };
}

export interface Wallet {
  id: string;
  name: string;
  type: 'bank' | 'card' | 'cash';
  balance: number;
  savings: number;
  iban?: string;
  cardNumber?: string;
  bank?: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  monthlyContribution?: number;
}

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';