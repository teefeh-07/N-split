// Number Utils Tests

import { describe, it, expect } from 'vitest';
import { formatCompact, clamp, percentage, roundToDecimals } from './number';

describe('formatCompact', () => {
  it('should format millions', () => {
    expect(formatCompact(1500000)).toBe('1.5M');
  });

  it('should format thousands', () => {
    expect(formatCompact(2500)).toBe('2.5K');
  });
});

describe('clamp', () => {
  it('should clamp to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should clamp to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('percentage', () => {
  it('should calculate percentage correctly', () => {
    expect(percentage(25, 100)).toBe(25);
  });

  it('should return 0 for zero total', () => {
    expect(percentage(10, 0)).toBe(0);
  });
});
