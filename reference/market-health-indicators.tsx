'use client';
import FearGreedIndex from './btc-fear-greed-index';
import BitcoinDominance from './bitcoin-dominance';
import KimchiPremium from './kimchi-premium';
import BithumbVolume from './bithumb-volume';
import MarketMovers from './market-movers';
import AverageCryptoRsi from './average-crypto-rsi';

export default function MarketHealthIndicators() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FearGreedIndex />
        <BitcoinDominance />
        <KimchiPremium />
        <BithumbVolume />
        <MarketMovers />
        <AverageCryptoRsi />
    </div>
  );
}
