import { useEffect, useMemo, useRef, useState } from "react";

/**
 * IndexOrderFlow UI v2:
 * - clean layout (cards + grid)
 * - better tables
 * - shows spread + last update time
 * - auto-reconnect
 * - trade tape auto-scroll
 */

export default function OrderFlowDashboard() {
  const [status, setStatus] = useState("connecting");
  const [snapshot, setSnapshot] = useState(null);
  const [lastMsgAt, setLastMsgAt] = useState(null);

  const tradesEndRef = useRef(null);

  const wsUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8787";
  }, []);

  useEffect(() => {
    let ws;
    let retryTimer;

    const connect = () => {
      setStatus("connecting");
      ws = new WebSocket(wsUrl);

      ws.onopen = () => setStatus("connected");

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "snapshot") {
            setSnapshot(msg);
            setLastMsgAt(Date.now());
          }
        } catch (err) {
          // ignore invalid messages
        }
      };

      ws.onerror = () => setStatus("error");

      ws.onclose = () => {
        setStatus("reconnecting");
        retryTimer = setTimeout(connect, 1200);
      };
    };

    connect();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (ws) ws.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    // Auto-scroll trades panel
    tradesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [snapshot?.trades?.length]);

  const mid = useMemo(() => {
    if (!snapshot?.bids?.length || !snapshot?.asks?.length) return null;
    const bestBid = snapshot.bids[snapshot.bids.length - 1]?.price; // highest bid (last)
    const bestAsk = snapshot.asks[0]?.price; // lowest ask (first)
    if (bestBid == null || bestAsk == null) return null;
    return (bestBid + bestAsk) / 2;
  }, [snapshot]);

  const spread = useMemo(() => {
    if (!snapshot?.bids?.length || !snapshot?.asks?.length) return null;
    const bestBid = snapshot.bids[snapshot.bids.length - 1]?.price;
    const bestAsk = snapshot.asks[0]?.price;
    if (bestBid == null || bestAsk == null) return null;
    return bestAsk - bestBid;
  }, [snapshot]);

  const lastUpdateText = useMemo(() => {
    if (!lastMsgAt) return "—";
    const d = new Date(lastMsgAt);
    return d.toLocaleTimeString([], { hour12: false });
  }, [lastMsgAt]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>IndexOrderFlow</div>
          <div style={styles.subtitle}>YM Orderflow (US30 proxy)</div>
        </div>

        <div style={styles.badges}>
          <span style={{ ...styles.badge, ...badgeStyle(status) }}>{status.toUpperCase()}</span>
          <span style={styles.badgeMuted}>Last update: {lastUpdateText}</span>
        </div>
      </div>

      <div style={styles.topRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Mid</div>
          <div style={styles.statValue}>{mid == null ? "—" : mid.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Spread</div>
          <div style={styles.statValue}>{spread == null ? "—" : spread.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>WS</div>
          <div style={styles.monoSmall} title={wsUrl}>
            {wsUrl}
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Order Book</div>
            <div style={styles.cardHint}>Top levels</div>
          </div>

          {!snapshot ? (
            <div style={styles.loading}>Waiting for data…</div>
          ) : (
            <div style={styles.bookWrap}>
              <div style={styles.bookCol}>
                <div style={styles.tableTitle}>Bids</div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Price</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show bids highest first */}
                    {[...snapshot.bids].reverse().map((b, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, color: "#33d17a" }}>{fmt(b.price)}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>{b.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={styles.bookCol}>
                <div style={styles.tableTitle}>Asks</div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Price</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.asks.map((a, idx) => (
                      <tr key={idx}>
                        <td style={{ ...styles.td, color: "#ff6b6b" }}>{fmt(a.price)}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>{a.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>Time & Sales</div>
            <div style={styles.cardHint}>Latest prints</div>
          </div>

          {!snapshot ? (
            <div style={styles.loading}>Waiting for data…</div>
          ) : (
            <div style={styles.tapeBox}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Side</th>
                    <th style={styles.th}>Price</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.trades.map((t, idx) => (
                    <tr key={idx}>
                      <td style={{ ...styles.td, fontWeight: 700, color: t.direction === "buy" ? "#33d17a" : "#ff6b6b" }}>
                        {t.direction.toUpperCase()}
                      </td>
                      <td style={styles.td}>{fmt(t.price)}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>{t.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tradesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        Next refinements we can add: DOM ladder bars, footprint, CVD, alerts (sweep/absorption), watchlist.
      </div>
    </div>
  );
}

function fmt(n) {
  if (n == null) return "—";
  return Number(n).toFixed(2);
}

function badgeStyle(status) {
  if (status === "connected") return { background: "rgba(51,209,122,0.12)", borderColor: "rgba(51,209,122,0.35)", color: "#33d17a" };
  if (status === "connecting") return { background: "rgba(255,193,7,0.10)", borderColor: "rgba(255,193,7,0.35)", color: "#ffc107" };
  if (status === "reconnecting") return { background: "rgba(255,193,7,0.10)", borderColor: "rgba(255,193,7,0.35)", color: "#ffc107" };
  if (status === "error") return { background: "rgba(255,107,107,0.10)", borderColor: "rgba(255,107,107,0.35)", color: "#ff6b6b" };
  return { background: "rgba(160,160,160,0.10)", borderColor: "rgba(160,160,160,0.25)", color: "#d0d0d0" };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f14",
    color: "#e8eef6",
    padding: "24px",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
  },
  title: { fontSize: "34px", fontWeight: 800, letterSpacing: "-0.02em" },
  subtitle: { fontSize: "13px", opacity: 0.75, marginTop: "6px" },

  badges: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  badge: {
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "12px",
    fontWeight: 700,
  },
  badgeMuted: {
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: "12px",
    opacity: 0.8,
  },

  topRow: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", marginBottom: "14px" },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "14px",
  },
  statLabel: { fontSize: "12px", opacity: 0.75 },
  statValue: { fontSize: "22px", fontWeight: 800, marginTop: "6px" },
  monoSmall: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: "12px", opacity: 0.85, marginTop: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  grid: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "14px",
    overflow: "hidden",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" },
  cardTitle: { fontSize: "16px", fontWeight: 800 },
  cardHint: { fontSize: "12px", opacity: 0.7 },

  loading: { opacity: 0.75, padding: "10px 2px" },

  bookWrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  bookCol: {},
  tableTitle: { fontSize: "12px", opacity: 0.7, marginBottom: "6px" },

  tapeBox: { maxHeight: "420px", overflow: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" },

  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "12px", opacity: 0.7, padding: "10px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  td: { padding: "10px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "13px" },

  footer: { marginTop: "14px", fontSize: "12px", opacity: 0.7 },
};
