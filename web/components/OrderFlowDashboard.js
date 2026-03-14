import { useEffect, useState } from 'react';

/**
 * OrderFlowDashboard connects to the backend WebSocket and renders a simple
 * order‑book and time & sales view.  It listens for JSON messages of the form
 * `{ type: 'snapshot', bids, asks, trades, timestamp }` and updates its
 * internal state accordingly.
 */
export default function OrderFlowDashboard() {
  const [status, setStatus] = useState('connecting');
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    // Determine the WebSocket URL from env or default to localhost.
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8787';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'snapshot') {
          setSnapshot(msg);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.onclose = () => {
      setStatus('closed');
    };
    ws.onerror = () => {
      setStatus('error');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans‑serif', padding: '1rem' }}>
      <h1>IndexOrderFlow Dashboard</h1>
      <p>Status: <strong>{status}</strong></p>
      {snapshot ? (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Order book */}
          <div>
            <h2>Order Book</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div>
                <h3>Bids</h3>
                <table style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Price</th>
                      <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.bids.map((b, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '0.25rem 0.5rem' }}>{b.price}</td>
                        <td style={{ padding: '0.25rem 0.5rem' }}>{b.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h3>Asks</h3>
                <table style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Price</th>
                      <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.asks.map((a, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '0.25rem 0.5rem' }}>{a.price}</td>
                        <td style={{ padding: '0.25rem 0.5rem' }}>{a.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Trades */}
          <div>
            <h2>Recent Trades</h2>
            {snapshot.trades.length === 0 ? (
              <p>No trades in this interval.</p>
            ) : (
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Direction</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Price</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '0.25rem 0.5rem' }}>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.trades.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.25rem 0.5rem', color: t.direction === 'buy' ? 'green' : 'red' }}>
                        {t.direction}
                      </td>
                      <td style={{ padding: '0.25rem 0.5rem' }}>{t.price}</td>
                      <td style={{ padding: '0.25rem 0.5rem' }}>{t.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <p>Waiting for data…</p>
      )}
    </div>
  );
}