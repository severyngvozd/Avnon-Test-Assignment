import { TestBed } from '@angular/core/testing';
import { KeyboardService } from './keyboard.service';
import { KeyboardAction } from '../../enums/keyboard.enums';

describe('KeyboardService', () => {
  let service: KeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle arrow up', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_UP);
  });

  it('should handle arrow down', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_DOWN);
  });

  it('should handle arrow left', () => {
    const mockTarget = document.createElement('div');
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    Object.defineProperty(event, 'target', { value: mockTarget, writable: false });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_LEFT);
  });

  it('should handle arrow right', () => {
    const mockTarget = document.createElement('div');
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    Object.defineProperty(event, 'target', { value: mockTarget, writable: false });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_RIGHT);
  });

  it('should handle Tab key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_RIGHT);
  });

  it('should handle Shift+Tab', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.MOVE_LEFT);
  });

  it('should handle Enter key with Ctrl', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.ADD_SUBCATEGORY);
  });

  it('should handle Enter key with Cmd/Meta', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', metaKey: true });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.ADD_SUBCATEGORY);
  });

  it('should not handle Enter key without modifiers', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const action = service.handleKeyDown(event);
    expect(action).toBe(KeyboardAction.NONE);
  });
});
