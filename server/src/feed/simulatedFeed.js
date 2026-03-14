/**
 * Simulated order‑flow feed for demonstration purposes.
 *
 * This module exports a single function `getFeed` that accepts a callback.  The callback
 * will be invoked with order‑flow updates at a regular interval.  Each update includes
 * a set of bid and ask levels, a list of recent trades and a timestamp.  All values
 * are randomly generated; they do not reflect any real market data.
 */

function generateSnapshot(basePrice) {
  const levels = 5;
  const tick = 1;
  const bids = [];
  const asks = [];

  for (let i = levels; i > 0; i--) {
    // Bid prices lower than base
    const price = basePrice - i * tick;
    const size = Math.floor(Math.random() * 20) + 1;
    bids.push({ price, size });
  }

  for (let i = 1; i <= levels; i++) {
    // Ask prices higher than base
    const price = basePrice + i * tick;
    const size = Math.floor(Math.random() * 20) + 1;
    asks.push({ price, size });
  }

  // Generate a few trades around the base price
  const trades = [];
  const tradeCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < tradeCount; i++) {
    const direction = Math.random() > 0.5 ? 'buy' : 'sell';
    const price = basePrice + (Math.random() - 0.5) * 2;
    const size = Math.floor(Math.random() * 5) + 1;
    trades.push({ direction, price: Math.round(price * 100) / 100, size });
  }

  return { bids, asks, trades, timestamp: Date.now() };
}

/**
 * Start the simulated feed.
 * @param {function(object):void} callback - Invoked with each order‑flow update.
 */
function getFeed(callback) {
  let basePrice = 35000;
  // Update the base price slightly each interval to simulate drift.
  setInterval(() => {
    // Random walk: adjust basePrice by -1, 0 or +1
    basePrice += Math.floor(Math.random() * 3) - 1;
    const snapshot = generateSnapshot(basePrice);
    callback({ type: 'snapshot', ...snapshot });
  }, 1000);
}

module.exports = { getFeed };