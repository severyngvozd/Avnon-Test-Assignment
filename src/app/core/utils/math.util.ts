export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sumArray(values: number[]): number {
  return roundToTwoDecimals(values.reduce((sum, val) => sum + val, 0));
}

export function parseNumericValue(value: string): number {
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : roundToTwoDecimals(parsed);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

