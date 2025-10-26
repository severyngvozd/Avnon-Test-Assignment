import { TestBed } from '@angular/core/testing';
import { BudgetStore } from './budget.store';
import { MonthYear } from '../core/models';

describe('BudgetStore', () => {
  let store: BudgetStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(BudgetStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial categories', () => {
    const categories = store.categories();
    expect(categories.length).toBeGreaterThan(0);

    const incomeCategories = categories.filter((cat) => cat.type === 'income');
    const expenseCategories = categories.filter((cat) => cat.type === 'expense');

    expect(incomeCategories.length).toBeGreaterThan(0);
    expect(expenseCategories.length).toBeGreaterThan(0);
  });

  it('should set and get cell values', () => {
    const month: MonthYear = { month: 0, year: 2024 };
    const categoryId = 'test-category';
    const value = 1000;

    store.setCellValue(categoryId, month, value);
    const retrievedValue = store.getCellValue(categoryId, month);

    expect(retrievedValue).toBe(value);
  });

  it('should return 0 for non-existent cells', () => {
    const month: MonthYear = { month: 0, year: 2024 };
    const value = store.getCellValue('non-existent', month);
    expect(value).toBe(0);
  });

  it('should apply value to all months', () => {
    const categoryId = 'test-category';
    const sourceMonth: MonthYear = { month: 0, year: 2024 };
    const value = 500;

    store.setCellValue(categoryId, sourceMonth, value);
    store.applyToAllMonths(categoryId, sourceMonth);

    const months = store.months();
    months.forEach((month) => {
      expect(store.getCellValue(categoryId, month)).toBe(value);
    });
  });

  it('should add new category', () => {
    const initialCount = store.categories().length;

    store.addCategory('New Test Category', 'income', 'income');

    const categories = store.categories();
    expect(categories.length).toBe(initialCount + 1);

    const newCategory = categories.find((cat) => cat.name === 'New Test Category');
    expect(newCategory).toBeDefined();
    expect(newCategory?.type).toBe('income');
  });

  it('should add subcategory after specified category', () => {
    const categories = store.incomeCategories();
    const firstCategory = categories[0];
    const initialCount = categories.length;

    store.addSubcategory(firstCategory.id);

    const updatedCategories = store.incomeCategories();
    expect(updatedCategories.length).toBe(initialCount + 1);
  });

  it('should update start period', () => {
    const newPeriod: MonthYear = { month: 5, year: 2025 };
    store.setStartPeriod(newPeriod);

    expect(store.startPeriod()).toEqual(newPeriod);
  });

  it('should update end period', () => {
    const newPeriod: MonthYear = { month: 11, year: 2025 };
    store.setEndPeriod(newPeriod);

    expect(store.endPeriod()).toEqual(newPeriod);
  });

  it('should calculate income totals correctly', () => {
    const month: MonthYear = { month: 0, year: 2024 };
    const incomeCategories = store.incomeCategories();

    store.setCellValue(incomeCategories[0].id, month, 1000);
    store.setCellValue(incomeCategories[1].id, month, 2000);

    const totals = store.totals();
    const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`;
    const incomeTotal = totals.incomeTotal.get(monthKey);

    expect(incomeTotal).toBe(3000);
  });

  it('should calculate profit/loss correctly', () => {
    const month: MonthYear = { month: 0, year: 2024 };
    const incomeCategories = store.incomeCategories();
    const expenseCategories = store.expenseCategories();

    store.setCellValue(incomeCategories[0].id, month, 5000);
    store.setCellValue(expenseCategories[0].id, month, 2000);

    const totals = store.totals();
    const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`;
    const profitLoss = totals.profitLoss.get(monthKey);

    expect(profitLoss).toBe(3000);
  });

  it('should set focused cell', () => {
    const position = { categoryId: 'test', month: 0, year: 2024 };
    store.setFocusedCell(position);

    expect(store.focusedCell()).toEqual(position);
  });

  it('should set opening balance', () => {
    const balance = 5000;
    store.setOpeningBalance(balance);

    expect(store.openingBalance()).toBe(balance);
  });

  it('should calculate closing balance correctly', () => {
    const month1: MonthYear = { month: 0, year: 2024 };
    const month2: MonthYear = { month: 1, year: 2024 };

    store.setStartPeriod(month1);
    store.setEndPeriod(month2);

    const incomeCategories = store.incomeCategories();
    const expenseCategories = store.expenseCategories();

    store.setCellValue(incomeCategories[0].id, month1, 3000);
    store.setCellValue(expenseCategories[0].id, month1, 1000);

    const totals = store.totals();
    const month1Key = `${month1.year}-${month1.month.toString().padStart(2, '0')}`;
    const closingBalance = totals.closingBalance.get(month1Key);

    expect(closingBalance).toBeGreaterThan(totals.openingBalance);
  });
});

