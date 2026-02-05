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

