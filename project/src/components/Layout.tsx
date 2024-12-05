import React from 'react';
import { LayoutDashboard, Wallet, PieChart, BanknoteIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentView, setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="fixed top-0 left-0 h-full w-64 bg-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8">
          <BanknoteIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold">CashFlowControl</h1>
        </div>
        
        <div className="space-y-2">
          <NavItem 
            icon={<LayoutDashboard />} 
            text="Dashboard" 
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem 
            icon={<Wallet />} 
            text="Portafogli" 
            active={currentView === 'wallets'}
            onClick={() => setCurrentView('wallets')}
          />
          <NavItem 
            icon={<BanknoteIcon />} 
            text="Transazioni" 
            active={currentView === 'transactions'}
            onClick={() => setCurrentView('transactions')}
          />
          <NavItem 
            icon={<PieChart />} 
            text="Budget" 
            active={currentView === 'budget'}
            onClick={() => setCurrentView('budget')}
          />
        </div>
      </nav>
      
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, text, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors
        ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}