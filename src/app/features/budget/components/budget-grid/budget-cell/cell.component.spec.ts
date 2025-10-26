import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCellComponent } from './cell.component';
import { CellPosition } from '../../../../../core/models';

describe('BudgetCellComponent', () => {
  let component: BudgetCellComponent;
  let fixture: ComponentFixture<BudgetCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCellComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', 0);
    fixture.componentRef.setInput('position', {
      categoryId: 'test-cat',
      month: 0,
      year: 2024,
    });
    fixture.componentRef.setInput('isFocused', false);
    fixture.componentRef.setInput('isReadonly', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted currency value', () => {
    fixture.componentRef.setInput('value', 1234.56);
    fixture.detectChanges();

    expect(component.displayValue()).toBe('1,234.56');
  });

  it('should display empty string for zero value when not editing', () => {
    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();

    expect(component.displayValue()).toBe('');
  });

  it('should emit valueChange when value is updated', (done) => {
    component.valueChange.subscribe((value) => {
      expect(value).toBe(100);
      done();
    });

    component.onFocus();
    const input = fixture.nativeElement.querySelector('input');
    input.value = '100';
    component.onInput({ target: input } as any);
    component.onBlur();
  });

  it('should emit focused event when focused', (done) => {
    component.focused.subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    component.onFocus();
  });

  it('should handle keyboard events', (done) => {
    component.keydown.subscribe((event) => {
      expect(event.key).toBe('ArrowDown');
      done();
    });

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.onKeyDown(event);
  });

  it('should be readonly when isReadonly is true', () => {
    fixture.componentRef.setInput('isReadonly', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(true);
  });

  it('should parse numeric values correctly', () => {
    component.onFocus();
    const input = fixture.nativeElement.querySelector('input');
    input.value = '$1,234.56';
    component.onInput({ target: input } as any);

    let emittedValue: number | undefined;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    component.onBlur();
    expect(emittedValue).toBe(1234.56);
  });
});
