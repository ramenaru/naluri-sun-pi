# Naluri challenge: Pi server and Sun circumference

The server (Fastify + TypeScript) calculates Pi one decimal at a time (3, 3.1, 3.14, ...) in the background and
returns the most accurate value it has. The web app (React + Vite + TypeScript) shows that value and the
circumference of the Sun calculated from it.

## Run it (Node 20+)

```bash
# terminal 1, API on http://localhost:3001
cd server
npm install
npm start

# terminal 2, web app on http://localhost:5173
cd client
npm install
npm run dev
```

Or with Docker (API and web app on one port):

```bash
docker compose up --build   # http://localhost:3001
```

## Tests

```bash
cd server && npm test
cd client && npm test
```

## API

| Method | Path          | Response                                                   |
|--------|---------------|------------------------------------------------------------|
| GET    | `/api/pi`     | `{ "pi": "3.14159", "decimals": 5, "updatedAt": "<date>" }` |
| GET    | `/api/health` | `{ "status": "ok", "decimals": 5 }`                        |

Errors come back as json: `{ "error": "..." }`.

## Settings (server env vars)

| Name              | Default | What it does                                       |
|-------------------|---------|----------------------------------------------------|
| `PORT`            | 3001    | port of the server                                 |
| `PI_MAX_DECIMALS` | 1000    | stop calculating at this many decimals (max 10000) |
| `PI_DELAY_MS`     | 300     | pause between decimals so you can see it grow      |
| `STATIC_DIR`      | -       | folder with the built web app (set in Docker)      |

## CI / deployment

`.github/workflows/ci.yml` runs typecheck, tests and build for server and client, then builds the Docker image.
On `main` it also pushes the image to `ghcr.io/ramenaru/naluri-sun-pi`. To run it somewhere:
`docker run -d -p 80:3001 ghcr.io/ramenaru/naluri-sun-pi:latest`

## Notes

- Pi uses Machin's formula with BigInt. The result is cut, not rounded, so every digit is correct.
- The circumference uses BigInt too, because Pi has up to 1000 digits (radius 695,700 km).
- If a calculation fails the server keeps the last good value. If the server goes down the web app keeps showing the last value.

## Limitations / future work

- State is in memory, a restart begins again at 3.
- Every step calculates from scratch. Fine for 1000 digits, slow for much more (a spigot algorithm would be better).
- The web app polls every second, server-sent events would be nicer.
- No automatic deploy yet, CI only publishes the image.
