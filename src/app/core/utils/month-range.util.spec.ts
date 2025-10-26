import {
  compareMonthYear,
  formatMonthYear,
  getMonthKey,
  getMonthName,
  getMonthsBetween,
} from './month-range.util';
import { MonthYear } from '../models';

describe('Month Range Utilities', () => {
  describe('getMonthName', () => {
    it('should return correct month name', () => {
      expect(getMonthName(0)).toBe('January');
      expect(getMonthName(5)).toBe('June');
      expect(getMonthName(11)).toBe('December');
    });
  });

  describe('formatMonthYear', () => {
    it('should format month and year', () => {
      const monthYear: MonthYear = { month: 0, year: 2024 };
      expect(formatMonthYear(monthYear)).toBe('January 2024');
    });

    it('should handle different months', () => {
      const monthYear: MonthYear = { month: 6, year: 2023 };
      expect(formatMonthYear(monthYear)).toBe('July 2023');
    });
  });

  describe('getMonthsBetween', () => {
    it('should return months within same year', () => {
      const start: MonthYear = { month: 0, year: 2024 };
      const end: MonthYear = { month: 2, year: 2024 };
      const result = getMonthsBetween(start, end);

      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ month: 0, year: 2024 });
      expect(result[1]).toEqual({ month: 1, year: 2024 });
      expect(result[2]).toEqual({ month: 2, year: 2024 });
    });

    it('should handle year transitions', () => {
      const start: MonthYear = { month: 11, year: 2023 };
      const end: MonthYear = { month: 1, year: 2024 };
      const result = getMonthsBetween(start, end);

      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ month: 11, year: 2023 });
      expect(result[1]).toEqual({ month: 0, year: 2024 });
      expect(result[2]).toEqual({ month: 1, year: 2024 });
    });

    it('should handle single month', () => {
      const start: MonthYear = { month: 5, year: 2024 };
      const end: MonthYear = { month: 5, year: 2024 };
      const result = getMonthsBetween(start, end);

      expect(result.length).toBe(1);
      expect(result[0]).toEqual({ month: 5, year: 2024 });
    });
  });

  describe('getMonthKey', () => {
    it('should generate consistent keys', () => {
      const monthYear: MonthYear = { month: 0, year: 2024 };
      expect(getMonthKey(monthYear)).toBe('2024-00');
    });

    it('should pad single digit months', () => {
      const monthYear: MonthYear = { month: 9, year: 2024 };
      expect(getMonthKey(monthYear)).toBe('2024-09');
    });
  });

  describe('compareMonthYear', () => {
    it('should compare by year first', () => {
      const a: MonthYear = { month: 11, year: 2023 };
      const b: MonthYear = { month: 0, year: 2024 };
      expect(compareMonthYear(a, b)).toBeLessThan(0);
      expect(compareMonthYear(b, a)).toBeGreaterThan(0);
    });

    it('should compare by month when years are equal', () => {
      const a: MonthYear = { month: 5, year: 2024 };
      const b: MonthYear = { month: 8, year: 2024 };
      expect(compareMonthYear(a, b)).toBeLessThan(0);
      expect(compareMonthYear(b, a)).toBeGreaterThan(0);
    });

    it('should return 0 for equal dates', () => {
      const a: MonthYear = { month: 5, year: 2024 };
      const b: MonthYear = { month: 5, year: 2024 };
      expect(compareMonthYear(a, b)).toBe(0);
    });
  });
});

