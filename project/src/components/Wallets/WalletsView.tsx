import React from 'react';
import { WalletList } from './WalletList';
import { WalletForm } from './WalletForm';
import { SavingsManager } from './SavingsManager';

export function WalletsView() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold">Gestione Portafogli</h2>
        <p className="text-gray-400">Gestisci i tuoi conti, carte e contanti</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WalletForm />
        <SavingsManager />
      </div>

      <WalletList />
    </div>
  );
}