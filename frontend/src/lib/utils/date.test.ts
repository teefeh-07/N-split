// Date Utils Tests

import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatDuration, isExpired, getDaysUntil } from './date';

describe('formatRelativeTime', () => {
  it('should return just now for recent timestamps', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeTime(now)).toBe('Just now');
  });
});

describe('formatDuration', () => {
  it('should format days correctly', () => {
    expect(formatDuration(86400)).toBe('1d');
  });

  it('should format hours correctly', () => {
    expect(formatDuration(3600)).toBe('1h');
  });
});

describe('isExpired', () => {
  it('should return true for past timestamps', () => {
    const pastTimestamp = Math.floor(Date.now() / 1000) - 1000;
    expect(isExpired(pastTimestamp)).toBe(true);
  });

  it('should return false for future timestamps', () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 1000;
    expect(isExpired(futureTimestamp)).toBe(false);
  });
});
