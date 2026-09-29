import { describe, expect, it } from 'vitest';
import { sunCircumferenceKm } from './circumference';

describe('sunCircumferenceKm', () => {
  it('works with pi = 3', () => {
    expect(sunCircumferenceKm('3')).toBe('4,174,200');
  });

  it('keeps the decimals', () => {
    expect(sunCircumferenceKm('3.1')).toBe('4,313,340.0');
    expect(sunCircumferenceKm('3.14')).toBe('4,368,996.00');
    expect(sunCircumferenceKm('3.14159')).toBe('4,371,208.32600');
  });

  it('stays exact with a lot of digits', () => {
    const result = sunCircumferenceKm('3.' + '1'.repeat(300));
    expect(result.split('.')[1]).toHaveLength(300);
  });
});
