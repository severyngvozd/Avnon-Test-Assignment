import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BudgetCategory, BudgetCell, CellPosition, MonthYear } from '../../../../../core/models';
import { BudgetCellComponent } from '../budget-cell/cell.component';
import { CategoryContextmenuDirective } from '../../../../../shared/directives/category-contextmenu.directive';
import { getMonthKey } from '../../../../../core/utils/month-range.util';

@Component({
  selector: 'tr[app-budget-category-row]',
  imports: [BudgetCellComponent, CategoryContextmenuDirective],
  templateUrl: './budget-category-row.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCategoryRowComponent {
  public readonly category = input.required<BudgetCategory>();
  public readonly months = input.required<MonthYear[]>();
  public readonly cells = input.required<Map<string, BudgetCell>>();
  public readonly focusedCell = input<CellPosition | null>(null);

  public readonly cellValueChange = output<{ month: MonthYear; value: number }>();
  public readonly cellFocused = output<MonthYear>();
  public readonly cellKeydown = output<{ event: KeyboardEvent; month: MonthYear }>();

  protected readonly cellValuesMap = computed(() => {
    const map = new Map<string, number>();
    this.months().forEach((month) => {
      const key = getMonthKey(this.category().id, month.month, month.year);
      map.set(key, this.cells().get(key)?.value || 0);
    });
    return map;
  });

  protected readonly focusedCellsMap = computed(() => {
    const map = new Map<string, boolean>();
    const focused = this.focusedCell();
    if (!focused) {
      return map;
    }

    this.months().forEach((month) => {
      const key = getMonthKey(this.category().id, month.month, month.year);
      const isFocused =
        focused.categoryId === this.category().id &&
        focused.month === month.month &&
        focused.year === month.year;
      map.set(key, isFocused);
    });
    return map;
  });

  protected getCellValue(month: MonthYear): number {
    const key = getMonthKey(this.category().id, month.month, month.year);
    return this.cellValuesMap().get(key) || 0;
  }

  protected isCellFocused(month: MonthYear): boolean {
    const key = getMonthKey(this.category().id, month.month, month.year);
    return this.focusedCellsMap().get(key) || false;
  }

  protected trackByMonth(index: number, month: MonthYear): string {
    return `${month.year}-${month.month}`;
  }
}

