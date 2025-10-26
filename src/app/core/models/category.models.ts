export type CategoryType = 'income' | 'expense';

export type ParentCategoryId = 'income' | 'expenses';

export interface BudgetCategory {
  id: string;
  name: string;
  type: CategoryType;
  parentId: ParentCategoryId;
  order: number;
  isParent: boolean;
}

export const DEFAULT_INCOME_CATEGORIES: BudgetCategory[] = [
  {
    id: 'general-income',
    name: 'General Income',
    type: 'income',
    parentId: 'income',
    order: 0,
    isParent: false,
  },
  {
    id: 'sales',
    name: 'Sales',
    type: 'income',
    parentId: 'income',
    order: 1,
    isParent: false,
  },
  {
    id: 'commission',
    name: 'Commission',
    type: 'income',
    parentId: 'income',
    order: 2,
    isParent: false,
  },
  {
    id: 'training',
    name: 'Training',
    type: 'income',
    parentId: 'income',
    order: 3,
    isParent: false,
  },
  {
    id: 'consulting',
    name: 'Consulting',
    type: 'income',
    parentId: 'income',
    order: 4,
    isParent: false,
  },
];

export const DEFAULT_EXPENSE_CATEGORIES: BudgetCategory[] = [
  {
    id: 'operational-expenses',
    name: 'Operational Expenses',
    type: 'expense',
    parentId: 'expenses',
    order: 0,
    isParent: false,
  },
  {
    id: 'management-fees',
    name: 'Management Fees',
    type: 'expense',
    parentId: 'expenses',
    order: 1,
    isParent: false,
  },
  {
    id: 'cloud-hosting',
    name: 'Cloud Hosting',
    type: 'expense',
    parentId: 'expenses',
    order: 2,
    isParent: false,
  },
  {
    id: 'salaries-wages',
    name: 'Salaries & Wages',
    type: 'expense',
    parentId: 'expenses',
    order: 3,
    isParent: false,
  },
];

