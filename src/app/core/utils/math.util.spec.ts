import {
  formatCurrency,
  parseNumericValue,
  roundToTwoDecimals,
  sumArray,
} from './math.util';

describe('Math Utilities', () => {
  describe('roundToTwoDecimals', () => {
    it('should round to two decimal places', () => {
      expect(roundToTwoDecimals(10.123)).toBe(10.12);
      expect(roundToTwoDecimals(10.126)).toBe(10.13);
      expect(roundToTwoDecimals(10.125)).toBe(10.13);
    });

    it('should handle whole numbers', () => {
      expect(roundToTwoDecimals(10)).toBe(10);
    });

    it('should handle negative numbers', () => {
      expect(roundToTwoDecimals(-10.456)).toBe(-10.46);
    });
  });

  describe('sumArray', () => {
    it('should sum an array of numbers', () => {
      expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    });

    it('should handle empty array', () => {
      expect(sumArray([])).toBe(0);
    });

    it('should round the result', () => {
      expect(sumArray([0.1, 0.2, 0.3])).toBe(0.6);
    });

    it('should handle negative numbers', () => {
      expect(sumArray([10, -5, 3])).toBe(8);
    });
  });

  describe('parseNumericValue', () => {
    it('should parse numeric strings', () => {
      expect(parseNumericValue('123.45')).toBe(123.45);
      expect(parseNumericValue('100')).toBe(100);
    });

    it('should handle strings with currency symbols', () => {
      expect(parseNumericValue('$123.45')).toBe(123.45);
      expect(parseNumericValue('€100.00')).toBe(100);
    });

    it('should handle strings with commas', () => {
      expect(parseNumericValue('1,234.56')).toBe(1234.56);
    });

    it('should handle negative numbers', () => {
      expect(parseNumericValue('-123.45')).toBe(-123.45);
    });

    it('should return 0 for invalid input', () => {
      expect(parseNumericValue('abc')).toBe(0);
      expect(parseNumericValue('')).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as currency', () => {
      expect(formatCurrency(1234.56)).toBe('1,234.56');
      expect(formatCurrency(100)).toBe('100.00');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-1,234.56');
    });
  });
});

