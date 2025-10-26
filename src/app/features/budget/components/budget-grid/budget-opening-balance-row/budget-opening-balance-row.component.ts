import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BudgetTotals, MonthYear } from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/math.util';
import { getMonthKey } from '../../../../../core/utils/month-range.util';

@Component({
  selector: 'tr[app-budget-opening-balance-row]',
  imports: [],
  templateUrl: './budget-opening-balance-row.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetOpeningBalanceRowComponent {
  public readonly months = input.required<MonthYear[]>();
  public readonly totals = input.required<BudgetTotals>();

  public readonly openingBalanceChange = output<string>();

  protected readonly openingBalanceValues = computed(() => {
    const result: number[] = [];
    const months = this.months();

    months.forEach((month, index) => {
      if (index === 0) {
        result.push(this.totals().openingBalance);
      } else {
        const prevKey = getMonthKey(months[index - 1]);
        result.push(this.totals().closingBalance.get(prevKey) || 0);
      }
    });

    return result;
  });

  protected formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}

