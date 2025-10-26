import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetBuilderComponent } from './budget-builder.component';
import { BudgetStore } from '../../state/budget.store';

describe('BudgetBuilderComponent', () => {
  let component: BudgetBuilderComponent;
  let fixture: ComponentFixture<BudgetBuilderComponent>;
  let store: BudgetStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetBuilderComponent],
      providers: [BudgetStore],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetBuilderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(BudgetStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have start and end periods', () => {
    expect(component['startPeriod']()).toBeDefined();
    expect(component['endPeriod']()).toBeDefined();
  });

  it('should update start period', () => {
    const newPeriod = { month: 5, year: 2025 };
    component['onStartPeriodChange'](newPeriod);

    expect(store.startPeriod()).toEqual(newPeriod);
  });

  it('should update end period', () => {
    const newPeriod = { month: 11, year: 2025 };
    component['onEndPeriodChange'](newPeriod);

    expect(store.endPeriod()).toEqual(newPeriod);
  });

  it('should render month range picker', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-month-range-picker')).toBeTruthy();
  });

  it('should render budget grid', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-budget-grid')).toBeTruthy();
  });

  it('should display title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1');
    expect(title.textContent).toContain('Budget Builder Table');
  });
});

