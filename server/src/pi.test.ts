import test from 'node:test';
import assert from 'node:assert/strict';
import { piToDecimals } from './pi.js';

test('returns the first decimals', () => {
  assert.equal(piToDecimals(0), '3');
  assert.equal(piToDecimals(1), '3.1');
  assert.equal(piToDecimals(5), '3.14159');
  assert.equal(piToDecimals(15), '3.141592653589793');
});

test('is correct up to 50 decimals', () => {
  assert.equal(piToDecimals(50), '3.14159265358979323846264338327950288419716939937510');
});

test('cuts the digits, does not round', () => {
  // next digit is 5, rounding would give 3.142
  assert.equal(piToDecimals(3), '3.141');
});

test('throws on bad input', () => {
  assert.throws(() => piToDecimals(-1), RangeError);
  assert.throws(() => piToDecimals(1.5), RangeError);
  assert.throws(() => piToDecimals(NaN), RangeError);
});
