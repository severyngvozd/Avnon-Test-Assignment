import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { IconComponent } from '../../../../../shared/ui/icon/icon.component';
import { MonthYear } from '../../../../../core/models';

@Component({
  selector: 'tr[app-budget-actions-row]',
  imports: [ButtonComponent, IconComponent],
  templateUrl: './budget-actions-row.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetActionsRowComponent {
  public readonly actions = input.required<Array<{ id: string; label: string }>>();
  public readonly months = input<MonthYear[]>([]);
  public readonly actionClicked = output<string>();
}

