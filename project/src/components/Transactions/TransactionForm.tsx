import React, { useState } from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useWalletStore } from '../../store/useWalletStore';
import { FrequencyType } from '../../types';

export function TransactionForm() {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const addRecurringTransaction = useTransactionStore((state) => state.addRecurringTransaction);
  const wallets = useWalletStore((state) => state.wallets);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    walletId: '',
    isRecurring: false,
    frequency: 'monthly' as FrequencyType,
    customDays: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.walletId) {
      alert('Seleziona un portafoglio');
      return;
    }

    const transaction = {
      amount: Number(formData.amount),
      type: formData.type as 'income' | 'expense',
      category: formData.category,
      description: formData.description,
      date: formData.date,
      walletId: formData.walletId,
    };

    if (formData.isRecurring) {
      addRecurringTransaction(
        transaction,
        formData.frequency,
        formData.frequency === 'custom' ? Number(formData.customDays) : undefined
      );
    } else {
      addTransaction(transaction);
    }

    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      walletId: '',
      isRecurring: false,
      frequency: 'monthly',
      customDays: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 md:p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Nuova Transazione</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Importo</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="expense">Uscita</option>
            <option value="income">Entrata</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Portafoglio</label>
          <select
            value={formData.walletId}
            onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          >
            <option value="">Seleziona portafoglio</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Categoria</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Data</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Descrizione</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="rounded bg-gray-700 border-gray-600"
          />
          <label className="ml-2 text-sm text-gray-400">Ricorrente</label>
        </div>

        {formData.isRecurring && (
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as FrequencyType })}
              className="block w-full md:w-auto rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="daily">Giornaliera</option>
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
              <option value="yearly">Annuale</option>
              <option value="custom">Personalizzata</option>
            </select>

            {formData.frequency === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.customDays}
                  onChange={(e) => setFormData({ ...formData, customDays: e.target.value })}
                  placeholder="Giorni"
                  className="block w-24 rounded-md bg-gray-700 border-gray-600 text-white"
                  min="1"
                  required
                />
                <span className="text-sm text-gray-400">giorni</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Aggiungi Transazione
      </button>
    </form>
  );
}