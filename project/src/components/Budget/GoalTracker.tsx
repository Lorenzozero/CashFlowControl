import React, { useState } from 'react';
import { Goal } from '../../types';
import { PlusCircle, Target } from 'lucide-react';
import { useTransactionStore } from '../../store/useTransactionStore';

export function GoalTracker() {
  const transactions = useTransactionStore((state) => state.transactions);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });

  const calculateMonthlyContribution = (targetAmount: number, deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const monthsDiff = (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                      (deadlineDate.getMonth() - today.getMonth());
    
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && t.isRecurring)
      .reduce((acc, t) => {
        if (t.recurrence?.frequency === 'monthly') return acc + t.amount;
        if (t.recurrence?.frequency === 'weekly') return acc + (t.amount * 4);
        if (t.recurrence?.frequency === 'daily') return acc + (t.amount * 30);
        if (t.recurrence?.frequency === 'yearly') return acc + (t.amount / 12);
        return acc;
      }, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.isRecurring)
      .reduce((acc, t) => {
        if (t.recurrence?.frequency === 'monthly') return acc + t.amount;
        if (t.recurrence?.frequency === 'weekly') return acc + (t.amount * 4);
        if (t.recurrence?.frequency === 'daily') return acc + (t.amount * 30);
        if (t.recurrence?.frequency === 'yearly') return acc + (t.amount / 12);
        return acc;
      }, 0);

    const monthlySavings = monthlyIncome - monthlyExpenses;
    const requiredMonthly = targetAmount / monthsDiff;

    return {
      required: requiredMonthly,
      possible: monthlySavings,
      monthsToGoal: monthlySavings > 0 ? Math.ceil(targetAmount / monthlySavings) : Infinity,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmount = Number(newGoal.targetAmount);
    const { required, possible, monthsToGoal } = calculateMonthlyContribution(
      targetAmount,
      newGoal.deadline
    );

    const goal: Goal = {
      id: crypto.randomUUID(),
      name: newGoal.name,
      targetAmount,
      currentAmount: 0,
      deadline: newGoal.deadline,
      monthlyContribution: required,
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: '', deadline: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Obiettivi di Risparmio</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Nuovo Obiettivo</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nome Obiettivo</label>
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Importo Target</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Data Obiettivo</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Aggiungi Obiettivo
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const { required, possible, monthsToGoal } = calculateMonthlyContribution(
            goal.targetAmount - goal.currentAmount,
            goal.deadline || new Date().toISOString()
          );

          return (
            <div key={goal.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {goal.name}
                </h4>
                <span className="text-sm text-gray-400">
                  €{goal.currentAmount.toLocaleString()} / €{goal.targetAmount.toLocaleString()}
                </span>
              </div>

              <div className="h-2 bg-gray-600 rounded-full mb-2">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="text-sm text-gray-400">
                <p>Contributo mensile necessario: €{required.toLocaleString()}</p>
                <p>Risparmio mensile attuale: €{possible.toLocaleString()}</p>
                <p>
                  {possible >= required
                    ? `Obiettivo raggiungibile in ${monthsToGoal} mesi`
                    : 'Obiettivo non raggiungibile con il risparmio attuale'}
                </p>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && !showForm && (
          <p className="text-center text-gray-400">Nessun obiettivo impostato</p>
        )}
      </div>
    </div>
  );
}