import { BudgetCategory } from './category.models';
import { BudgetCell, CellPosition } from './cell.models';
import { MonthYear } from './cell.models';

export interface BudgetTotals {
  incomeTotal: Map<string, number>;
  expenseTotal: Map<string, number>;
  profitLoss: Map<string, number>;
  openingBalance: number;
  closingBalance: Map<string, number>;
}

export interface BudgetState {
  categories: BudgetCategory[];
  cells: Map<string, BudgetCell>;
  startPeriod: MonthYear;
  endPeriod: MonthYear;
  focusedCell: CellPosition | null;
  openingBalance: number;
}

