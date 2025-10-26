import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, Subject } from 'rxjs';

import { CellPosition } from '../../../../../core/models';
import { formatCurrency, parseNumericValue } from '../../../../../core/utils/math.util';
import { ContextmenuDirective } from '../../../../../shared/directives/contextmenu.directive';


@Component({
  selector: 'app-budget-cell',
  imports: [ContextmenuDirective],
  templateUrl: './cell.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCellComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly focusSubject = new Subject<void>();

  public readonly value = input.required<number>();
  public readonly position = input.required<CellPosition>();
  public readonly isFocused = input<boolean>(false);
  public readonly isReadonly = input<boolean>(false);

  public readonly valueChange = output<number>();
  public readonly focused = output<void>();
  public readonly keydown = output<KeyboardEvent>();

  protected readonly isEditing = signal<boolean>(false);
  protected readonly editValue = signal<string>('');

  public readonly displayValue = computed(() => {
    if (this.isEditing()) {
      return this.editValue();
    }
    const val = this.value();
    return val === 0 ? '' : formatCurrency(val);
  });

  constructor() {
    effect(() => {
      if (this.isFocused() && !this.isReadonly()) {
        this.focusSubject.next();
      }
    });
  }

  public ngAfterViewInit(): void {
    this.focusSubject
      .pipe(delay(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.inputRef()?.nativeElement.focus();
      });
  }

  public onFocus(): void {
    this.isEditing.set(true);
    this.editValue.set(this.value() === 0 ? '' : this.value().toString());
    this.focused.emit();
  }

  public onBlur(): void {
    this.saveValue();
    this.isEditing.set(false);
  }

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.editValue.set(target.value);
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveValue();
      this.isEditing.set(false);
    }
    this.keydown.emit(event);
  }

  protected onClick(): void {
    if (!this.isReadonly()) {
      this.focused.emit();
    }
  }

  private saveValue(): void {
    const numericValue = parseNumericValue(this.editValue());
    if (numericValue !== this.value()) {
      this.valueChange.emit(numericValue);
    }
  }
}
