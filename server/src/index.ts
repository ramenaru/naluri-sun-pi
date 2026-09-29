import { buildApp } from './app.js';
import { PiCalculator } from './calculator.js';
import { loadConfig, type Config } from './config.js';

let config: Config;
try {
  config = loadConfig();
} catch (err) {
  console.error(`Invalid config: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const calculator = new PiCalculator(config.maxDecimals, config.delayMs);
const app = buildApp(calculator, { staticDir: config.staticDir, logger: true });

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    app.log.info(`got ${signal}, shutting down`);
    calculator.stop();
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ port: config.port, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

calculator.start(app.log);
