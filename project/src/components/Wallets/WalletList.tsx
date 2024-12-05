import React from 'react';
import { useWalletStore } from '../../store/useWalletStore';
import { Wallet, CreditCard, Trash2, PiggyBank, BanknoteIcon } from 'lucide-react';

export function WalletList() {
  const wallets = useWalletStore((state) => state.wallets);
  const deleteWallet = useWalletStore((state) => state.deleteWallet);

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Wallet className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'cash':
        return <BanknoteIcon className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="bg-gray-800 p-6 rounded-xl"
          style={{ borderLeft: `4px solid ${wallet.color}` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              {getWalletIcon(wallet.type)}
              <h3 className="text-lg font-semibold">{wallet.name}</h3>
            </div>
            {wallet.id !== 'cash' && (
              <button
                onClick={() => deleteWallet(wallet.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Saldo</span>
              <span className="text-xl font-bold">
                €{wallet.balance.toLocaleString()}
              </span>
            </div>

            {wallet.savings > 0 && (
              <div className="flex justify-between items-center text-green-500">
                <span className="flex items-center gap-1">
                  <PiggyBank className="w-4 h-4" />
                  Risparmi
                </span>
                <span>€{wallet.savings.toLocaleString()}</span>
              </div>
            )}

            {wallet.iban && (
              <div className="text-sm text-gray-400">
                <p>IBAN: {wallet.iban}</p>
              </div>
            )}
            
            {wallet.cardNumber && (
              <div className="text-sm text-gray-400">
                <p>Carta: ****{wallet.cardNumber.slice(-4)}</p>
              </div>
            )}
            
            {wallet.bank && (
              <div className="text-sm text-gray-400">
                <p>Banca: {wallet.bank}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}