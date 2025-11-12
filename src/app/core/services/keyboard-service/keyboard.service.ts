import { Injectable } from '@angular/core';
import { KeyboardAction, KeyboardKey } from '../../enums/keyboard.enums';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  public handleKeyDown(event: KeyboardEvent): KeyboardAction {
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
        event.preventDefault();
        action = KeyboardAction.MOVE_LEFT;
        break;
      case KeyboardKey.ARROW_RIGHT:
        event.preventDefault();
        action = KeyboardAction.MOVE_RIGHT;
        break;
      case KeyboardKey.TAB:
        event.preventDefault();
        action = event.shiftKey ? KeyboardAction.MOVE_LEFT : KeyboardAction.MOVE_RIGHT;
        break;
      case KeyboardKey.ENTER:
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          action = KeyboardAction.ADD_SUBCATEGORY;
        }
        break;
    }

    return action;
  }
}
