import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ContextMenuService } from '../../core/services/context-menu-service/context-menu.service';
import { CellPosition } from '../../core/models';

/**
 * Category Context Menu Directive
 *
 * Enables right-click context menu functionality for category rows.
 * Shows options specific to category management (like delete).
 *
 * Usage:
 * <div [appCategoryContextmenu]="position" (contextmenuOpen)="handleOpen()"></div>
 *
 * The directive automatically:
 * - Prevents the default browser context menu
 * - Shows the custom context menu for categories
 * - Passes category position data to the context menu service
 */
@Directive({
  selector: '[appCategoryContextmenu]',
  standalone: true,
})
export class CategoryContextmenuDirective {
  private readonly contextMenuService = inject(ContextMenuService);

  public readonly appCategoryContextmenu = input.required<CellPosition>();
  public readonly contextmenuOpen = output<void>();

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuService.show(event, this.appCategoryContextmenu(), true);
    this.contextmenuOpen.emit();
  }
}

