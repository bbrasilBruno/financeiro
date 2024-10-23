import { MonthlyData, MonthlyDataMap } from '../types';

const STORAGE_KEY = 'financial_data';

export const getMonthKey = (date: string) => date.substring(0, 7);

export const loadData = (): MonthlyDataMap => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveData = (data: MonthlyDataMap) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getMonthData = (date: string): MonthlyData => {
  const data = loadData();
  const monthKey = getMonthKey(date);
  return data[monthKey] || { income: [], expenses: [], investments: [] };
};

export const updateMonthData = (date: string, monthData: MonthlyData) => {
  const data = loadData();
  const monthKey = getMonthKey(date);
  data[monthKey] = monthData;
  saveData(data);
};