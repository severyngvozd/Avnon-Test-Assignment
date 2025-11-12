import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CategoryType } from '../../../../../core/models';

export interface CategoryFormData {
  name: string;
  isParent: boolean;
}

const VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  PATTERN: /^[a-zA-Z0-9\s\-&]+$/,
} as const;

@Component({
  selector: 'tr[app-budget-category-form]',
  imports: [ButtonComponent],
  templateUrl: './budget-category-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCategoryFormComponent {

  public readonly categoryType = input.required<CategoryType>();
  public readonly showParentOption = input<boolean>(false);

  public readonly formSubmit = output<CategoryFormData>();
  public readonly formCancel = output<void>();

  protected readonly categoryName = signal('');
  protected readonly isParent = signal(false);
  protected readonly touched = signal(false);

  protected readonly isValid = computed(() => {
    const name = this.categoryName().trim();
    return (
      name.length >= VALIDATION.MIN_LENGTH &&
      name.length <= VALIDATION.MAX_LENGTH &&
      VALIDATION.PATTERN.test(name)
    );
  });

  protected readonly showError = computed(() => {
    return this.touched() && !this.isValid() && this.categoryName().length > 0;
  });

  protected readonly errorMessage = computed(() => {
    const name = this.categoryName().trim();

    if (name.length < VALIDATION.MIN_LENGTH) {
      return `Name must be at least ${VALIDATION.MIN_LENGTH} characters`;
    }

    if (name.length > VALIDATION.MAX_LENGTH) {
      return `Name must be no more than ${VALIDATION.MAX_LENGTH} characters`;
    }

    if (!VALIDATION.PATTERN.test(name)) {
      return 'Name can only contain letters, numbers, spaces, hyphens and ampersands';
    }

    return '';
  });

  protected onNameChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.categoryName.set(target.value);
    if (!this.touched()) {
      this.touched.set(true);
    }
  }

  protected onParentChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isParent.set(target.checked);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isValid()) {
      this.formSubmit.emit({
        name: this.categoryName().trim(),
        isParent: this.isParent(),
      });
      this.resetForm();
    }
  }

  protected onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  private resetForm(): void {
    this.categoryName.set('');
    this.isParent.set(false);
    this.touched.set(false);
  }
}