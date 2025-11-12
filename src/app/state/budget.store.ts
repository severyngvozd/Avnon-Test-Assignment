import { computed, Injectable, signal } from '@angular/core';
import {
  BudgetCategory,
  BudgetCell,
  BudgetState,
  BudgetTotals,
  CategoryType,
  CATEGORY_TYPE,
  CellPosition,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  MonthYear,
  ParentCategoryId,
} from '../core/models';
import { getMonthKey, getMonthsBetween } from '../core/utils/month-range.util';
import { roundToTwoDecimals, sumArray } from '../core/utils/math.util';

const INITIAL_OPENING_BALANCE = 0;

@Injectable({
  providedIn: 'root',
})
export class BudgetStore {
  private readonly state = signal<BudgetState>({
    categories: [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES],
    cells: new Map<string, BudgetCell>(),
    startPeriod: { month: 0, year: 2024 },
    endPeriod: { month: 11, year: 2024 },
    focusedCell: null,
    openingBalance: INITIAL_OPENING_BALANCE,
  });

  public readonly categories = computed(() => this.state().categories);
  public readonly cells = computed(() => this.state().cells);
  public readonly startPeriod = computed(() => this.state().startPeriod);
  public readonly endPeriod = computed(() => this.state().endPeriod);
  public readonly focusedCell = computed(() => this.state().focusedCell);
  public readonly openingBalance = computed(() => this.state().openingBalance);

  public readonly months = computed(() =>
    getMonthsBetween(this.state().startPeriod, this.state().endPeriod)
  );

  public readonly incomeCategories = computed(() =>
    this.state()
      .categories.filter((cat) => cat.type === CATEGORY_TYPE.INCOME)
      .sort((a, b) => a.order - b.order)
  );

  public readonly expenseCategories = computed(() =>
    this.state()
      .categories.filter((cat) => cat.type === CATEGORY_TYPE.EXPENSE)
      .sort((a, b) => a.order - b.order)
  );

  public readonly totals = computed<BudgetTotals>(() => {
    const state = this.state();
    const months = this.months();

    const incomeTotal = new Map<string, number>();
    const expenseTotal = new Map<string, number>();
    const profitLoss = new Map<string, number>();
    const closingBalance = new Map<string, number>();

    months.forEach((month) => {
      const key = getMonthKey(month);
      const monthIncome = this.calculateMonthTotal(month, CATEGORY_TYPE.INCOME);
      const monthExpense = this.calculateMonthTotal(month, CATEGORY_TYPE.EXPENSE);
      const monthProfit = roundToTwoDecimals(monthIncome - monthExpense);

      incomeTotal.set(key, monthIncome);
      expenseTotal.set(key, monthExpense);
      profitLoss.set(key, monthProfit);
    });

    let runningBalance = state.openingBalance;
    months.forEach((month) => {
      const key = getMonthKey(month);
      const profit = profitLoss.get(key) || 0;
      runningBalance = roundToTwoDecimals(runningBalance + profit);
      closingBalance.set(key, runningBalance);
    });

    return {
      incomeTotal,
      expenseTotal,
      profitLoss,
      openingBalance: state.openingBalance,
      closingBalance,
    };
  });

  public getCellValue(categoryId: string, month: MonthYear): number {
    const key = this.getCellKey(categoryId, month);
    return this.state().cells.get(key)?.value || 0;
  }

  public setCellValue(categoryId: string, month: MonthYear, value: number): void {
    const key = this.getCellKey(categoryId, month);
    const cell: BudgetCell = {
      categoryId,
      month: month.month,
      year: month.year,
      value: roundToTwoDecimals(value),
    };

    this.state.update((state) => {
      const newCells = new Map(state.cells);
      newCells.set(key, cell);
      return { ...state, cells: newCells };
    });
  }

  public applyToAllMonths(categoryId: string, sourceMonth: MonthYear): void {
    const value = this.getCellValue(categoryId, sourceMonth);
    const months = this.months();

    this.state.update((state) => {
      const newCells = new Map(state.cells);

      months.forEach((month) => {
        const key = this.getCellKey(categoryId, month);
        const cell: BudgetCell = {
          categoryId,
          month: month.month,
          year: month.year,
          value: roundToTwoDecimals(value),
        };
        newCells.set(key, cell);
      });

      return {
        ...state,
        cells: newCells,
      };
    });
  }

  public addCategory(
    name: string,
    type: CategoryType,
    parentId: ParentCategoryId,
    isParent: boolean = false
  ): void {
    const categories = this.state().categories.filter(
      (cat) => cat.type === type && cat.parentId === parentId
    );
    const maxOrder = Math.max(...categories.map((cat) => cat.order), -1);

    const newCategory: BudgetCategory = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      parentId,
      order: maxOrder + 1,
      isParent,
    };

    this.state.update((state) => ({
      ...state,
      categories: [...state.categories, newCategory],
    }));
  }

  public addSubcategory(afterCategoryId: string): void {
    const categories = this.state().categories;
    const afterCategory = categories.find((cat) => cat.id === afterCategoryId);

    if (!afterCategory) {
      return;
    }

    const newOrder = afterCategory.order + 1;

    const updatedCategories = categories.map((cat) => {
      if (
        cat.type === afterCategory.type &&
        cat.parentId === afterCategory.parentId &&
        cat.order >= newOrder
      ) {
        return { ...cat, order: cat.order + 1 };
      }
      return cat;
    });

    const newCategory: BudgetCategory = {
      id: `${afterCategory.type}-${Date.now()}`,
      name: `New ${afterCategory.type === CATEGORY_TYPE.INCOME ? 'Income' : 'Expense'} Category`,
      type: afterCategory.type,
      parentId: afterCategory.parentId,
      order: newOrder,
      isParent: false,
    };

    this.state.update((state) => ({
      ...state,
      categories: [...updatedCategories, newCategory],
    }));
  }

  public setStartPeriod(period: MonthYear): void {
    this.state.update((state) => {
      const startDate = new Date(period.year, period.month - 1);
      const endDate = new Date(state.endPeriod.year, state.endPeriod.month - 1);

      if (startDate > endDate) {
        return {
          ...state,
          startPeriod: period,
          endPeriod: period,
        };
      }

      return {
        ...state,
        startPeriod: period,
      };
    });
  }

  public setEndPeriod(period: MonthYear): void {
    this.state.update((state) => {
      const startDate = new Date(state.startPeriod.year, state.startPeriod.month - 1);
      const endDate = new Date(period.year, period.month - 1);

      if (endDate < startDate) {
        return state;
      }

      return {
        ...state,
        endPeriod: period,
      };
    });
  }

  public setFocusedCell(position: CellPosition | null): void {
    this.state.update((state) => ({
      ...state,
      focusedCell: position,
    }));
  }

  public setOpeningBalance(balance: number): void {
    this.state.update((state) => ({
      ...state,
      openingBalance: roundToTwoDecimals(balance),
    }));
  }

  public deleteCategory(categoryId: string): void {
    this.state.update((state) => {
      const newCategories = state.categories.filter((cat) => cat.id !== categoryId);
      
      const newCells = new Map(state.cells);
      for (const key of newCells.keys()) {
        if (key.startsWith(`${categoryId}-`)) {
          newCells.delete(key);
        }
      }

      return {
        ...state,
        categories: newCategories,
        cells: newCells,
        focusedCell: state.focusedCell?.categoryId === categoryId ? null : state.focusedCell,
      };
    });
  }

  private getCellKey(categoryId: string, month: MonthYear): string {
    return `${categoryId}-${month.year}-${month.month}`;
  }

  private calculateMonthTotal(month: MonthYear, type: CategoryType): number {
    const values = this.state()
      .categories
      .filter((cat) => cat.type === type)
      .map((cat) => this.getCellValue(cat.id, month));

    return sumArray(values);
  }
}

