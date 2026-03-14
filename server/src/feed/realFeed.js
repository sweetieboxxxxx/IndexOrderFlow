/**
 * Real order‑flow feed adapter.
 *
 * This file is a placeholder for connecting to a real market data feed.  Many data
 * vendors offer APIs that supply depth of market and trade information for futures
 * and indices (for example, dxFeed, Rithmic, CQG, etc.).  To use this template
 * with live order‑flow, implement the `getFeed` function below to connect to
 * your chosen provider and call the supplied callback whenever new data is
 * available.
 *
 * Because real‑time market data requires authentication and may incur fees,
 * this repository does not include any vendor code.  Consult your data vendor’s
 * documentation for examples of subscribing to Level II market data.  At a high
 * level, your adapter should:
 *   1. Create a connection to the vendor’s API (WebSocket, TCP or HTTP).
 *   2. Subscribe to the instrument you care about (e.g. Dow Jones futures `YM`).
 *   3. On each update, build an object with the shape `{ type: 'snapshot', bids, asks, trades, timestamp }`.
 *   4. Call the provided callback with that object.  The server will broadcast it.
 */

function getFeed(callback) {
  // TODO: Implement real‑time feed integration here.
  // Example pseudo‑code:
  // const vendor = new VendorAPI({ apiKey: process.env.FEED_KEY });
  // vendor.on('depth', ({ bids, asks }) => {
  //   callback({ type: 'snapshot', bids, asks, trades: [], timestamp: Date.now() });
  // });
  // vendor.subscribe('YM');

  console.warn('[IndexOrderFlow] realFeed.js has not been implemented.  Falling back to simulated data.');
  // Fallback: use the simulated feed as a placeholder.
  const { getFeed: simulated } = require('./simulatedFeed');
  return simulated(callback);
}

module.exports = { getFeed };