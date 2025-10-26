import { MonthYear } from '../models';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getMonthName(month: number): string {
  return MONTH_NAMES[month];
}

export function formatMonthYear(monthYear: MonthYear): string {
  return `${getMonthName(monthYear.month)} ${monthYear.year}`;
}

export function getMonthsBetween(start: MonthYear, end: MonthYear): MonthYear[] {
  const months: MonthYear[] = [];
  let current = { ...start };

  while (
    current.year < end.year ||
    (current.year === end.year && current.month <= end.month)
  ) {
    months.push({ ...current });

    current.month += 1;
    if (current.month > 11) {
      current.month = 0;
      current.year += 1;
    }
  }

  return months;
}

export function getMonthKey(monthYear: MonthYear): string;
export function getMonthKey(categoryId: string, month: number, year: number): string;
export function getMonthKey(
  arg1: MonthYear | string,
  arg2?: number,
  arg3?: number
): string {
  if (typeof arg1 === 'string') {
    // Called with (categoryId, month, year)
    const categoryId = arg1;
    const month = arg2!;
    const year = arg3!;
    return `${categoryId}-${year}-${month}`;
  } else {
    // Called with (monthYear)
    const monthYear = arg1;
    return `${monthYear.year}-${monthYear.month.toString().padStart(2, '0')}`;
  }
}

export function compareMonthYear(a: MonthYear, b: MonthYear): number {
  if (a.year !== b.year) {
    return a.year - b.year;
  }
  return a.month - b.month;
}

export function generateMonthYearOptions(startYear: number, yearsCount: number): MonthYear[] {
  const options: MonthYear[] = [];

  for (let year = startYear; year < startYear + yearsCount; year++) {
    for (let month = 0; month < 12; month++) {
      options.push({ month, year });
    }
  }

  return options;
}

