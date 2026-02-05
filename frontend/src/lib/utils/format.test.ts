// Format Utils Tests

import { describe, it, expect } from 'vitest';
import { truncateAddress, formatCurrency, formatTokenAmount } from './format';

describe('truncateAddress', () => {
  it('should truncate address correctly', () => {
    const addr = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    expect(truncateAddress(addr)).toBe('ST1PQH...PGZGM');
  });

  it('should handle empty string', () => {
    expect(truncateAddress('')).toBe('');
  });
});

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});

