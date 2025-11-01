import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MonthYear } from '../../../../../core/models';

@Component({
  selector: 'tr[app-budget-section-header]',
  imports: [],
  templateUrl: './budget-section-header.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetSectionHeaderComponent {
  public readonly title = input.required<string>();
  public readonly months = input.required<MonthYear[]>();
  public readonly bgColorClass = input<string>('bg-gray-50');

  protected trackByMonth(index: number, month: MonthYear): string {
    return `${month.year}-${month.month}`;
  }
}

