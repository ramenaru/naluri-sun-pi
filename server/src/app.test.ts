import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './app.js';
import { PiCalculator } from './calculator.js';

test('GET /api/pi returns the current value', async () => {
  const app = buildApp(new PiCalculator(3, 0));
  const res = await app.inject('/api/pi');

  assert.equal(res.statusCode, 200);
  assert.equal(res.json().pi, '3');
  assert.equal(res.json().decimals, 0);
});

test('GET /api/pi follows the calculator', async () => {
  const calculator = new PiCalculator(3, 0);
  const app = buildApp(calculator);
  await calculator.start({ info: () => {}, error: () => {} });

  const res = await app.inject('/api/pi');
  assert.equal(res.json().pi, '3.141');
});

test('GET /api/health', async () => {
  const app = buildApp(new PiCalculator(3, 0));
  const res = await app.inject('/api/health');

  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, 'ok');
});

test('unknown route returns a json 404', async () => {
  const app = buildApp(new PiCalculator(3, 0));
  const res = await app.inject('/nope');

  assert.equal(res.statusCode, 404);
  assert.match(res.json().error, /not found/);
});

test('unexpected errors return 500 without the details', async () => {
  const app = buildApp(new PiCalculator(3, 0));
  app.get('/boom', async () => {
    throw new Error('secret stuff');
  });
  const res = await app.inject('/boom');

  assert.equal(res.statusCode, 500);
  assert.equal(res.json().error, 'Internal Server Error');
  assert.ok(!res.body.includes('secret'));
});
