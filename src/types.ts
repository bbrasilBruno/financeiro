export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod?: string;
}

export interface Investment {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  returns: number;
}

export interface MonthlyData {
  income: Transaction[];
  expenses: Transaction[];
  investments: Investment[];
}

export interface MonthlyDataMap {
  [key: string]: MonthlyData;
}