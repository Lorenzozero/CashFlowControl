import { create } from 'zustand';

interface AppState {
  currentView: 'dashboard' | 'transactions' | 'wallets' | 'budget';
  setCurrentView: (view: AppState['currentView']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
}));