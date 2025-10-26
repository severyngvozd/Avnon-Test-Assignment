import { CellPosition } from './cell.models';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuState {
  isVisible: boolean;
  position: ContextMenuPosition;
  cellPosition: CellPosition | null;
  isCategoryMenu?: boolean;
}

