# IndexOrderFlow

**IndexOrderFlow** is a starter kit for building your own high‑fidelity order‑flow dashboard.  The goal of this template is to make it as simple as possible for you to stand up an order‑flow viewer that can ingest real‑time depth and trade data from whichever data vendor you choose.

> ⚠️ **Real‑time data required**
>
> This repository does not ship with any paid exchange data.  Out of the box the server includes a simple simulated feed for demonstration purposes only.  To use real order‑flow you must provide a data source (for example a licensed CME feed, dxFeed, Rithmic, CQG, etc.) and implement a small adapter in `server/src/feed/realFeed.js`.

## Repository layout

```
IndexOrderFlow-site/
├── server/           # Express + WebSocket server
│   ├── package.json  # Node dependencies
│   ├── src/
│   │   ├── server.js # HTTP & WS server entrypoint
│   │   └── feed/
│   │       ├── simulatedFeed.js  # Demo feed used by default
│   │       └── realFeed.js       # Adapter for your live data feed (needs implementation)
│   └── README.md    # notes specific to the server
└── web/             # Next.js frontend
    ├── package.json # Frontend dependencies
    ├── next.config.js
    ├── pages/
    │   └── index.js # Main dashboard page
    ├── components/
    │   └── OrderFlowDashboard.js # React component rendering order flow panels
    └── README.md    # notes specific to the web client
```

## Quick start

The project is organised as a mono‑repo with separate `server` and `web` packages.  The backend exposes WebSocket endpoint under `/` that streams order‑flow data to the React frontend.

### Running locally

1. **Install dependencies**.  Run the following commands in separate terminals:

   ```bash
   # In the server folder
   cd server
   npm install
   npm start
   # In the web folder
   cd web
   npm install
   npm run dev
   ```

2. **Open the dashboard** at http://localhost:3000.  You should see the IndexOrderFlow dashboard receiving simulated order‑flow data.

3. **Connect your real feed**.  If you have credentials for a live order‑flow feed, open `server/src/feed/realFeed.js` and follow the inline comments to integrate your vendor’s API.  Then edit `server/src/server.js` to import `realFeed` instead of `simulatedFeed`.

## Deploying to the cloud

You can host the server and frontend separately (for example using Railway for the server and Vercel for the Next.js frontend) or together using a single hosting provider.  To deploy:

* Set the environment variable `PORT` on your server host.  The server will listen on `process.env.PORT` or default to 8787.
* In the frontend, set `NEXT_PUBLIC_WS_URL` to the WebSocket URL of your deployed server (for example `wss://your‑server‑on‑railway.up.railway.app`).

## Caveats

* **This repository is a starter kit.**  It is not a complete trading or analytics platform.  You are responsible for sourcing and paying for any market data.  Ensure you abide by your data vendor’s licensing terms.
* **No investment advice.**  This project is provided for educational purposes only and does not constitute financial advice or an invitation to trade.
