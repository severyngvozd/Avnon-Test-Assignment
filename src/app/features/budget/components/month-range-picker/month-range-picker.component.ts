import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MonthYear } from '../../../../core/models';
import { formatMonthYear, generateMonthYearOptions } from '../../../../core/utils/month-range.util';

@Component({
  selector: 'app-month-range-picker',
  imports: [],
  templateUrl: './month-range-picker.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthRangePickerComponent {
  public readonly startPeriod = input.required<MonthYear>();
  public readonly endPeriod = input.required<MonthYear>();

  public readonly startPeriodChange = output<MonthYear>();
  public readonly endPeriodChange = output<MonthYear>();

  protected readonly monthOptions = generateMonthYearOptions(2023, 5);

  protected readonly selectedStartIndex = computed(() =>
    this.monthOptions.findIndex(
      (opt) => opt.month === this.startPeriod().month && opt.year === this.startPeriod().year
    )
  );

  protected readonly selectedEndIndex = computed(() =>
    this.monthOptions.findIndex(
      (opt) => opt.month === this.endPeriod().month && opt.year === this.endPeriod().year
    )
  );

  protected onStartPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = parseInt(target.value, 10);
    this.startPeriodChange.emit(this.monthOptions[index]);
  }

  protected onEndPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const index = parseInt(target.value, 10);
    this.endPeriodChange.emit(this.monthOptions[index]);
  }

  protected formatMonthYear(monthYear: MonthYear): string {
    return formatMonthYear(monthYear);
  }
}
