import React, { useState } from 'react';
import { useWalletStore } from '../../store/useWalletStore';
import { PiggyBank } from 'lucide-react';

export function SavingsManager() {
  const wallets = useWalletStore((state) => state.wallets);
  const updateSavings = useWalletStore((state) => state.updateSavings);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWallet && savingsAmount) {
      updateSavings(selectedWallet, Number(savingsAmount));
      setSelectedWallet('');
      setSavingsAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-semibold">Gestione Risparmi</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Portafoglio</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          >
            <option value="">Seleziona portafoglio</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} (Risparmi attuali: €{wallet.savings.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">
            Importo Risparmi
          </label>
          <input
            type="number"
            value={savingsAmount}
            onChange={(e) => setSavingsAmount(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
            min="0"
            step="0.01"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Aggiorna Risparmi
        </button>
      </div>
    </form>
  );
}