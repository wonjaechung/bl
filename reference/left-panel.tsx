import SniperFeed from './sniper-feed';
import SupplyShockRadar from './supply-shock-radar';

export default function LeftPanel() {
  return (
    <div className="space-y-6">
      <SniperFeed />
      <SupplyShockRadar />
    </div>
  );
}
