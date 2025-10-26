import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ContextMenuService } from '../../core/services/context-menu-service/context-menu.service';
import { CellPosition } from '../../core/models';

/**
 * Context Menu Directive
 *
 * Enables right-click context menu functionality on any element.
 * When the user right-clicks, it opens a custom context menu with actions.
 *
 * Usage:
 * <div [appContextmenu]="cellPosition" (contextmenuOpen)="handleOpen()"></div>
 *
 * The directive automatically:
 * - Prevents the default browser context menu
 * - Shows the custom context menu at the cursor position
 * - Passes cell position data to the context menu service
 */
@Directive({
  selector: '[appContextmenu]',
  standalone: true,
})
export class ContextmenuDirective {
  private readonly contextMenuService = inject(ContextMenuService);

  public readonly appContextmenu = input.required<CellPosition>();
  public readonly contextmenuOpen = output<void>();

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuService.show(event, this.appContextmenu());
    this.contextmenuOpen.emit();
  }
}
