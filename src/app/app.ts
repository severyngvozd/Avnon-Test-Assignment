import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BudgetBuilderComponent } from './features/budget/budget-builder.component';

@Component({
  selector: 'app-root',
  imports: [BudgetBuilderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
