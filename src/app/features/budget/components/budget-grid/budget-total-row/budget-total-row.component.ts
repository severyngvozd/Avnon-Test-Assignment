import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MonthYear } from '../../../../../core/models';
import { BudgetCellComponent } from '../budget-cell/cell.component';
import { getMonthKey } from '../../../../../core/utils/month-range.util';

@Component({
  selector: 'tr[app-budget-total-row]',
  imports: [BudgetCellComponent],
  templateUrl: './budget-total-row.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTotalRowComponent {
  public readonly label = input.required<string>();
  public readonly totalId = input.required<string>();
  public readonly months = input.required<MonthYear[]>();
  public readonly totals = input.required<Map<string, number>>();

  protected readonly totalValuesMap = computed(() => {
    const map = new Map<string, number>();
    this.months().forEach((month) => {
      const key = getMonthKey(month);
      map.set(key, this.totals().get(key) || 0);
    });
    return map;
  });

  protected getTotalValue(month: MonthYear): number {
    const key = getMonthKey(month);
    return this.totalValuesMap().get(key) || 0;
  }

  protected trackByMonth(index: number, month: MonthYear): string {
    return `${month.year}-${month.month}`;
  }
}

