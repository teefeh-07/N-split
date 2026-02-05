// Validation Tests

import { describe, it, expect } from 'vitest';
import { isValidStxAddress, isValidAmount, isValidTokenName, isValidTokenSymbol } from './validation';

describe('isValidStxAddress', () => {
  it('should return true for valid testnet address', () => {
    expect(isValidStxAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(true);
  });

  it('should return false for invalid address', () => {
    expect(isValidStxAddress('invalid')).toBe(false);
  });
});

describe('isValidAmount', () => {
  it('should return true for positive numbers', () => {
    expect(isValidAmount('100')).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isValidAmount('0')).toBe(false);
  });
});

describe('isValidTokenName', () => {
  it('should accept valid names', () => {
    expect(isValidTokenName('MyToken')).toBe(true);
  });

  it('should reject short names', () => {
    expect(isValidTokenName('AB')).toBe(false);
  });
});

