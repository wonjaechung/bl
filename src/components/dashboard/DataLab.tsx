import React, { useState } from 'react';
import { MarketMoodHero } from './data-lab/market-mood-hero';
import { CoinFinder } from './data-lab/coin-finder';
import { ThemeCarousel } from './data-lab/theme-carousel';
import { UpcomingEvents } from './data-lab/upcoming-events';
import { ScheduleBanner } from './data-lab/schedule-banner';
import { IndicatorBanner } from './data-lab/indicator-banner';
import { SignalFeed } from './data-lab/signal-feed';
import { QuickTradeSheet } from './data-lab/quick-trade-sheet';
import TrendComparisonChart from './trend-comparison-chart';
import DominanceChart from './dominance-chart';
import { SmartMoneySection } from './data-lab/smart-money-section';
import EtfFlowTracker from './etf-flow-tracker';
import CorporateHoldingsChart from './corporate-holdings-chart';
import BithumbWhalePortfolio from './bithumb-whale-portfolio';
import MaxPainChart from './max-pain-chart';
import DexFuturesPositions from './dex-futures-positions';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

export default function DataLab() {
  const [isTradeSheetOpen, setIsTradeSheetOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [smartMoneyView, setSmartMoneyView] = useState<'etf' | 'dat' | 'whale' | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isIndicatorOpen, setIsIndicatorOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const handleBuyClick = (symbol: string, type: 'buy' | 'sell' = 'buy') => {
    setSelectedSymbol(symbol);
    setTradeType(type);
    setIsTradeSheetOpen(true);
  };

  const handleDeepDive = () => {
    console.log("Deep dive clicked");
  };

  return (
    <>
      {/* 부모(Index.tsx)의 스크롤을 그대로 사용. 불필요한 h-full, ScrollArea 제거 */}
      <div className="pb-24"> 
        <div className="space-y-4 pt-4">
          {/* 1. Hero Section: Market Mood */}
          <section className="px-4 space-y-4">
            <MarketMoodHero score={78} onDeepDive={handleDeepDive} />
            <CoinFinder />
            <ScheduleBanner onClick={() => setIsScheduleOpen(true)} />
            <UpcomingEvents isDialogOpen={isScheduleOpen} onOpenChange={setIsScheduleOpen} hideList />
          </section>

          {/* 1.5. Market Trend Comparison */}
          <section className="px-4">
            <TrendComparisonChart />
          </section>

          {/* 3. Trending Themes Carousel */}
          {/* 패딩 없이 화면 가로폭 전체 사용 */}
          <section className="w-full">
            <ThemeCarousel onSelectTheme={(id) => console.log(`Theme selected: ${id}`)} />
          </section>

          {/* 3.5 Smart Money Section */}
          <section className="w-full -mt-2">
            <SmartMoneySection onSelect={setSmartMoneyView} />
          </section>

          {/* 4. Signal Feed */}
          <section className="w-full -mt-2">
            <SignalFeed onBuyClick={handleBuyClick} />
            <div className="mt-4 px-4">
               <IndicatorBanner onClick={() => setIsIndicatorOpen(true)} />
            </div>
          </section>
        </div>
      </div>

      <QuickTradeSheet 
        isOpen={isTradeSheetOpen} 
        onClose={() => setIsTradeSheetOpen(false)} 
        symbol={selectedSymbol}
        type={tradeType}
      />

      {/* Smart Money Detail Drawer */}
      <Drawer open={!!smartMoneyView} onOpenChange={(open) => !open && setSmartMoneyView(null)}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
            <DrawerHeader className="text-left">
                <DrawerTitle>
                    {smartMoneyView === 'etf' && "비트코인 현물 ETF 유입"}
                    {smartMoneyView === 'dat' && "기업 비트코인 보유 현황"}
                    {smartMoneyView === 'whale' && "고래 데이터"}
                </DrawerTitle>
                <DrawerDescription>
                    {smartMoneyView === 'etf' && "기관 자금의 흐름을 실시간으로 추적합니다."}
                    {smartMoneyView === 'dat' && "상장 기업들의 비트코인 보유량 변화를 확인하세요."}
                    {smartMoneyView === 'whale' && "온체인 및 거래소 내 큰손들의 움직임을 분석합니다."}
                </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto flex-1 pb-10 space-y-6">
                {smartMoneyView === 'etf' && <EtfFlowTracker />}
                {smartMoneyView === 'dat' && <CorporateHoldingsChart />}
                {smartMoneyView === 'whale' && (
                  <>
                    <MaxPainChart />
                    <DexFuturesPositions />
                    <BithumbWhalePortfolio />
                  </>
                )}
            </div>
        </DrawerContent>
      </Drawer>

      {/* Indicator Drawer */}
      <Drawer open={isIndicatorOpen} onOpenChange={setIsIndicatorOpen}>
        <DrawerContent className="max-h-[90vh] flex flex-col">
            <DrawerHeader className="text-left">
                <DrawerTitle>시장 보조 지표</DrawerTitle>
                <DrawerDescription>
                    비트코인 도미넌스, 김치 프리미엄 등 주요 시장 지표를 확인하세요.
                </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto flex-1 pb-10 space-y-6">
                 <DominanceChart />
            </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
