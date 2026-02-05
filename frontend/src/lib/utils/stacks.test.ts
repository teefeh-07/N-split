// Stacks Utils Tests

import { describe, it, expect } from 'vitest';
import { stxToMicro, microToStx } from './stacks';

describe('stxToMicro', () => {
  it('should convert STX to microSTX', () => {
    expect(stxToMicro(1)).toBe(1_000_000);
    expect(stxToMicro(0.5)).toBe(500_000);
  });
});

describe('microToStx', () => {
  it('should convert microSTX to STX', () => {
    expect(microToStx(1_000_000)).toBe(1);
    expect(microToStx(500_000)).toBe(0.5);
  });
});

