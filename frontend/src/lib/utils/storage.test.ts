// Storage Utils Tests

import { describe, it, expect, beforeEach } from 'vitest';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

describe('getStorageItem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return default value when key does not exist', () => {
    expect(getStorageItem('nonexistent', 'default')).toBe('default');
  });
});

describe('setStorageItem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save value to localStorage', () => {
    setStorageItem('test', { value: 123 });
    expect(localStorage.getItem('test')).toBe('{"value":123}');
  });
});
