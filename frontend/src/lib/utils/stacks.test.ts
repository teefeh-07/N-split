// Stacks Utils Tests

import { describe, it, expect } from 'vitest';
import { stxToMicro, microToStx } from './stacks';

describe('stxToMicro', () => {
  it('should convert STX to microSTX', () => {
    expect(stxToMicro(1)).toBe(1_000_000);
    expect(stxToMicro(0.5)).toBe(500_000);
  });
});

