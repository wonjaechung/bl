"use client";

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { BookOpen, PenTool, Check, X, ArrowRight, Plus, Quote, Calendar, TrendingUp, TrendingDown, List } from 'lucide-react';
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export type TradeReview = {
    tradeId: number;
    moodEmoji: string;
    moodScore: number;
    tags: string[];
    content: string;
    date: string;
};

export type JournalEntry = {
    id: number;
    date: string;
    content: string;
    tags: string[];
    trades: TradeLog[];
    moodScore?: number;
    moodEmoji?: string;
    reviews?: Record<number, TradeReview>; // Added reviews map
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

export const MOCK_CURRENT_PRICES: Record<string, number> = {
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
    const [diaryStep, setDiaryStep] = useState<'dashboard' | 'trades' | 'write'>('dashboard');
    const [selectedTicker, setSelectedTicker] = useState<string>('all');
    const [selectedTradeId, setSelectedTradeId] = useState<number | null>(null);
    const [moodScore, setMoodScore] = useState([50]); // 0-100
    const [moodEmoji, setMoodEmoji] = useState<string>('');
    const [mistakeTags, setMistakeTags] = useState<string[]>([]);
    const [activeRightIndicators, setActiveRightIndicators] = useState<IndicatorId[]>(['kimchi', 'volume', 'fear', 'drop']);
    const [isIndicatorDialogOpen, setIsIndicatorDialogOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'ticker' | 'timeline'>('ticker');

    // Update journal content when date changes
    useMemo(() => {
        const entry = journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'));
        // Don't reset content here to allow persistent draft or just view mode
    }, [selectedDate, journalEntries]);

    const currentEntry = useMemo(() => 
        journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd')), 
        [journalEntries, selectedDate]
    );

    // Get current reviews from entry or empty
    const currentReviews = useMemo(() => currentEntry?.reviews || {}, [currentEntry]);

    const handleOpenReview = (tradeId: number) => {
        setSelectedTradeId(tradeId);
        // Pre-fill if exists
        const review = currentReviews[tradeId];
        if (review) {
            setMoodEmoji(review.moodEmoji);
            setMoodScore([review.moodScore]);
            setMistakeTags(review.tags);
            setJournalContent(review.content);
        } else {
            setMoodEmoji('');
            setMoodScore([50]);
            setMistakeTags([]);
            setJournalContent('');
        }
        setDiaryStep('write');
        setIsSheetOpen(true);
    };

    const handleSaveJournal = () => {
        // Get trades for the selected ticker (or all)
        const currentTrades = selectedTicker === 'all' 
            ? mockRawTrades 
            : mockRawTrades.filter(t => t.ticker === selectedTicker);

        // If we are reviewing a specific trade
        let newReviews = { ...currentReviews };
        if (selectedTradeId) {
             newReviews[selectedTradeId] = {
                tradeId: selectedTradeId,
                moodEmoji,
                moodScore: moodScore[0],
                tags: mistakeTags,
                content: journalContent,
                date: format(selectedDate, 'yyyy-MM-dd')
            };
        }

        
        // Calculate Derived Mood if global mood is empty but we have reviews
        let derivedMoodEmoji = moodEmoji;
        let derivedMoodScore = moodScore[0];
        
        if (!selectedTradeId && !moodEmoji) {
            // If we are saving a non-trade specific update (or just flushing reviews), check if we can derive from reviews
            const reviewValues = Object.values(newReviews);
            if (reviewValues.length > 0) {
                 // Simple logic: Use the latest review's mood or average
                 // For now, let's just pick the last one or keep it empty if user didn't set global
                 // Actually, user requirement is "Synced". So let's average the score and pick the most frequent emoji?
                 // Or just leave it as is, but display logic handles it.
            }
        }

        const newEntry: JournalEntry = {
            id: currentEntry?.id || Date.now(),
            date: format(selectedDate, 'yyyy-MM-dd'),
            content: selectedTradeId ? (currentEntry?.content || '') : journalContent, // Preserve main content if reviewing trade
            tags: selectedTradeId ? (currentEntry?.tags || []) : mistakeTags,
            trades: currentTrades,
            moodScore: selectedTradeId ? (currentEntry?.moodScore) : moodScore[0],
            moodEmoji: selectedTradeId ? (currentEntry?.moodEmoji) : moodEmoji,
            reviews: newReviews
        };

        setJournalEntries(prev => {
            // Remove existing entry for same date if any (overwrite)
            const filtered = prev.filter(e => e.date !== newEntry.date);
            return [...filtered, newEntry];
        });

        // Reset state
        if (selectedTradeId) {
             setDiaryStep('trades'); // Go back to trades list
             setSelectedTradeId(null);
        } else {
             setDiaryStep('dashboard');
        }
        
        // Only reset form fields if we are done or switching context (handled by useEffect/logic elsewhere usually, but here manual)
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
        
        // Calculate Average Score from Reviews
        const reviewsList = Object.values(currentReviews).filter(r => trades.some(t => t.id === r.tradeId));
        const totalScore = reviewsList.reduce((sum, r) => sum + r.moodScore, 0);
        const avgScore = reviewsList.length > 0 ? Math.round(totalScore / reviewsList.length) : 0;

        // Calculate Volume (Total Buy + Sell Value)
        const totalVolume = buyTotal + sellTotal;
        // Mock Average Daily Volume (e.g., set it to roughly 80% of today's volume or a fixed reasonable amount for demo)
        const avgDailyVolume = 8000000; // 8M KRW arbitrary mock
        
        return { buyTotal, sellTotal, net, pnl, avgBuyPrice, avgSellPrice, count: trades.length, buyMarketRatio, buyLimitRatio, sellMarketRatio, sellLimitRatio, avgScore, totalVolume, avgDailyVolume };
    }, [selectedTicker, currentReviews]);

    const journalStats = useMemo(() => {
         const trades = selectedTicker === 'all' 
            ? mockRawTrades 
            : mockRawTrades.filter(t => t.ticker === selectedTicker);
         const totalTrades = trades.length;
         const reviewedCount = Object.keys(currentReviews).filter(id => trades.find(t => t.id === Number(id))).length;
         return { totalTrades, reviewedCount };
    }, [selectedTicker, currentReviews]);

    // Group trades by ticker for 'ticker' view mode
    const tradesByTicker = useMemo(() => {
        const groups: Record<string, TradeLog[]> = {};
        mockRawTrades.forEach(trade => {
            if (!groups[trade.ticker]) groups[trade.ticker] = [];
            groups[trade.ticker].push(trade);
        });
        
        // Sort each group: Unreviewed Sell trades first, then others
        Object.keys(groups).forEach(ticker => {
             groups[ticker].sort((a, b) => {
                 // Priority 1: Unreviewed Sell (Needs Review)
                 const aNeedsReview = a.type === 'sell' && !currentReviews[a.id];
                 const bNeedsReview = b.type === 'sell' && !currentReviews[b.id];
                 if (aNeedsReview && !bNeedsReview) return -1;
                 if (!aNeedsReview && bNeedsReview) return 1;
                 
                 // Priority 2: Time (Newest first)
                 return b.time.localeCompare(a.time);
             });
        });

        return groups;
    }, [currentReviews]);

    const renderTradeItem = (trade: TradeLog) => (
        <div 
            key={trade.id} 
            className={cn(
                "group relative overflow-hidden rounded-xl border p-3 transition-all hover:shadow-md",
                currentReviews[trade.id] 
                    ? "bg-muted/20 border-border/50" 
                    : "bg-card border-border hover:border-primary/50"
            )}
        >
            {/* Status Bar */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                trade.type === 'buy' ? "bg-red-500" : "bg-blue-500"
            )} />

            <div className="pl-2 pr-0.5">
                {/* 1. Header: Ticker & Total/PnL */}
                <div className="flex justify-between items-center mb-1.5">
                    <span className="font-black text-lg tracking-tight leading-none">{trade.ticker}</span>
                    <div className="text-right leading-none">
                        {trade.pnl ? (
                            <div className={cn(
                                "font-bold font-mono text-sm",
                                trade.pnl > 0 ? "text-red-500" : "text-blue-500"
                            )}>
                                {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString()}
                                <span className="text-[10px] ml-0.5 font-normal opacity-70 text-muted-foreground">KRW</span>
                            </div>
                        ) : (
                            <div className="font-bold font-mono text-sm text-foreground">
                                {trade.total.toLocaleString()}
                                <span className="text-[10px] ml-0.5 font-normal opacity-70 text-muted-foreground">KRW</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Info Row: Badges & Unit Price */}
                <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "text-[10px] px-1.5 py-0 h-4.5 font-bold border-0",
                                trade.type === 'buy' 
                                    ? "text-red-600 bg-red-100 dark:bg-red-500/10" 
                                    : "text-blue-600 bg-blue-100 dark:bg-blue-500/10"
                            )}
                        >
                            {trade.type === 'buy' ? '매수' : '매도'}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground bg-muted px-1.5 rounded-[3px] h-4.5 flex items-center whitespace-nowrap">
                            {trade.orderType === 'limit' ? '지정가' : '시장가'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-foreground/90">{trade.price.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">KRW</span>
                    </div>
                </div>

                {/* 3. Detail Row: Time & Amount */}
                <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 opacity-80">
                    <span>{trade.time}</span>
                    <span className="w-px h-2 bg-border"></span>
                    <span>{trade.amount} {trade.ticker}</span>
                </div>

                {/* 4. Action Button */}
                <div className="mt-2.5 flex justify-end">
                    <Button 
                        size="sm" 
                        variant={currentReviews[trade.id] ? "ghost" : "default"} 
                        className={cn(
                            "h-7 text-xs px-3 rounded-lg transition-all w-full sm:w-auto",
                            currentReviews[trade.id] 
                                ? "text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted" 
                                : "font-bold shadow-sm hover:shadow-primary/25"
                        )}
                        onClick={() => handleOpenReview(trade.id)}
                    >
                        {currentReviews[trade.id] ? (
                            <>
                                <Check className="w-3 h-3 mr-1" /> 복기 완료
                            </>
                        ) : (
                            <>
                                <PenTool className="w-3 h-3 mr-1" /> 복기하기
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between sticky top-0 bg-background py-2 z-10">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    투자 일지
                </h3>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" variant="outline" className="gap-2 text-xs h-7 px-2">
                            <PenTool className="w-3 h-3" />
                            일지 작성
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>투자 일지 ({format(selectedDate, 'MM.dd')})</SheetTitle>
                            <SheetDescription className="hidden">
                                {diaryStep === 'select' ? '오늘의 매매 성과를 확인하고 일지를 작성해보세요.' : '오늘의 매매를 복기해보세요.'}
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className="py-6">
                            {diaryStep === 'dashboard' ? (
                                <div className="space-y-6 pt-4">
                                    {/* 2. Review Progress & Action */}
                                    <div className="space-y-4 px-1">
                                        <div className="flex items-end justify-between px-2">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                매매 복기
                                                {journalStats.reviewedCount === journalStats.totalTrades && (
                                                    <Badge className="bg-green-500 hover:bg-green-600 border-none text-white px-1.5 py-0 h-5">Done</Badge>
                                                )}
                                            </h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-primary">{journalStats.reviewedCount}</span>
                                                <span className="text-lg font-semibold text-muted-foreground/40">/{journalStats.totalTrades}</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${journalStats.totalTrades > 0 ? (journalStats.reviewedCount / journalStats.totalTrades) * 100 : 0}%` }} 
                                            />
                                        </div>

                                        {/* Main CTA */}
                                        <Button 
                                            size="lg" 
                                            className={cn(
                                                "w-full h-16 text-lg font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-1",
                                                journalStats.totalTrades - journalStats.reviewedCount > 0
                                                    ? "bg-primary hover:bg-primary/90 shadow-primary/25" 
                                                    : "bg-green-500 hover:bg-green-600 shadow-green-500/25"
                                            )}
                                            onClick={() => setDiaryStep('trades')}
                                        >
                                            <div className="flex flex-col items-center leading-none gap-1">
                                                <span className="flex items-center gap-2">
                                                    {journalStats.totalTrades - journalStats.reviewedCount > 0 
                                                        ? '매매 복기 시작하기' 
                                                        : '매매 내역 다시보기'} 
                                                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                                                </span>
                                                {journalStats.totalTrades - journalStats.reviewedCount > 0 && (
                                                    <span className="text-[10px] opacity-80 font-normal">
                                                        남은 매매 {journalStats.totalTrades - journalStats.reviewedCount}건
                                                    </span>
                                                )}
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            ) : diaryStep === 'trades' ? (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => setDiaryStep('dashboard')}>
                                                <ArrowRight className="w-4 h-4 rotate-180" />
                                            </Button>
                                            <h3 className="font-bold text-lg">전체 매매 내역</h3>
                                        </div>
                                        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-[180px]">
                                            <TabsList className="grid w-full grid-cols-2 h-8">
                                                <TabsTrigger value="ticker" className="text-xs h-6">종목별</TabsTrigger>
                                                <TabsTrigger value="timeline" className="text-xs h-6">시간순</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    
                                    <ScrollArea className="h-[calc(100vh-180px)] pr-4 -mr-4">
                                        <div className="space-y-3 pr-4 pb-4">
                                            {viewMode === 'timeline' ? (
                                                mockRawTrades.map(trade => renderTradeItem(trade))
                                            ) : (
                                                <Accordion type="multiple" className="space-y-3">
                                                    {Object.entries(tradesByTicker).map(([ticker, trades]) => {
                                                        const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
                                                        // const reviewedCount = trades.filter(t => currentReviews[t.id]).length;
                                                        
                                                        // Filter for "Closed Trades" (Sell) that need review or are reviewed
                                                        // We focus on Sell trades as "Closed" units for review
                                                        const sellTrades = trades.filter(t => t.type === 'sell');
                                                        const buyTrades = trades.filter(t => t.type === 'buy');
                                                        const reviewedSellCount = sellTrades.filter(t => currentReviews[t.id]).length;
                                                        const isProfit = totalPnl >= 0;

                                                        return (
                                                            <AccordionItem key={ticker} value={ticker} className="border rounded-xl bg-card px-3 overflow-hidden shadow-sm">
                                                                <AccordionTrigger className="hover:no-underline py-3">
                                                                    <div className="flex flex-1 items-center justify-between mr-2 min-w-0">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <span className="font-black text-lg truncate">{ticker}</span>
                                                                            <Badge variant="secondary" className="text-[10px] h-5 font-normal bg-muted whitespace-nowrap px-1.5">
                                                                                {sellTrades.length}건 마감
                                                                            </Badge>
                                                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                                                                                (복기 {reviewedSellCount}/{sellTrades.length})
                                                                            </span>
                                                                        </div>
                                                                        <div className={`font-bold font-mono text-sm whitespace-nowrap ml-2 ${isProfit ? 'text-red-500' : 'text-blue-500'}`}>
                                                                            {totalPnl > 0 ? '+' : ''}{totalPnl.toLocaleString()}
                                                                            <span className="text-[10px] text-muted-foreground ml-0.5 font-normal">KRW</span>
                                                                        </div>
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="pt-1 pb-3 space-y-3">
                                                                    {/* 1. Unreviewed Closed Trades (Priority) */}
                                                                    {sellTrades.filter(t => !currentReviews[t.id]).length > 0 && (
                                                                        <div className="mb-4">
                                                                            <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                                                                복기 필요한 마감 거래
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {sellTrades.filter(t => !currentReviews[t.id]).map(trade => renderTradeItem(trade))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* 2. Reviewed Closed Trades */}
                                                                    {sellTrades.filter(t => currentReviews[t.id]).length > 0 && (
                                                                        <div className="mb-4">
                                                                            <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                                                                                <Check className="w-3 h-3" />
                                                                                복기 완료된 거래
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {sellTrades.filter(t => currentReviews[t.id]).map(trade => renderTradeItem(trade))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* 3. Buy History (Reference) */}
                                                                    {buyTrades.length > 0 && (
                                                                         <div className="opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all">
                                                                            <div className="text-xs font-bold text-muted-foreground mb-2 pl-1">
                                                                                매수 이력 (참고)
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {buyTrades.map(trade => renderTradeItem(trade))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        );
                                                    })}
                                                </Accordion>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                     {selectedTradeId && (
                                         <div className="flex flex-col gap-3 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                                            {(() => {
                                                const trade = mockRawTrades.find(t => t.id === selectedTradeId);
                                                if (!trade) return null;
                                                return (
                                                    <>
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-xl">{trade.ticker}</span>
                                                                <Badge variant="outline" className={cn(
                                                                    "text-[10px] px-1.5 py-0 h-5 font-bold border-0",
                                                                    trade.type === 'buy' 
                                                                        ? "text-red-600 bg-red-100 dark:bg-red-500/10" 
                                                                        : "text-blue-600 bg-blue-100 dark:bg-blue-500/10"
                                                                )}>
                                                                    {trade.type === 'buy' ? '매수' : '매도'}
                                                                </Badge>
                                                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center">
                                                                    {format(new Date(`${trade.date}T${trade.time}`), 'MM.dd HH:mm')}
                                                                </span>
                                                            </div>
                                                            {trade.pnl && (
                                                                <div className={cn(
                                                                    "font-bold font-mono text-sm",
                                                                    trade.pnl > 0 ? "text-red-500" : "text-blue-500"
                                                                )}>
                                                                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">KRW</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                            <div className="flex justify-between items-center py-1 border-b border-border/30 border-dashed">
                                                                <span className="text-muted-foreground text-xs">체결가</span>
                                                                <span className="font-mono font-medium">{trade.price.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1 border-b border-border/30 border-dashed">
                                                                <span className="text-muted-foreground text-xs">수량</span>
                                                                <span className="font-mono font-medium">{trade.amount} {trade.ticker}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1 border-b border-border/30 border-dashed">
                                                                <span className="text-muted-foreground text-xs">총액</span>
                                                                <span className="font-mono font-medium">{trade.total.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-1 border-b border-border/30 border-dashed">
                                                                <span className="text-muted-foreground text-xs">주문타입</span>
                                                                <span className="font-mono font-medium text-xs">{trade.orderType === 'limit' ? '지정가' : '시장가'}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                         </div>
                                     )}
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
                                        <Button variant="outline" className="flex-1" onClick={() => setDiaryStep(selectedTradeId ? 'trades' : 'dashboard')}>
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
                    {/* Content Body */}
                    <div className="p-6 pt-2">
                        {/* Global Memo Section (if exists) */}
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
                        
                        {/* Global Tags Cloud (if exists) */}
                        {currentEntry.tags && currentEntry.tags.length > 0 && (
                             <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {currentEntry.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="px-3 py-1 text-xs border bg-background/50">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviewed Trades List - Replaces generic TradeFlowChart */}
                        {currentEntry.trades && currentEntry.trades.length > 0 && (
                            <div className="mt-2">
                                <div className="space-y-4">
                                    {currentEntry.trades.map(trade => {
                                        const review = currentEntry.reviews?.[trade.id];
                                        if (!review) return null; // Only show reviewed trades in detail? Or all? User asked for sync.
                                        // User complained "Review trade and trade performance don't match". 
                                        // Let's show ALL trades, but highlight reviewed ones with their details.
                                        
                                        return (
                                            <div key={trade.id} className={cn(
                                                "rounded-xl border overflow-hidden transition-all",
                                                review ? "bg-card border-border shadow-sm" : "bg-muted/10 border-border/50 border-dashed"
                                            )}>
                                                {/* Trade Header */}
                                                <div className={cn(
                                                    "p-3 flex justify-between items-center text-sm border-b",
                                                    review ? "bg-muted/30 border-border/50" : "bg-transparent border-border/30"
                                                )}>
                                                     <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] h-5 bg-background/50">{trade.ticker}</Badge>
                                                        <span className={trade.type === 'buy' ? 'text-red-500 font-bold' : 'text-blue-500 font-bold'}>
                                                            {trade.type === 'buy' ? '매수' : '매도'}
                                                        </span>
                                                        <span className="text-muted-foreground text-xs font-mono">{trade.time}</span>
                                                     </div>
                                                     <div className="flex items-center gap-3">
                                                         <div className="font-mono font-medium text-right">
                                                            {trade.pnl ? (
                                                                <span className={trade.pnl > 0 ? 'text-red-500' : 'text-blue-500'}>
                                                                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString()} <span className="text-[10px] text-muted-foreground">KRW</span>
                                                                </span>
                                                            ) : (
                                                                <span>{trade.total.toLocaleString()} <span className="text-[10px] text-muted-foreground">KRW</span></span>
                                                            )}
                                                         </div>
                                                     </div>
                                                </div>
                                                
                                                {/* Review Content */}
                                                <div className="p-4">
                                                     {review ? (
                                                         <div className="space-y-3">
                                                             <div className="flex items-start justify-between">
                                                                 <div className="space-y-2">
                                                                     {review.tags && review.tags.length > 0 && (
                                                                         <div className="flex flex-wrap gap-1.5">
                                                                             {review.tags.map(tag => (
                                                                                 <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 h-auto font-normal">
                                                                                     #{tag}
                                                                                 </Badge>
                                                                             ))}
                                                                         </div>
                                                                     )}
                                                                     {review.content && (
                                                                         <p className="text-sm text-foreground/80 leading-relaxed">
                                                                             {review.content}
                                                                         </p>
                                                                     )}
                                                                 </div>
                                                                 <div className="flex flex-col items-end gap-1 min-w-[60px]">
                                                                     <span className="text-3xl" title={review.moodEmoji}>
                                                                        {{
                                                                            'best': '🤑', 'good': '😌', 'soso': '😐', 'bad': '😰', 'angry': '🤬'
                                                                        }[review.moodEmoji] || ''}
                                                                     </span>
                                                                     <span className="font-bold text-sm text-muted-foreground">
                                                                        {review.moodScore}점
                                                                     </span>
                                                                 </div>
                                                             </div>
                                                             
                                                             <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-primary -mb-2 mt-2" onClick={() => handleOpenReview(trade.id)}>
                                                                 <PenTool className="w-3 h-3 mr-1.5" /> Edit Review
                                                             </Button>
                                                         </div>
                                                     ) : (
                                                         <div className="flex items-center justify-between py-1">
                                                             <p className="text-xs text-muted-foreground">
                                                                 아직 복기하지 않은 매매입니다.
                                                             </p>
                                                             <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => handleOpenReview(trade.id)}>
                                                                 <Plus className="w-3 h-3" /> 복기하기
                                                             </Button>
                                                         </div>
                                                     )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Footer Message */}
                                    {currentEntry.trades.every(t => currentEntry.reviews?.[t.id]) && (
                                        <div className="text-center py-6 text-sm text-muted-foreground/50 flex flex-col items-center gap-2">
                                            <Check className="w-5 h-5 opacity-50" />
                                            <span>모든 매매 복기가 완료되었습니다.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Remove redundant unreviewed message if we are listing them */}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/5 text-center transition-colors hover:bg-muted/10">
                    <h3 className="text-sm font-semibold mb-1">작성된 일지가 없어요</h3>
                    <p className="text-xs text-muted-foreground mb-4 max-w-[200px] break-keep">
                        오늘의 매매를 복기하고 더 나은 내일을 준비해보세요.
                    </p>
                </div>
            )}
        </div>
    );
}

