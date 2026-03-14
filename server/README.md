## IndexOrderFlow server

This directory contains the backend portion of the IndexOrderFlow project.  The server is a small Node.js/Express application that exposes a WebSocket endpoint for streaming order‑flow data to the frontend.

### Features

* **WebSocket server** using the `ws` package.
* **Pluggable feed** architecture – by default the server uses a built‑in simulated feed, but you can easily swap in your own real market data feed by editing `src/server.js` to import from `feed/realFeed.js` and implementing that adapter.
* **Environment aware** – listens on `process.env.PORT` if provided.

### Running

```
cd server
npm install
npm start
```

The server will log the port it is listening on.  Clients can connect to `ws://localhost:<PORT>` for local development.

### Real data feed

The included simulated feed sends random order‑book and trade updates and should not be used in production.  For live trading or analysis you must implement `feed/realFeed.js` yourself.  Consult your data provider’s API for details on subscribing to level‑II data for the instruments you care about.  Once implemented, change the import in `src/server.js` from:

```js
const { getFeed } = require('./feed/simulatedFeed');
```

to:

```js
const { getFeed } = require('./feed/realFeed');
```

and restart the server.

### Licence

This code is provided under the MIT license.  See the repository root for details.