# Polymarket Widget

A single-page widget to explore [Polymarket](https://polymarket.com/) prediction markets, place simulated bets, and ask an AI (Claude) for a recommendation on which outcome to bet on.

Built as a solution to a technical challenge: *"Create a Polymarket widget that allows a user to place a bet on a market and use AI to assist in choosing a market and outcome."*

## What it does

- **Searches real markets**: queries Polymarket's Gamma API live (prices, liquidity, volume, outcomes) — no mocked data.
- **Selects a market** from the list and shows its up-to-date detail (implied probabilities per outcome, liquidity, volume, whether it's closed).
- **Asks the AI for a recommendation**: the backend sends Claude the real data for the selected market and gets back, in structured format, which outcome to take (BUY/SELL), a confidence %, and the reasoning — it never decides for the user, it only pre-fills the form if the suggestion is accepted ("Use this pick").
- **Places a simulated bet**: the backend validates the market/outcome against Polymarket and computes the price server-side (it never trusts what the browser sends), no real money moves.
- **Bet history** persisted on the backend (in the process's memory) — survives a browser refresh, is lost if you restart the server.

## Architecture

Two independent projects that talk over HTTP:

```
frontend/   React + Vite       → UI, app state, calls the backend
backend/    Express + TS       → REST API, talks to Polymarket's Gamma API and to Claude
```

The frontend never calls Polymarket or Anthropic directly — everything goes through the backend, so the `ANTHROPIC_API_KEY` never reaches the browser.

## Stack

**Backend** (`backend/`)
- Node.js 22 + TypeScript
- Express — REST API
- `@anthropic-ai/sdk` + `zod` — AI recommendations with structured output
- `swagger-ui-express` — interactive API documentation
- `cors`, `dotenv`
- `tsx watch` for development (hot reload)

**Frontend** (`frontend/`)
- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `oxlint`

## Environment variables

Only **one file, inside `backend/`** is needed — whether you run it with Docker or without:

```
backend/.env
```
```
ANTHROPIC_API_KEY=sk-ant-...
```

- Used by the backend to ask Claude for the recommendation (the "Ask AI for a pick" button). Without it, everything else still works — only that feature fails.
- With Docker: `backend/` is mounted as a volume, so this file reaches the container on its own — you don't need anything at the project root or to pass it into `docker-compose.yml`.
- `VITE_API_URL` (frontend) doesn't need to be set: it already defaults to `http://localhost:4200`, both in Docker and locally.
- The file must be named exactly `.env` (with the leading dot, no suffixes like `-example`) — otherwise `dotenv` won't read it.
- Never commit it to git (it's already in `backend/.gitignore`) or paste it into a shared chat/terminal — if an API key ever ends up exposed in plain text somewhere, revoke it in the Anthropic console and generate a new one.

## Running with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
docker compose up -d --build
```

- Frontend: **http://localhost:5173**
- Backend: **http://localhost:4200**
- Swagger (API docs): **http://localhost:4200/api-docs**

Other useful commands:
```bash
docker compose logs -f        # follow logs from both services
docker compose down           # stop and remove the containers
docker compose up -d --build  # rebuild if you changed package.json or the Dockerfile
```

`backend/` and `frontend/` are mounted as volumes, so code changes are picked up automatically (hot reload) without rebuilding the image.

## Running without Docker (with npm)

If you don't have Docker installed, run each project separately. Requires Node.js 22+.

**Backend** (one terminal):
```bash
cd backend
npm install
```
Create `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=4200
```
```bash
npm run dev
```

**Frontend** (another terminal):
```bash
cd frontend
npm install
npm run dev
```
If your backend runs on a different port or host than `http://localhost:4200`, create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:4200
```

URLs (Vite may pick a different port if 5173 is busy — check what the terminal prints):
- Frontend: **http://localhost:5173**
- Backend: **http://localhost:4200**
- Swagger: **http://localhost:4200/api-docs**

## Main endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/markets?q=text` | List or search markets (Polymarket's Gamma API) |
| GET | `/api/markets/:slug` | Market detail |
| GET | `/api/bets` | Simulated bet history |
| POST | `/api/bets` | Place a simulated bet |
| POST | `/api/ai/recommend` | AI recommendation on which outcome to bet on |

All documented in Swagger: `http://localhost:4200/api-docs`.

## Author

**Paola Olarte**
