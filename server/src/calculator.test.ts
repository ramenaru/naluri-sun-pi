import test from 'node:test';
import assert from 'node:assert/strict';
import { PiCalculator } from './calculator.js';

const log = { info: () => {}, error: () => {} };
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('starts with 3', () => {
  const calc = new PiCalculator(5, 0);
  assert.equal(calc.state.pi, '3');
  assert.equal(calc.state.decimals, 0);
});

test('ends with the most accurate value', async () => {
  const calc = new PiCalculator(5, 0);
  await calc.start(log);
  assert.equal(calc.state.pi, '3.14159');
  assert.equal(calc.state.decimals, 5);
});

test('keeps the last good value when the calculation fails', async () => {
  const compute = (d: number) => {
    if (d === 3) throw new Error('boom');
    return d === 1 ? '3.1' : '3.14';
  };
  const calc = new PiCalculator(10, 0, compute);
  await calc.start(log);
  assert.equal(calc.state.pi, '3.14');
  assert.equal(calc.state.decimals, 2);
});

test('stop() ends the loop early', async () => {
  const calc = new PiCalculator(1000, 5);
  const running = calc.start(log);
  await sleep(30);
  calc.stop();
  await running;
  assert.ok(calc.state.decimals > 0);
  assert.ok(calc.state.decimals < 1000);
});
