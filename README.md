# Zenflow

Zenflow is a focus dashboard with a premium ambient UI built with `React`, `Vite`, `Zustand` and `Express`.

## Stack

- `Client/`: React + Vite frontend
- `server/`: Express API for health, quotes and weather proxy

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Environment

Create a `.env` file in the project root:

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
OPENWEATHER_API_KEY=your_api_key_here
```
