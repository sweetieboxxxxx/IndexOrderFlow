## IndexOrderFlow frontend

This directory contains the Next.js based frontend for the IndexOrderFlow dashboard.  It connects to the backend WebSocket exposed by the server and renders a minimalist order‑flow display consisting of bid/ask depth and a list of recent trades.

### Running locally

```
cd web
npm install
npm run dev
```

The site will start on `http://localhost:3000`.  By default it attempts to connect to `ws://localhost:8787` for order‑flow data.  To override this, set the environment variable `NEXT_PUBLIC_WS_URL` before starting.

### Environment variable

* `NEXT_PUBLIC_WS_URL` – The WebSocket endpoint for live order‑flow data.  In production this should be set to your deployed server’s WebSocket URL (for example `wss://indexorderflow-server.up.railway.app`).  When undefined, the client falls back to `ws://localhost:8787`.

### Extending the UI

The initial UI is intentionally simple.  Feel free to extend it with charts, footprints, CVD indicators or any other components.  You can also create additional pages by adding files under `pages/`.

### Licence

This code is provided under the MIT license.  See the repository root for details.