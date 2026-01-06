import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shield, Flame, TrendingDown, History, Sparkles, ArrowRight, Anchor, GitCompare, Zap, PiggyBank, ArrowDownCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data for Filter (Expanded)
const COIN_DATABASE = [
  { id: 'btc', name: '비트코인', symbol: 'BTC', price: '98,200,000', change: '+0.8%', tags: ['shield', 'history', 'defense', 'lending', 'borrow'], icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'eth', name: '이더리움', symbol: 'ETH', price: '3,520,000', change: '+1.2%', tags: ['shield', 'history', 'defense', 'lending', 'borrow'], icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'xrp', name: '리플', symbol: 'XRP', price: '845', change: '-1.2%', tags: ['dip', 'history', 'decoupling', 'lending', 'borrow'], icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
  { id: 'pepe', name: '페페', symbol: 'PEPE', price: '0.012', change: '-3.5%', tags: ['volatility', 'lowcap'], icon: 'https://cryptologos.cc/logos/pepe-pepe-logo.png' },
  { id: 'wld', name: '월드코인', symbol: 'WLD', price: '7,200', change: '+12.4%', tags: ['trend', 'volatility'], icon: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.png' },
  { id: 'doge', name: '도지코인', symbol: 'DOGE', price: '215', change: '+3.5%', tags: ['history', 'volatility'], icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  { id: 'sol', name: '솔라나', symbol: 'SOL', price: '210,000', change: '+5.1%', tags: ['shield', 'trend', 'lending', 'borrow'], icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: 'trx', name: '트론', symbol: 'TRX', price: '180', change: '+0.5%', tags: ['defense', 'history', 'lending', 'trend'], icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
  { id: 'etc', name: '이더리움클래식', symbol: 'ETC', price: '32,000', change: '-2.1%', tags: ['decoupling', 'history'], icon: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png' },
  { id: 'shib', name: '시바이누', symbol: 'SHIB', price: '0.035', change: '+4.5%', tags: ['lowcap', 'volatility'], icon: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png' },
];

const FILTERS = [
  { id: 'shield', label: '튼튼한 대장주', icon: Shield, desc: '시가총액이 커서 믿을 수 있어요' },
  { id: 'lowcap', label: '가벼운 소형주', icon: Zap, desc: '덩치가 작아서 오를 때 시원해요' },
  { id: 'defense', label: '방어력 갑', icon: Anchor, desc: '하락장에서도 잘 버티는 코인' },
  { id: 'decoupling', label: '청개구리', icon: GitCompare, desc: '비트코인과 다르게 움직여요' },
  { id: 'history', label: '근본 코인', icon: History, desc: '오랫동안 살아남은 증명된 코인' },
  { id: 'trend', label: '거래량 폭발', icon: Flame, desc: '지금 돈이 가장 많이 몰리고 있어요' },
  { id: 'dip', label: '과매도 줍줍', icon: TrendingDown, desc: '많이 떨어져서 반등이 기대돼요' },
  { id: 'volatility', label: '화끈한 변동성', icon: Sparkles, desc: '위아래 움직임이 커서 단타에 딱!' },
  { id: 'lending', label: '쏠쏠한 이자 수익', icon: PiggyBank, desc: '보유만 해도 따박따박 이자가 나와요' },
  { id: 'borrow', label: '떨어질 것 같아요', icon: ArrowDownCircle, desc: '코인을 빌려서 하락장에도 대비해요' },
];

export function CoinFinder() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredCoins = activeFilter 
    ? COIN_DATABASE.filter(coin => coin.tags.includes(activeFilter))
    : [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.99] group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Search className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-indigo-900">나에게 딱 맞는 코인 찾기</h3>
              <p className="text-xs text-indigo-600/80 mt-0.5">원하는 투자 스타일을 선택해보세요</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="rounded-t-[20px] h-[80vh] flex flex-col">
        <SheetHeader className="text-left mb-6 shrink-0">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            나에게 딱 맞는 코인 찾기
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            원하는 투자 스타일을 선택하면 조건에 맞는 종목을 보여드려요.
          </p>
        </SheetHeader>

        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(isActive ? null : filter.id)}
                  className={`px-2 py-1.5 rounded-xl border text-left transition-all h-14 flex flex-col justify-center ${
                    isActive 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                      : "bg-background border-border hover:border-indigo-200 hover:bg-indigo-50/30"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon className={`w-3 h-3 ${isActive ? "text-white" : "text-indigo-500"}`} />
                    <span className={`text-xs font-bold ${isActive ? "text-white" : "text-foreground"}`}>
                      {filter.label}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-tight line-clamp-1 ${isActive ? "text-indigo-100" : "text-muted-foreground"}`}>
                    {filter.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Results Area */}
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <h4 className="text-sm font-bold text-foreground/90 flex items-center justify-between shrink-0">
              추천 결과
              {activeFilter && <span className="text-xs font-normal text-muted-foreground">{filteredCoins.length}개 발견</span>}
            </h4>
            
            <ScrollArea className="flex-1 -mx-1 pr-3">
              {!activeFilter ? (
                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground text-center space-y-2 border-2 border-dashed border-muted rounded-xl bg-muted/20">
                  <Search className="w-8 h-8 opacity-20" />
                  <p className="text-xs">위에서 원하는 스타일을<br/>선택해주세요.</p>
                </div>
              ) : filteredCoins.length > 0 ? (
                <div className="space-y-2 pb-4">
                  {filteredCoins.map((coin) => (
                    <div key={coin.id} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/50 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden shadow-sm shrink-0">
                          <img src={coin.icon} alt={coin.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{coin.name}</div>
                          <div className="text-[10px] text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pl-2">
                        <div className="text-right shrink-0">
                          <div className="font-bold text-xs">{coin.price}</div>
                          <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                            {coin.change}
                          </div>
                        </div>
                        
                        {/* Buy Button for Normal Filters */}
                        {activeFilter && activeFilter !== 'lending' && activeFilter !== 'borrow' && (
                          <Button 
                            size="sm" 
                            className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight"
                          >
                            매수하러 가기
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-xs">
                  조건에 맞는 코인이 없어요 😢
                </div>
              )}
            </ScrollArea>
            
            {/* Fixed Action Button for Specific Filters */}
            <div className="pt-2 shrink-0">
                  {activeFilter === 'borrow' && (
                    <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-between px-5 animate-in fade-in slide-in-from-bottom-2">
                      <span>하락장 대비하러 가기</span>
                      <span className="text-xs opacity-80 font-normal">코인 대여 바로가기 <ArrowRight className="w-3.5 h-3.5 inline ml-1" /></span>
                    </Button>
                  )}
                  
                  {activeFilter === 'lending' && (
                    <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-between px-5 animate-in fade-in slide-in-from-bottom-2">
                      <span>이자 받으러 가기</span>
                      <span className="text-xs opacity-80 font-normal">스테이킹/예치 바로가기 <ArrowRight className="w-3.5 h-3.5 inline ml-1" /></span>
                    </Button>
                  )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
