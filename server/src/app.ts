import Fastify, { type FastifyError } from 'fastify';
import fastifyStatic from '@fastify/static';
import type { PiCalculator } from './calculator.js';

type Options = {
  staticDir?: string;
  logger?: boolean;
};

export function buildApp(calculator: PiCalculator, options: Options = {}) {
  const app = Fastify({ logger: options.logger ?? false });

  app.get('/api/pi', async () => calculator.state);

  app.get('/api/health', async () => ({ status: 'ok', decimals: calculator.state.decimals }));

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: `Route ${request.method} ${request.url} not found` });
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error(error);
    const status = error.statusCode ?? 500;
    // dont leak internal error messages to the client
    reply.status(status).send({ error: status >= 500 ? 'Internal Server Error' : error.message });
  });

  if (options.staticDir) {
    app.register(fastifyStatic, { root: options.staticDir });
  }

  return app;
}
