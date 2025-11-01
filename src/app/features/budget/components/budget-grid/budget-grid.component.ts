import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BudgetStore } from '../../../../state/budget.store';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { formatMonthYear, getMonthKey } from '../../../../core/utils/month-range.util';
import { CellPosition, MonthYear } from '../../../../core/models';
import { KeyboardService } from '../../../../core/services/keyboard-service/keyboard.service';
import { KeyboardAction } from '../../../../core/enums/keyboard.enums';
import { BudgetSectionHeaderComponent } from './budget-section-header/budget-section-header.component';
import { BudgetCategoryRowComponent } from './budget-category-row/budget-category-row.component';
import { BudgetTotalRowComponent } from './budget-total-row/budget-total-row.component';
import { BudgetActionsRowComponent } from './budget-actions-row/budget-actions-row.component';
import { BudgetClosingBalanceRowComponent } from './budget-closing-balance-row/budget-closing-balance-row.component';
import { BudgetOpeningBalanceRowComponent } from './budget-opening-balance-row/budget-opening-balance-row.component';
import { BudgetProfitLossRowComponent } from './budget-profit-loss-row/budget-profit-loss-row.component';

@Component({
  selector: 'app-budget-grid',
  imports: [
    BudgetActionsRowComponent,
    BudgetCategoryRowComponent,
    BudgetClosingBalanceRowComponent,
    BudgetOpeningBalanceRowComponent,
    BudgetProfitLossRowComponent,
    BudgetSectionHeaderComponent,
    BudgetTotalRowComponent,
    ContextMenuComponent,
  ],
  templateUrl: './budget-grid.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetGridComponent {
  private readonly budgetStore = inject(BudgetStore);
  private readonly keyboardService = inject(KeyboardService);

  protected readonly months = this.budgetStore.months;
  protected readonly incomeCategories = this.budgetStore.incomeCategories;
  protected readonly expenseCategories = this.budgetStore.expenseCategories;
  protected readonly cells = this.budgetStore.cells;
  protected readonly focusedCell = this.budgetStore.focusedCell;
  protected readonly totals = this.budgetStore.totals;

  protected readonly allCategories = computed(() => [
    ...this.incomeCategories(),
    ...this.expenseCategories(),
  ]);

  protected readonly incomeActions = [
    { id: 'add-general-income', label: "Add a new 'General Income' Category" },
    { id: 'add-parent-income', label: 'Add new Parent Category' },
  ];

  protected readonly expenseActions = [
    { id: 'add-expense', label: 'Add new Expense Category' },
  ];

  protected formatMonthYear(month: MonthYear): string {
    return formatMonthYear(month);
  }

  protected trackByMonth(index: number, month: MonthYear): string {
    return `${month.year}-${month.month}`;
  }

  protected onCellValueChange(
    categoryId: string,
    data: { month: MonthYear; value: number }
  ): void {
    this.budgetStore.setCellValue(categoryId, data.month, data.value);
  }

  protected onCellFocused(categoryId: string, month: MonthYear): void {
    this.budgetStore.setFocusedCell({ categoryId, month: month.month, year: month.year });
  }

  protected onCellKeyDown(
    categoryId: string,
    data: { event: KeyboardEvent; month: MonthYear }
  ): void {
    const position: CellPosition = {
      categoryId,
      month: data.month.month,
      year: data.month.year,
    };
    const action = this.keyboardService.handleKeyDown(data.event, position);

    switch (action) {
      case KeyboardAction.MOVE_UP:
        this.moveFocus(categoryId, data.month, 0, -1);
        break;
      case KeyboardAction.MOVE_DOWN:
        this.moveFocus(categoryId, data.month, 0, 1);
        break;
      case KeyboardAction.MOVE_LEFT:
        this.moveFocus(categoryId, data.month, -1, 0);
        break;
      case KeyboardAction.MOVE_RIGHT:
      case KeyboardAction.MOVE_NEXT:
        this.moveFocus(categoryId, data.month, 1, 0);
        break;
      case KeyboardAction.ADD_SUBCATEGORY:
        this.budgetStore.addSubcategory(categoryId);
        break;
    }
  }

  protected onActionClicked(actionId: string): void {
    switch (actionId) {
      case 'add-general-income':
        this.budgetStore.addCategory('General Income', 'income', 'income');
        break;
      case 'add-parent-income':
        const incomeName = prompt('Enter new income category name:');
        if (incomeName) {
          this.budgetStore.addCategory(incomeName, 'income', 'income');
        }
        break;
      case 'add-expense':
        const expenseName = prompt('Enter new expense category name:');
        if (expenseName) {
          this.budgetStore.addCategory(expenseName, 'expense', 'expenses');
        }
        break;
    }
  }

  protected onOpeningBalanceChange(value: string): void {
    const numericValue = parseFloat(value) || 0;
    this.budgetStore.setOpeningBalance(numericValue);
  }

  private moveFocus(
    currentCategoryId: string,
    currentMonth: MonthYear,
    monthDelta: number,
    categoryDelta: number
  ): void {
    const categories = this.allCategories();
    const months = this.months();

    const currentCategoryIndex = categories.findIndex((cat) => cat.id === currentCategoryId);
    const currentMonthIndex = months.findIndex(
      (m) => m.month === currentMonth.month && m.year === currentMonth.year
    );

    let newCategoryIndex = currentCategoryIndex + categoryDelta;
    let newMonthIndex = currentMonthIndex + monthDelta;

    if (newCategoryIndex < 0) {
      newCategoryIndex = 0;
    }
    if (newCategoryIndex >= categories.length) {
      newCategoryIndex = categories.length - 1;
    }

    if (newMonthIndex < 0) {
      newMonthIndex = 0;
    }
    if (newMonthIndex >= months.length) {
      newMonthIndex = months.length - 1;
    }

    const newCategory = categories[newCategoryIndex];
    const newMonth = months[newMonthIndex];

    this.budgetStore.setFocusedCell({
      categoryId: newCategory.id,
      month: newMonth.month,
      year: newMonth.year,
    });
  }
}
