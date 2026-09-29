import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from './config.js';

test('uses defaults', () => {
  assert.deepEqual(loadConfig({}), { port: 3001, maxDecimals: 1000, delayMs: 300, staticDir: undefined });
});

test('reads env values', () => {
  const config = loadConfig({ PORT: '8080', PI_MAX_DECIMALS: '50', PI_DELAY_MS: '0', STATIC_DIR: '/app/public' });
  assert.deepEqual(config, { port: 8080, maxDecimals: 50, delayMs: 0, staticDir: '/app/public' });
});

test('throws on bad values', () => {
  assert.throws(() => loadConfig({ PORT: 'abc' }), /PORT/);
  assert.throws(() => loadConfig({ PI_DELAY_MS: '-5' }), /PI_DELAY_MS/);
  assert.throws(() => loadConfig({ PI_MAX_DECIMALS: '99999' }), /too big/);
});
