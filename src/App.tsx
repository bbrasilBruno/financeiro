import { useState, useEffect } from 'react';
import { MonthlyData, Transaction, Investment } from './types';
import { getMonthData, updateMonthData } from './utils/storage';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { InvestmentForm } from './components/InvestmentForm';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(5, 7));
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [monthData, setMonthData] = useState<MonthlyData>({ income: [], expenses: [], investments: [] });

  useEffect(() => {
    const data = getMonthData(`${selectedYear}-${selectedMonth}`);
    setMonthData(data);
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  const updateData = (newData: MonthlyData) => {
    setMonthData(newData);
    updateMonthData(`${selectedYear}-${selectedMonth}`, newData);
  };

  const addTransaction = (type: 'income' | 'expense') => (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    const newData = {
      ...monthData,
      [type === 'income' ? 'income' : 'expenses']: [...monthData[type === 'income' ? 'income' : 'expenses'], newTransaction],
    };
    updateData(newData);
  };

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment = { ...investment, id: crypto.randomUUID() };
    const newData = {
      ...monthData,
      investments: [...monthData.investments, newInvestment],
    };
    updateData(newData);
  };

  const deleteTransaction = (type: 'income' | 'expense') => (id: string) => {
    const newData = {
      ...monthData,
      [type === 'income' ? 'income' : 'expenses']: monthData[type === 'income' ? 'income' : 'expenses'].filter(
        (t) => t.id !== id
      ),
    };
    updateData(newData);
  };

  const editTransaction = (type: 'income' | 'expense') => (transaction: Transaction) => {
    const newData = {
      ...monthData,
      [type === 'income' ? 'income' : 'expenses']: monthData[type === 'income' ? 'income' : 'expenses'].map((t) =>
        t.id === transaction.id ? transaction : t
      ),
    };
    updateData(newData);
  };

  const totalIncome = monthData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = monthData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalInvestments = monthData.investments.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses - totalInvestments;

  const years = Array.from({ length: 2030 - currentYear + 1 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Financial Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="bg-indigo-700 text-white border border-indigo-500 rounded px-3 py-1"
              >
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
                value={selectedYear}
                onChange={handleYearChange}
                className="bg-indigo-700 text-white border border-indigo-500 rounded px-3 py-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Income"
            amount={totalIncome}
            icon={<DollarSign className="h-6 w-6 text-green-500" />}
          />
          <DashboardCard
            title="Expenses"
            amount={totalExpenses}
            icon={<DollarSign className="h-6 w-6 text-red-500" />}
          />
          <DashboardCard
            title="Investments"
            amount={totalInvestments}
            icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
          />
          <DashboardCard
            title="Balance"
            amount={balance}
            icon={<DollarSign className="h-6 w-6 text-indigo-500" />}
          />
        </div>

        <div className="space-y-8">
          <section>
            <TransactionForm type="income" onSubmit={addTransaction('income')} />
            <TransactionList
              type="income"
              transactions={monthData.income}
              onDelete={deleteTransaction('income')}
              onEdit={editTransaction('income')}
            />
          </section>

          <section>
            <TransactionForm type="expense" onSubmit={addTransaction('expense')} />
            <TransactionList
              type="expense"
              transactions={monthData.expenses}
              onDelete={deleteTransaction('expense')}
              onEdit={editTransaction('expense')}
            />
          </section>

          <section>
            <InvestmentForm onSubmit={addInvestment} />
            <TransactionList
              type="income"
              transactions={monthData.investments.map(i => ({
                ...i,
                category: i.type,
                amount: i.amount,
              }))}
              onDelete={(id) => {
                const newData = {
                  ...monthData,
                  investments: monthData.investments.filter((inv) => inv.id !== id),
                };
                updateData(newData);
              }}
              onEdit={(transaction) => {
                const newData = {
                  ...monthData,
                  investments: monthData.investments.map((inv) =>
                    inv.id === transaction.id
                      ? {
                          ...inv,
                          date: transaction.date,
                          description: transaction.description,
                          amount: transaction.amount,
                          type: transaction.category,
                        }
                      : inv
                  ),
                };
                updateData(newData);
              }}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
}

function DashboardCard({ title, amount, icon }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)}
      </p>
    </div>
  );
}

export default App;