import { Injectable, signal } from '@angular/core';
import { CellPosition, ContextMenuState } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  public readonly contextMenu = signal<ContextMenuState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    cellPosition: null,
    isCategoryMenu: false,
  });

  public show(event: MouseEvent, cellPosition: CellPosition, isCategoryMenu = false): void {
    event.preventDefault();

    this.contextMenu.set({
      isVisible: true,
      position: { x: event.clientX, y: event.clientY },
      cellPosition,
      isCategoryMenu,
    });
  }

  public hide(): void {
    this.contextMenu.update((state) => ({
      ...state,
      isVisible: false,
    }));
  }
}
