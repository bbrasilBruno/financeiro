import { useState } from 'react';
import { Investment } from '../types';
import { PlusCircle } from 'lucide-react';

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id'>) => void;
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [returns, setReturns] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: `${year}-${month.padStart(2, '0')}-01`,
      description,
      amount: parseFloat(amount),
      type,
      returns: parseFloat(returns),
    });
    setMonth('');
    setYear(new Date().getFullYear().toString());
    setDescription('');
    setAmount('');
    setType('');
    setReturns('');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Investment</h3>
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
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Investment Type"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          value={returns}
          onChange={(e) => setReturns(e.target.value)}
          placeholder="Expected Returns (%)"
          step="0.01"
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="h-5 w-5" />
          Add Investment
        </button>
      </div>
    </form>
  );
}