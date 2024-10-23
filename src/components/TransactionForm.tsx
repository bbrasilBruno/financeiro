import { useState } from 'react';
import { Transaction } from '../types';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: `${year}-${month.padStart(2, '0')}-01`,
      description,
      amount: parseFloat(amount),
      category,
      paymentMethod: type === 'expense' ? paymentMethod : undefined,
    });
    setMonth('');
    setYear(new Date().getFullYear().toString());
    setDescription('');
    setAmount('');
    setCategory('');
    setPaymentMethod('');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Add {type === 'income' ? 'Income' : 'Expense'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => {
              const monthNum = (i + 1).toString().padStart(2, '0');
              return (
                <option key={monthNum} value={monthNum}>
                  {new Date(`2000-${monthNum}-01`).toLocaleString('default', { month: 'long' })}
                </option>
              );
            })}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="0.01"
          min="0"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        {type === 'expense' && (
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Payment Method"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="h-5 w-5" />
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </form>
  );
}