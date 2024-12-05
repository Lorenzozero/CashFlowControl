import React, { useState } from 'react';
import { useWalletStore } from '../../store/useWalletStore';

export function WalletForm() {
  const addWallet = useWalletStore((state) => state.addWallet);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: '',
    savings: '',
    iban: '',
    cardNumber: '',
    bank: '',
    color: '#3b82f6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWallet({
      ...formData,
      balance: Number(formData.balance) || 0,
      savings: Number(formData.savings) || 0,
    });
    setFormData({
      name: '',
      type: 'bank',
      balance: '',
      savings: '',
      iban: '',
      cardNumber: '',
      bank: '',
      color: '#3b82f6',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold mb-4">Nuovo Portafoglio</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bank' | 'card' | 'cash' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          >
            <option value="bank">Conto Bancario</option>
            <option value="card">Carta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Saldo Iniziale</label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Risparmi</label>
          <input
            type="number"
            value={formData.savings}
            onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {formData.type === 'bank' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400">IBAN</label>
            <input
              type="text"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
        )}

        {formData.type === 'card' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400">Numero Carta</label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
        )}

        {formData.type === 'bank' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400">Banca</label>
            <input
              type="text"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400">Colore</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="mt-1 block w-full h-10 rounded-md bg-gray-700 border-gray-600"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Aggiungi Portafoglio
      </button>
    </form>
  );
}