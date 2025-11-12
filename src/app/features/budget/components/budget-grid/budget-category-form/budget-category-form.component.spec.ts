import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetCategoryFormComponent } from './budget-category-form.component';
import { CATEGORY_TYPE } from '../../../../../core/models';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BudgetCategoryFormComponent', () => {
  let component: BudgetCategoryFormComponent;
  let fixture: ComponentFixture<BudgetCategoryFormComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCategoryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    // Set required inputs
    fixture.componentRef.setInput('categoryType', CATEGORY_TYPE.INCOME);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initially have an empty category name', () => {
      expect(component['categoryName']()).toBe('');
    });

    it('should initially be invalid', () => {
      expect(component['isValid']()).toBe(false);
    });

    it('should be valid with a valid category name', () => {
      component['categoryName'].set('Valid Category');
      expect(component['isValid']()).toBe(true);
    });

    it('should be invalid with a name too short', () => {
      component['categoryName'].set('A');
      expect(component['isValid']()).toBe(false);
    });

    it('should be invalid with a name too long', () => {
      const longName = 'A'.repeat(51);
      component['categoryName'].set(longName);
      expect(component['isValid']()).toBe(false);
    });

    it('should be invalid with special characters', () => {
      component['categoryName'].set('Invalid@Category!');
      expect(component['isValid']()).toBe(false);
    });

    it('should be valid with allowed characters', () => {
      component['categoryName'].set('Valid Category-Name & Numbers 123');
      expect(component['isValid']()).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should not show error initially', () => {
      expect(component['showError']()).toBe(false);
    });

    it('should show error after touching with invalid input', () => {
      component['categoryName'].set('A');
      component['touched'].set(true);
      expect(component['showError']()).toBe(true);
    });

    it('should show minimum length error message', () => {
      component['categoryName'].set('A');
      component['touched'].set(true);
      expect(component['errorMessage']()).toContain('at least 2 characters');
    });

    it('should show pattern error message for invalid characters', () => {
      component['categoryName'].set('Invalid@');
      component['touched'].set(true);
      expect(component['errorMessage']()).toContain('can only contain letters');
    });
  });

  describe('Form Interaction', () => {
    it('should update category name on input', () => {
      const inputElement = debugElement.query(By.css('input[name="categoryName"]'));
      const event = new Event('input');
      Object.defineProperty(event, 'target', { value: { value: 'New Category' } });

      component['onNameChange'](event);

      expect(component['categoryName']()).toBe('New Category');
      expect(component['touched']()).toBe(true);
    });

    it('should update parent checkbox state', () => {
      fixture.componentRef.setInput('showParentOption', true);
      fixture.detectChanges();

      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: { checked: true } });

      component['onParentChange'](event);

      expect(component['isParent']()).toBe(true);
    });

    it('should emit form data on valid submit', () => {
      const formSubmitSpy = jasmine.createSpy('formSubmit');
      component.formSubmit.subscribe(formSubmitSpy);

      component['categoryName'].set('Valid Category');
      component['isParent'].set(true);

      const event = new Event('submit');
      component['onSubmit'](event);

      expect(formSubmitSpy).toHaveBeenCalledWith({
        name: 'Valid Category',
        isParent: true,
      });
    });

    it('should not emit form data on invalid submit', () => {
      const formSubmitSpy = jasmine.createSpy('formSubmit');
      component.formSubmit.subscribe(formSubmitSpy);

      component['categoryName'].set('A');

      const event = new Event('submit');
      component['onSubmit'](event);

      expect(formSubmitSpy).not.toHaveBeenCalled();
    });

    it('should reset form after valid submit', () => {
      component['categoryName'].set('Valid Category');
      component['isParent'].set(true);
      component['touched'].set(true);

      const event = new Event('submit');
      component['onSubmit'](event);

      expect(component['categoryName']()).toBe('');
      expect(component['isParent']()).toBe(false);
      expect(component['touched']()).toBe(false);
    });

    it('should emit cancel and reset form on cancel', () => {
      const formCancelSpy = jasmine.createSpy('formCancel');
      component.formCancel.subscribe(formCancelSpy);

      component['categoryName'].set('Some Text');
      component['isParent'].set(true);
      component['touched'].set(true);

      component['onCancel']();

      expect(formCancelSpy).toHaveBeenCalled();
      expect(component['categoryName']()).toBe('');
      expect(component['isParent']()).toBe(false);
      expect(component['touched']()).toBe(false);
    });
  });

  describe('Submit Button State', () => {
    it('should disable submit button when form is invalid', () => {
      component['categoryName'].set('');
      fixture.detectChanges();

      const submitButton = debugElement.query(By.css('app-button[type="submit"]'));
      expect(submitButton.componentInstance.disabled()).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component['categoryName'].set('Valid Category');
      fixture.detectChanges();

      const submitButton = debugElement.query(By.css('app-button[type="submit"]'));
      expect(submitButton.componentInstance.disabled()).toBe(false);
    });
  });

  describe('Parent Option Visibility', () => {
    it('should not show parent option by default', () => {
      const parentCheckbox = debugElement.query(By.css('input[name="isParent"]'));
      expect(parentCheckbox).toBeNull();
    });

    it('should show parent option when showParentOption is true', () => {
      fixture.componentRef.setInput('showParentOption', true);
      fixture.detectChanges();

      const parentCheckbox = debugElement.query(By.css('input[name="isParent"]'));
      expect(parentCheckbox).toBeTruthy();
    });
  });
});