import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // send /api calls to the fastify server, no cors needed
    proxy: { '/api': 'http://localhost:3001' },
  },
  test: { environment: 'jsdom' },
});
