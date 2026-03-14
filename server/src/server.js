const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Choose which feed to use.  By default we import the simulated feed.
// To hook up real data, replace this import with './feed/realFeed'
const { getFeed } = require('./feed/simulatedFeed');

const app = express();
const server = http.createServer(app);

// Create a WebSocket server that shares the same HTTP server.
const wss = new WebSocket.Server({ server });

// Broadcast helper.  Encodes the data to JSON and sends to all connected clients.
function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Start the feed.  The feed will call the provided callback whenever it has data to broadcast.
getFeed(broadcast);

// Connection handling.  We don't need to do anything on connection except acknowledge.
wss.on('connection', (ws) => {
  // Send a welcome message so the client knows the connection is established.
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to IndexOrderFlow WebSocket' }));
});

const port = process.env.PORT || 8787;
server.listen(port, () => {
  console.log(`IndexOrderFlow server listening on port ${port}`);
});