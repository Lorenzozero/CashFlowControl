import { create } from 'zustand';
import { Wallet } from '../types';

interface WalletStore {
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  updateWalletBalance: (id: string, amount: number, type: 'add' | 'subtract') => void;
  updateSavings: (id: string, amount: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallets: [
    {
      id: 'cash',
      name: 'Contanti',
      type: 'cash',
      balance: 0,
      savings: 0,
      color: '#22c55e',
    },
  ],
  
  addWallet: (wallet) =>
    set((state) => ({
      wallets: [...state.wallets, { ...wallet, id: crypto.randomUUID() }],
    })),
    
  updateWallet: (id, updates) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === id ? { ...wallet, ...updates } : wallet
      ),
    })),
    
  deleteWallet: (id) =>
    set((state) => ({
      wallets: state.wallets.filter((w) => w.id !== id),
    })),
    
  updateWalletBalance: (id, amount, type) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === id
          ? {
              ...wallet,
              balance:
                type === 'add'
                  ? wallet.balance + amount
                  : wallet.balance - amount,
            }
          : wallet
      ),
    })),
    
  updateSavings: (id, amount) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === id ? { ...wallet, savings: amount } : wallet
      ),
    })),
}));