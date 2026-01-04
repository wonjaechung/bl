"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { BookOpen, PenTool, Check, X, ArrowRight, Plus, Quote, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { indicatorData, IndicatorId } from './market-indicators-carousel';

// --- Types ---
export type TradeType = 'buy' | 'sell';

export type TradeLog = {
    id: number;
    date: string; // ISO Date String 'YYYY-MM-DD'
    time: string; // 'HH:mm'
    ticker: string;
    type: TradeType;
    price: number;
    amount: number;
    total: number;
    orderType: 'market' | 'limit'; // New field for Order Type
    pnl?: number; // Realized PnL for sell trades
    pnlPercent?: number;
    snapshot: {
        rsi: number;
        dominance: number;
        kimchiPremium: number;
    }
};

export type JournalEntry = {
    id: number;
    date: string;
    content: string;
    tags: string[];
    trades: TradeLog[];
    moodScore?: number;
    moodEmoji?: string;
};

// --- Mock Data ---
export const mockRawTrades: TradeLog[] = [
    { id: 101, date: format(new Date(), 'yyyy-MM-dd'), time: '14:00:05', ticker: 'BTC', type: 'buy', price: 92000000, amount: 0.05, total: 4600000, orderType: 'market', snapshot: { rsi: 35, dominance: 52.1, kimchiPremium: 3.2 } },
    { id: 102, date: format(new Date(), 'yyyy-MM-dd'), time: '14:00:12', ticker: 'BTC', type: 'buy', price: 92050000, amount: 0.05, total: 4602500, orderType: 'limit', snapshot: { rsi: 35, dominance: 52.1, kimchiPremium: 3.2 } },
    { id: 103, date: format(new Date(), 'yyyy-MM-dd'), time: '14:05:00', ticker: 'XRP', type: 'sell', price: 800, amount: 1000, total: 800000, orderType: 'market', pnl: 50000, pnlPercent: 6.25, snapshot: { rsi: 65, dominance: 52.0, kimchiPremium: 3.1 } },
    { id: 104, date: format(new Date(), 'yyyy-MM-dd'), time: '15:30:00', ticker: 'ETH', type: 'buy', price: 3500000, amount: 1, total: 3500000, orderType: 'limit', snapshot: { rsi: 45, dominance: 51.9, kimchiPremium: 3.0 } },
    { id: 105, date: format(new Date(), 'yyyy-MM-dd'), time: '15:31:00', ticker: 'ETH', type: 'buy', price: 3490000, amount: 1, total: 3490000, orderType: 'limit', snapshot: { rsi: 44, dominance: 51.9, kimchiPremium: 3.0 } },
    // Mixed Case: BTC Sell
    { id: 106, date: format(new Date(), 'yyyy-MM-dd'), time: '16:00:00', ticker: 'BTC', type: 'sell', price: 93500000, amount: 0.05, total: 4675000, orderType: 'market', pnl: 75000, pnlPercent: 1.63, snapshot: { rsi: 60, dominance: 52.2, kimchiPremium: 3.3 } },
];

const MOCK_CURRENT_PRICES: Record<string, number> = {
    'BTC': 92500000,
    'ETH': 3520000,
    'XRP': 815,
    'SOL': 245000
};

// --- Components ---
const TradePerformanceCard = ({ tradeGroup }: { tradeGroup: { ticker: string, trades: TradeLog[] } }) => {
    const { ticker, trades } = tradeGroup;
    
    // Calculate metrics
    const buyTrades = trades.filter(t => t.type === 'buy');
    const sellTrades = trades.filter(t => t.type === 'sell');
    
    const totalBuyAmount = buyTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalBuyValue = buyTrades.reduce((sum, t) => sum + t.total, 0);
    
    const totalSellAmount = sellTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalSellValue = sellTrades.reduce((sum, t) => sum + t.total, 0);

    // Calculate Averages
    const avgBuyPrice = totalBuyAmount > 0 ? Math.round(totalBuyValue / totalBuyAmount) : 0;
    const avgSellPrice = totalSellAmount > 0 ? Math.round(totalSellValue / totalSellAmount) : 0;

    // Determine Net Flow
    const isNetBuy = totalBuyAmount >= totalSellAmount;
    
    // Legacy 'myAvgPrice' for the visual bar (Visual Bar uses this to show position)
    const myAvgPrice = isNetBuy ? avgBuyPrice : avgSellPrice;

    // Realized PnL & ROI
    const realizedPnL = sellTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const isRealizedProfit = realizedPnL >= 0;
    
    // Calculate Realized ROI
    const totalSellCost = totalSellValue - realizedPnL;
    const realizedRoi = totalSellCost > 0 ? (realizedPnL / totalSellCost) * 100 : 0;
    
    // Mock Market Data (24H Average simulation)
    const marketAvg = useMemo(() => {
        if (MOCK_CURRENT_PRICES[ticker]) return Math.round(MOCK_CURRENT_PRICES[ticker] * 0.998); 
        return myAvgPrice > 0 ? Math.round(myAvgPrice * (1 + (Math.random() * 0.04 - 0.02))) : 0;
    }, [myAvgPrice, ticker]);

    const currentPrice = useMemo(() => {
        if (MOCK_CURRENT_PRICES[ticker]) return MOCK_CURRENT_PRICES[ticker];
        return marketAvg > 0 ? Math.round(marketAvg * (1 + (Math.random() * 0.03 - 0.015))) : 0;
    }, [marketAvg, ticker]);

const MOCK_CURRENT_PRICES: Record<string, number> = {
    'BTC': 92500000,
    'ETH': 3520000,
    'XRP': 815,
    'SOL': 245000
};

    const dayLow = useMemo(() => marketAvg > 0 ? Math.round(marketAvg * 0.95) : 0, [marketAvg]);
    const dayHigh = useMemo(() => marketAvg > 0 ? Math.round(marketAvg * 1.05) : 0, [marketAvg]);

    if (myAvgPrice === 0) return null;

    // Calculate position for visual bar
    const buyPricePercentDiff = ((avgBuyPrice - currentPrice) / currentPrice) * 100;
    const sellPricePercentDiff = ((avgSellPrice - currentPrice) / currentPrice) * 100;
    
    return (
        <div className="mb-4 last:mb-0 bg-background rounded-xl border border-border overflow-hidden shadow-sm">
            {/* 1. Header: Ticker & Main Result */}
            <div className="bg-muted/30 p-4 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-black text-lg">{ticker}</span>
                    <Badge variant="outline" className={`text-[10px] h-5 ${isNetBuy ? 'text-red-500 bg-red-500/5 border-red-500/20' : 'text-blue-500 bg-blue-500/5 border-blue-500/20'}`}>
                        {isNetBuy ? '순매수' : '순매도'}
                    </Badge>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-muted-foreground mb-0.5">실현 손익</div>
                    <div className={`font-bold text-lg leading-none ${isRealizedProfit ? 'text-red-500' : 'text-blue-500'}`}>
                        {isRealizedProfit ? '+' : ''}{realizedPnL.toLocaleString()}
                        <span className="text-xs font-medium ml-1 opacity-80">({realizedRoi.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>

            {/* 2. Buy vs Sell Detail Grid */}
            <div className="grid grid-cols-2 divide-x divide-border/50">
                {/* Buy Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-xs font-bold text-muted-foreground">매수 (Buy)</span>
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground">매수 평단</div>
                        <div className="font-mono font-medium">{avgBuyPrice > 0 ? avgBuyPrice.toLocaleString() : '-'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground">총 매수액</div>
                        <div className="font-mono text-sm">{totalBuyValue.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground/70 font-mono">{totalBuyAmount > 0 ? totalBuyAmount : '-'} {ticker}</div>
                    </div>
                </div>

                {/* Sell Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-xs font-bold text-muted-foreground">매도 (Sell)</span>
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground">매도 평단</div>
                        <div className="font-mono font-medium">{avgSellPrice > 0 ? avgSellPrice.toLocaleString() : '-'}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-muted-foreground">총 매도액</div>
                        <div className="font-mono text-sm">{totalSellValue.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground/70 font-mono">{totalSellAmount > 0 ? totalSellAmount : '-'} {ticker}</div>
                    </div>
                </div>
            </div>

            {/* 3. Visual Bar (Market Context) - Compact Style */}
            <div className="bg-muted/10 p-3 border-t border-border/50">
                <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-visible mt-1">
                    
                    {/* Center Reference Line */}
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-3 bg-border z-10" />

                    {/* My Buy Price Marker (Red Line) */}
                    {totalBuyAmount > 0 && (
                        <div 
                            className="absolute top-1/2 z-30 transition-all duration-300 ease-out"
                            style={{ 
                                left: `${Math.min(Math.max(50 + (buyPricePercentDiff * 10), 0), 100)}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                             <div className="w-1 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] cursor-help" title="매수 평단" />
                        </div>
                    )}

                    {/* My Sell Price Marker (Blue Line) */}
                    {totalSellAmount > 0 && (
                        <div 
                            className="absolute top-1/2 z-30 transition-all duration-300 ease-out"
                            style={{ 
                                left: `${Math.min(Math.max(50 + (sellPricePercentDiff * 10), 0), 100)}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                             <div className="w-1 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] cursor-help" title="매도 평단" />
                        </div>
                    )}
                </div>
                 <div className="flex justify-between mt-2 text-[9px] text-muted-foreground/60 font-mono">
                    <span>{dayLow.toLocaleString()} (저)</span>
                    <span>{dayHigh.toLocaleString()} (고)</span>
                </div>
            </div>
        </div>
    );
};

const TradeFlowChart = ({ trades }: { trades: TradeLog[] }) => {
    const [expandedTicker, setExpandedTicker] = useState<string | null>(null);
    const tickers = Array.from(new Set(trades.map(t => t.ticker)));
    
    return (
        <div className="my-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {tickers.map(ticker => {
                    const isSelected = expandedTicker === ticker;
                    return (
                        <Badge 
                            key={ticker} 
                            variant={isSelected ? "secondary" : "outline"}
                            className={`cursor-pointer text-xs px-2 py-1 transition-all ${isSelected ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-muted'}`}
                            onClick={() => setExpandedTicker(isSelected ? null : ticker)}
                        >
                            #{ticker}
                        </Badge>
                    )
                })}
            </div>
            
            {expandedTicker && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <TradePerformanceCard 
                        tradeGroup={{ 
                            ticker: expandedTicker, 
                            trades: trades.filter(t => t.ticker === expandedTicker) 
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

interface InvestmentJournalProps {
    selectedDate: Date;
}

export default function InvestmentJournal({ selectedDate }: InvestmentJournalProps) {
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [journalContent, setJournalContent] = useState('');
    const [diaryStep, setDiaryStep] = useState<'select' | 'write'>('select');
    const [selectedTicker, setSelectedTicker] = useState<string>('all');
    const [moodScore, setMoodScore] = useState([50]); // 0-100
    const [moodEmoji, setMoodEmoji] = useState<string>('');
    const [mistakeTags, setMistakeTags] = useState<string[]>([]);
    const [activeRightIndicators, setActiveRightIndicators] = useState<IndicatorId[]>(['kimchi', 'volume', 'fear', 'drop']);
    const [isIndicatorDialogOpen, setIsIndicatorDialogOpen] = useState(false);

    // Update journal content when date changes
    useMemo(() => {
        const entry = journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'));
        // Don't reset content here to allow persistent draft or just view mode
    }, [selectedDate, journalEntries]);

    const currentEntry = useMemo(() => 
        journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd')), 
        [journalEntries, selectedDate]
    );

    const handleSaveJournal = () => {
        // Get trades for the selected ticker (or all)
        const currentTrades = selectedTicker === 'all' 
            ? mockRawTrades 
            : mockRawTrades.filter(t => t.ticker === selectedTicker);

        const newEntry: JournalEntry = {
            id: Date.now(),
            date: format(selectedDate, 'yyyy-MM-dd'),
            content: journalContent,
            tags: mistakeTags,
            trades: currentTrades,
            moodScore: moodScore[0],
            moodEmoji: moodEmoji
        };

        setJournalEntries(prev => {
            // Remove existing entry for same date if any (overwrite)
            const filtered = prev.filter(e => e.date !== newEntry.date);
            return [...filtered, newEntry];
        });

        // Reset state
        setDiaryStep('select');
        setSelectedTicker('all');
        setMoodEmoji('');
        setMistakeTags([]);
        setJournalContent('');
    };

    // Helper to calculate recap data
    const recapData = useMemo(() => {
        const trades = selectedTicker === 'all' 
            ? mockRawTrades 
            : mockRawTrades.filter(t => t.ticker === selectedTicker);
            
        const buyTrades = trades.filter(t => t.type === 'buy');
        const sellTrades = trades.filter(t => t.type === 'sell');

        const buyTotal = buyTrades.reduce((sum, t) => sum + t.total, 0);
        const sellTotal = sellTrades.reduce((sum, t) => sum + t.total, 0);
        
        const buyAmount = buyTrades.reduce((sum, t) => sum + t.amount, 0);
        const sellAmount = sellTrades.reduce((sum, t) => sum + t.amount, 0);

        const avgBuyPrice = buyAmount > 0 ? Math.round(buyTotal / buyAmount) : 0;
        const avgSellPrice = sellAmount > 0 ? Math.round(sellTotal / sellAmount) : 0;

        const net = buyTotal - sellTotal; // Net Accumulation (Buy - Sell)
        
        // Calculate Market vs Limit Order Ratio for Buy
        const buyMarketOrders = buyTrades.filter(t => t.orderType === 'market').length;
        const buyTotalCount = buyTrades.length;
        const buyMarketRatio = buyTotalCount > 0 ? Math.round((buyMarketOrders / buyTotalCount) * 100) : 0;
        const buyLimitRatio = buyTotalCount > 0 ? 100 - buyMarketRatio : 0;

        // Calculate Market vs Limit Order Ratio for Sell
        const sellMarketOrders = sellTrades.filter(t => t.orderType === 'market').length;
        const sellTotalCount = sellTrades.length;
        const sellMarketRatio = sellTotalCount > 0 ? Math.round((sellMarketOrders / sellTotalCount) * 100) : 0;
        const sellLimitRatio = sellTotalCount > 0 ? 100 - sellMarketRatio : 0;
        
        // Simple PnL estimation
        const pnl = trades.filter(t => t.pnl).reduce((sum, t) => sum + (t.pnl || 0), 0);
        
        return { buyTotal, sellTotal, net, pnl, avgBuyPrice, avgSellPrice, count: trades.length, buyMarketRatio, buyLimitRatio, sellMarketRatio, sellLimitRatio };
    }, [selectedTicker]);

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between sticky top-0 bg-background py-2 z-10">
                <h3 className="text-base font-bold flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full" />
                    투자 일지
                </h3>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-2 text-xs h-7 px-2">
                            <PenTool className="w-3 h-3" />
                            일지 작성
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>투자 일지 ({format(selectedDate, 'MM.dd')})</SheetTitle>
                            <SheetDescription>
                                {diaryStep === 'select' ? '오늘의 매매 성과를 확인하고 일지를 작성해보세요.' : '오늘의 매매를 복기해보세요.'}
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className="py-6">
                            {diaryStep === 'select' ? (
                                <div className="space-y-6">
                                    <div className="rounded-xl border bg-card p-6 shadow-sm mb-4">
                                        <div className="text-center mb-6">
                                            <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">순매수 (Net)</div>
                                            <div className={`text-3xl font-bold ${recapData.net > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                {recapData.net > 0 ? '+' : ''}{recapData.net.toLocaleString()}원
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-8 relative">
                                            {/* Vertical Divider */}
                                            <div className="absolute left-1/2 top-2 bottom-2 w-px bg-border -translate-x-1/2" />
                                            
                                            <div className="text-center">
                                                <div className="text-xs text-muted-foreground mb-1">총 매수</div>
                                                <div className="font-semibold text-lg text-red-500 mb-1">{recapData.buyTotal.toLocaleString()}</div>
                                                
                                                {/* Buy Order Type Ratio Bar */}
                                                <div className="mt-2 px-2">
                                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                        <span>시장가 {recapData.buyMarketRatio}%</span>
                                                        <span>지정가 {recapData.buyLimitRatio}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                                                        <div className="h-full bg-orange-400" style={{ width: `${recapData.buyMarketRatio}%` }} />
                                                        <div className="h-full bg-blue-400" style={{ width: `${recapData.buyLimitRatio}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-muted-foreground mb-1">총 매도</div>
                                                <div className="font-semibold text-lg text-blue-500 mb-1">{recapData.sellTotal.toLocaleString()}</div>
                                                
                                                {/* Sell Order Type Ratio Bar */}
                                                <div className="mt-2 px-2">
                                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                        <span>시장가 {recapData.sellMarketRatio}%</span>
                                                        <span>지정가 {recapData.sellLimitRatio}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
                                                        <div className="h-full bg-orange-400" style={{ width: `${recapData.sellMarketRatio}%` }} />
                                                        <div className="h-full bg-blue-400" style={{ width: `${recapData.sellLimitRatio}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Market Snapshot */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                                        {['dominance', 'kimchi', 'volume', 'fear', 'drop'].map(id => (
                                            <div key={id} className="bg-muted/30 p-2 rounded-lg flex flex-col items-center justify-center border border-border/50 text-center">
                                                <span className="text-[10px] text-muted-foreground mb-1">{indicatorData[id as IndicatorId].title}</span>
                                                <span className={`text-base font-bold ${id === 'kimchi' ? 'text-red-500' : ''}`}>
                                                    {indicatorData[id as IndicatorId].value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button className="w-full h-12 text-lg" onClick={() => setDiaryStep('write')}>
                                        일지 작성하기 <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    {/* 1. Mood Check */}
                                    <div className="space-y-3">
                                        <Label className="text-base">오늘의 매매 기분은?</Label>
                                        <ToggleGroup type="single" value={moodEmoji} onValueChange={setMoodEmoji} className="justify-between">
                                            <ToggleGroupItem value="best" className="h-12 w-12 text-2xl" aria-label="최고">🤑</ToggleGroupItem>
                                            <ToggleGroupItem value="good" className="h-12 w-12 text-2xl" aria-label="좋음">😌</ToggleGroupItem>
                                            <ToggleGroupItem value="soso" className="h-12 w-12 text-2xl" aria-label="그저그럼">😐</ToggleGroupItem>
                                            <ToggleGroupItem value="bad" className="h-12 w-12 text-2xl" aria-label="나쁨">😰</ToggleGroupItem>
                                            <ToggleGroupItem value="angry" className="h-12 w-12 text-2xl" aria-label="화남">😡</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>

                                    {/* 2. Score Slider */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <Label className="text-base">나의 매매 점수</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    수익보다 원칙 준수가 중요해요.<br/>
                                                    스스로 평가하는 오늘의 점수는?
                                                </p>
                                            </div>
                                            <span className="text-2xl font-bold text-primary">{moodScore[0]}<span className="text-sm font-normal text-muted-foreground ml-1">점</span></span>
                                        </div>
                                        <Slider 
                                            value={moodScore} 
                                            onValueChange={setMoodScore} 
                                            max={100} 
                                            step={5} 
                                            className="py-2"
                                        />
                                    </div>

                                    {/* 3. Reasons Tags */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-base text-muted-foreground">기술적 근거</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {['RSI 과매수', 'RSI 과매도', '거래량 폭발', '골든크로스', '데드크로스', '고베타 진입'].map(tag => (
                                                    <Badge 
                                                        key={tag}
                                                        variant={mistakeTags.includes(tag) ? 'default' : 'outline'}
                                                        className="cursor-pointer text-xs py-1.5 px-3 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
                                                        onClick={() => {
                                                            setMistakeTags(prev => 
                                                                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                                            )
                                                        }}
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-base text-muted-foreground">매매 심리/원인</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {['뇌동매매', '물타기', '손절', '익절', 'FOMO', '기도매매', '원칙준수', '데이터', '뉴스', '이벤트', '저점매수', '고점매도'].map(tag => {
                                                    const isPositive = ['익절', '원칙준수', '데이터', '뉴스', '이벤트', '저점매수', '고점매도'].includes(tag);
                                                    return (
                                                        <Badge 
                                                            key={tag}
                                                            variant={mistakeTags.includes(tag) ? 'outline' : 'outline'}
                                                            className={`cursor-pointer text-xs py-1.5 px-3 transition-all ${
                                                                mistakeTags.includes(tag)
                                                                    ? isPositive 
                                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500' 
                                                                        : 'bg-red-500/10 text-red-500 border-red-500'
                                                                    : 'hover:bg-muted'
                                                            }`}
                                                            onClick={() => {
                                                                setMistakeTags(prev => 
                                                                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                                                )
                                                            }}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Text Memo */}
                                    <div className="space-y-3">
                                        <Label className="text-base">매매 메모</Label>
                                        <Textarea 
                                            placeholder="오늘 매매에서 배운 점이나 내일의 전략을 적어보세요."
                                            className="h-32 resize-none text-base"
                                            value={journalContent}
                                            onChange={(e) => setJournalContent(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4">
                                        <Button variant="outline" className="flex-1" onClick={() => setDiaryStep('select')}>
                                            이전
                                        </Button>
                                        <SheetClose asChild>
                                            <Button className="flex-[2]" onClick={handleSaveJournal}>
                                                저장 완료
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            )}
                        </div>
                        <SheetFooter>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            
            {/* Journal Entry Display */}
            {currentEntry ? (
                <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                    {/* Header with Mood Gradient */}
                    <div className={cn(
                        "relative p-6 overflow-hidden",
                        currentEntry.moodEmoji === 'best' || currentEntry.moodEmoji === 'good' 
                            ? "bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-background"
                            : currentEntry.moodEmoji === 'bad' || currentEntry.moodEmoji === 'angry'
                            ? "bg-gradient-to-br from-rose-500/10 via-red-500/5 to-background"
                            : "bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-background"
                    )}>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex gap-4 items-center">
                                <div className="text-4xl animate-in zoom-in duration-300 origin-bottom-left hover:scale-110 transition-transform cursor-default">
                                    {{
                                        'best': '🤑',
                                        'good': '😌',
                                        'soso': '😐',
                                        'bad': '😰',
                                        'angry': '🤬'
                                    }[currentEntry.moodEmoji || ''] || '🤔'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-lg leading-none">
                                            {{
                                                'best': '최고의 하루!',
                                                'good': '좋은 흐름이에요',
                                                'soso': '무난한 하루',
                                                'bad': '아쉬운 결과',
                                                'angry': '멘탈 관리 필요'
                                            }[currentEntry.moodEmoji || ''] || '기록 없음'}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {format(selectedDate, 'yyyy.MM.dd')}
                                    </p>
                                </div>
                            </div>

                            {currentEntry.moodScore !== undefined && (
                                <div className="flex flex-col items-end">
                                    <div className="text-3xl font-black text-foreground tracking-tight">
                                        {currentEntry.moodScore}
                                        <span className="text-sm font-medium text-muted-foreground ml-1">점</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Trading Score</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 pt-2">
                        {/* Market Snapshot Strip */}
                        <div className="-mt-6 mb-6 mx-0 bg-background/50 backdrop-blur-sm border-b border-border/50 p-3 flex gap-4 overflow-x-auto no-scrollbar mask-linear-fade">
                             <div className="flex items-center gap-3 min-w-max px-2">
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] text-muted-foreground mb-0.5">BTC 도미넌스</span>
                                    <span className="font-bold text-sm">52.1%</span>
                                </div>
                                <div className="w-px h-6 bg-border/50" />
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] text-muted-foreground mb-0.5">김치프리미엄</span>
                                    <span className="font-bold text-sm text-red-500">1.38%</span>
                                </div>
                                <div className="w-px h-6 bg-border/50" />
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] text-muted-foreground mb-0.5">공포/탐욕</span>
                                    <span className="font-bold text-sm">41</span>
                                </div>
                             </div>
                        </div>

                        {/* Memo Section - Notebook Style */}
                        {currentEntry.content && (
                            <div className="mb-6 relative group">
                                <div className="absolute top-0 left-0 -translate-x-1 -translate-y-2 opacity-10">
                                    <Quote className="w-8 h-8 rotate-180" />
                                </div>
                                <div className="bg-secondary/20 rounded-xl p-5 border border-border/30 relative">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                                        {currentEntry.content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags Cloud */}
                        {currentEntry.tags && currentEntry.tags.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {currentEntry.tags.map(tag => {
                                        // Auto-color based on keyword (simple heuristic)
                                        const isNegative = ['뇌동매매', '물타기', '손절', 'FOMO', '기도매매', 'RSI 과매수', '고점매도'].some(k => tag.includes(k));
                                        const isPositive = ['익절', '원칙준수', '데이터', '저점매수', '골든크로스'].some(k => tag.includes(k));
                                        
                                        return (
                                            <Badge 
                                                key={tag} 
                                                variant="outline" 
                                                className={cn(
                                                    "px-3 py-1 text-xs border bg-background/50",
                                                    isNegative ? "border-red-200 text-red-600 bg-red-50 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400" :
                                                    isPositive ? "border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400" :
                                                    "border-muted-foreground/20 text-muted-foreground"
                                                )}
                                            >
                                                #{tag}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Trade Performance */}
                        {currentEntry.trades && currentEntry.trades.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded bg-primary/10">
                                        <TrendingUp className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">매매 복기</span>
                                </div>
                                <TradeFlowChart trades={currentEntry.trades} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-background/50 text-center transition-colors hover:bg-muted/10 group cursor-pointer" onClick={() => setDiaryStep('write')}>
                    <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <PenTool className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">작성된 일지가 없어요</h3>
                    <p className="text-xs text-muted-foreground mb-4 max-w-[200px] break-keep">
                        오늘의 매매를 복기하고 더 나은 내일을 준비해보세요.
                    </p>
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-background">
                        일지 작성하기
                    </Button>
                </div>
            )}
        </div>
    );
}

