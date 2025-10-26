import { Injectable, signal } from '@angular/core';
import { CellPosition } from '../../models';
import { KeyboardAction, KeyboardKey } from '../../enums/keyboard.enums';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  public readonly lastAction = signal<KeyboardAction>(KeyboardAction.NONE);

  public handleKeyDown(event: KeyboardEvent, currentPosition: CellPosition): KeyboardAction {
    let action: KeyboardAction = KeyboardAction.NONE;

    switch (event.key) {
      case KeyboardKey.ARROW_UP:
        event.preventDefault();
        action = KeyboardAction.MOVE_UP;
        break;
      case KeyboardKey.ARROW_DOWN:
        event.preventDefault();
        action = KeyboardAction.MOVE_DOWN;
        break;
      case KeyboardKey.ARROW_LEFT:
        if (!this.isInputFocused(event)) {
          event.preventDefault();
          action = KeyboardAction.MOVE_LEFT;
        }
        break;
      case KeyboardKey.ARROW_RIGHT:
        if (!this.isInputFocused(event)) {
          event.preventDefault();
          action = KeyboardAction.MOVE_RIGHT;
        }
        break;
      case KeyboardKey.TAB:
        event.preventDefault();
        action = event.shiftKey ? KeyboardAction.MOVE_LEFT : KeyboardAction.MOVE_RIGHT;
        break;
      case KeyboardKey.ENTER:
        if (!this.isInputFocused(event)) {
          event.preventDefault();
          action = KeyboardAction.ADD_SUBCATEGORY;
        } else if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          action = KeyboardAction.ADD_SUBCATEGORY;
        }
        break;
    }

    this.lastAction.set(action);
    return action;
  }

  private isInputFocused(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    );
  }
}
