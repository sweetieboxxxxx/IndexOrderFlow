import dynamic from 'next/dynamic';

// Dynamically import the dashboard to avoid Next.js SSR issues with WebSocket
const OrderFlowDashboard = dynamic(() => import('../components/OrderFlowDashboard'), { ssr: false });

export default function Home() {
  return (
    <main>
      <OrderFlowDashboard />
    </main>
  );
}