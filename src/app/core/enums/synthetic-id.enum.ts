export enum SyntheticId {
  INCOME_TOTAL = 'income-total',
  EXPENSE_TOTAL = 'expense-total',
  PROFIT_LOSS = 'profit-loss',
  CLOSING_BALANCE = 'closing-balance',
}

export function isSyntheticId(categoryId: string): boolean {
  return Object.values(SyntheticId).includes(categoryId as SyntheticId);
}