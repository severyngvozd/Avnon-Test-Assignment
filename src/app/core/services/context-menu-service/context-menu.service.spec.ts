import { TestBed } from '@angular/core/testing';
import { ContextMenuService } from './context-menu.service';
import { CellPosition } from '../../models';

describe('ContextMenuService', () => {
  let service: ContextMenuService;
  let mockCellPosition: CellPosition;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextMenuService);
    mockCellPosition = { categoryId: 'test-cat', month: 0, year: 2024 };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have context menu hidden', () => {
    expect(service.contextMenu().isVisible).toBe(false);
  });

  it('should show context menu', () => {
    const mockEvent = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 200,
    });

    service.show(mockEvent, mockCellPosition);

    const menu = service.contextMenu();
    expect(menu.isVisible).toBe(true);
    expect(menu.position.x).toBe(100);
    expect(menu.position.y).toBe(200);
    expect(menu.cellPosition).toEqual(mockCellPosition);
  });

  it('should hide context menu', () => {
    const mockEvent = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 200,
    });

    service.show(mockEvent, mockCellPosition);
    expect(service.contextMenu().isVisible).toBe(true);

    service.hide();
    expect(service.contextMenu().isVisible).toBe(false);
  });

  it('should prevent default on show', () => {
    const mockEvent = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 200,
    });
    spyOn(mockEvent, 'preventDefault');

    service.show(mockEvent, mockCellPosition);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
