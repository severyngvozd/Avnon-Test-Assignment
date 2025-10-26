import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BudgetTotals, MonthYear } from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/math.util';
import { getMonthKey } from '../../../../../core/utils/month-range.util';

@Component({
  selector: 'tr[app-budget-closing-balance-row]',
  imports: [],
  templateUrl: './budget-closing-balance-row.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetClosingBalanceRowComponent {
  public readonly months = input.required<MonthYear[]>();
  public readonly totals = input.required<BudgetTotals>();

  protected readonly closingBalanceValues = computed(() => {
    return this.months().map((month) => {
      const key = getMonthKey(month);
      return this.totals().closingBalance.get(key) || 0;
    });
  });

  protected formatCurrency(value: number): string {
    return formatCurrency(value);
  }

  protected getColorClass(value: number): string {
    if (value > 0) {
      return 'text-green-600';
    }
    if (value < 0) {
      return 'text-red-600';
    }
    return 'text-gray-900';
  }
}

