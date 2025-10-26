import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BudgetStore } from '../../state/budget.store';
import { MonthRangePickerComponent } from './components/month-range-picker/month-range-picker.component';
import { BudgetGridComponent } from './components/budget-grid/budget-grid.component';
import { MonthYear } from '../../core/models';

@Component({
  selector: 'app-budget-builder',
  imports: [MonthRangePickerComponent, BudgetGridComponent],
  templateUrl: './budget-builder.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetBuilderComponent {
  private readonly budgetStore = inject(BudgetStore);

  protected readonly startPeriod = this.budgetStore.startPeriod;
  protected readonly endPeriod = this.budgetStore.endPeriod;

  protected onStartPeriodChange(period: MonthYear): void {
    this.budgetStore.setStartPeriod(period);
  }

  protected onEndPeriodChange(period: MonthYear): void {
    this.budgetStore.setEndPeriod(period);
  }
}

