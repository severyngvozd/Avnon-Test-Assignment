import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContextMenuService } from '../../../../../core/services/context-menu-service/context-menu.service';
import { BudgetStore } from '../../../../../state/budget.store';

@Component({
  selector: 'app-context-menu',
  imports: [],
  templateUrl: './context-menu.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick()',
  },
})
export class ContextMenuComponent {
  private readonly contextMenuService = inject(ContextMenuService);
  private readonly budgetStore = inject(BudgetStore);

  protected readonly contextMenu = this.contextMenuService.contextMenu;

  protected onDocumentClick(): void {
    this.contextMenuService.hide();
  }

  protected onApplyToAll(): void {
    const cellPosition = this.contextMenu().cellPosition;
    if (cellPosition) {
      this.budgetStore.applyToAllMonths(
        cellPosition.categoryId,
        { month: cellPosition.month, year: cellPosition.year }
      );
    }
    this.contextMenuService.hide();
  }

  protected onDeleteCategory(): void {
    const cellPosition = this.contextMenu().cellPosition;
    if (cellPosition) {
      const confirmDelete = confirm('Are you sure you want to delete this category?');
      if (confirmDelete) {
        this.budgetStore.deleteCategory(cellPosition.categoryId);
      }
    }
    this.contextMenuService.hide();
  }

  protected onMenuClick(event: Event): void {
    event.stopPropagation();
  }
}
