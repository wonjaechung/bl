import MarketTrends from './market-trends';
import MarketOverview from './market-overview';
import MarketHealthIndicators from './market-health-indicators';

export default function CenterPanel() {
  return (
    <div className="space-y-6">
      <MarketTrends />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <MarketOverview />
        </div>
        <div className="lg:col-span-4">
          <MarketHealthIndicators />
        </div>
      </div>
    </div>
  );
}
