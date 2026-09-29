import { resolve } from 'node:path';

export type Config = {
  port: number;
  maxDecimals: number;
  delayMs: number;
  staticDir?: string;
};

function readNumber(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (!raw) return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a whole number, got "${raw}"`);
  }
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const maxDecimals = readNumber(env, 'PI_MAX_DECIMALS', 1000);
  if (maxDecimals > 10000) {
    throw new Error('PI_MAX_DECIMALS is too big, max is 10000');
  }

  return {
    port: readNumber(env, 'PORT', 3001),
    maxDecimals,
    delayMs: readNumber(env, 'PI_DELAY_MS', 300),
    staticDir: env.STATIC_DIR ? resolve(env.STATIC_DIR) : undefined,
  };
}
