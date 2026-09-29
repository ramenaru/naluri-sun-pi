FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

FROM node:22-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server ./
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production PORT=3001 STATIC_DIR=/app/public
WORKDIR /app
COPY --from=server-build /app/server/node_modules ./node_modules
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/package.json ./
COPY --from=client-build /app/client/dist ./public
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3001/api/health || exit 1
CMD ["node", "dist/index.js"]
