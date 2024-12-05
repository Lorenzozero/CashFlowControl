import React from 'react';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useWalletStore } from '../../store/useWalletStore';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function TransactionList() {
  const transactions = useTransactionStore((state) => state.transactions);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const wallets = useWalletStore((state) => state.wallets);

  const getWalletName = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId);
    return wallet ? wallet.name : 'Portafoglio eliminato';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Transazioni Recenti</h3>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  transaction.type === 'income'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
              </div>
              
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(transaction.date), 'PPP', { locale: it })}
                  {transaction.isRecurring && (
                    <span className="ml-2 text-blue-400">
                      (Ricorrente {transaction.recurrence?.frequency})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {getWalletName(transaction.walletId)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                €{transaction.amount.toLocaleString()}
              </span>
              
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-center text-gray-400">Nessuna transazione presente</p>
        )}
      </div>
    </div>
  );
}