"use client";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isToday, parseISO, addDays, isSameDay, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Unlock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, PenTool, TrendingUp, TrendingDown, RefreshCcw, BookOpen, CalendarDays, ArrowRight, Check, X, Loader2, Smile, Frown, Meh, AlertTriangle, BrainCircuit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MarketMoversCard } from './market-movers-card';
import { MarketOverviewCard } from './market-overview-card';
import { TopMoverSummaryCard } from './top-mover-summary-card';
import AverageCryptoRsi from './average-crypto-rsi';
import { indicatorData, IndicatorId } from './market-indicators-carousel';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Label } from '@/components/ui/label';

type Importance = 'high' | 'medium' | 'low';
type EventCategory = 'all' |'economic' | 'unlock' | 'bithumb' | 'journal';
type ViewMode = 'day' | 'all';

type CalendarEvent = {
  id: number;
  importance: Importance;
  country?: string;
  date: string;
  time: string;
  event: string;
  category: EventCategory;
  ticker?: string;
  actual?: string;
  previous?: string;
  consensus?: string;
  // Custom display data for non-economic events
  customData?: {
    col1?: { label: string, value: string };
    col2?: { label: string, value: string };
    col3?: { label: string, value: string };
  };
};

// --- New Types for Insight Journal ---
type TradeType = 'buy' | 'sell';

type TradeLog = {
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

type JournalEntry = {
    id: number;
    date: string;
    content: string;
    tags: string[];
    trades: TradeLog[];
    moodScore?: number;
    moodEmoji?: string;
};

// Mock Trade Data (Existing Journal Data)
const mockTradeLogs: TradeLog[] = [];

// Mock Raw Trade Data (Simulating Bithumb API)
const mockRawTrades: TradeLog[] = [
    { id: 101, date: format(new Date(), 'yyyy-MM-dd'), time: '14:00:05', ticker: 'BTC', type: 'buy', price: 92000000, amount: 0.05, total: 4600000, orderType: 'market', snapshot: { rsi: 35, dominance: 52.1, kimchiPremium: 3.2 } },
    { id: 102, date: format(new Date(), 'yyyy-MM-dd'), time: '14:00:12', ticker: 'BTC', type: 'buy', price: 92050000, amount: 0.05, total: 4602500, orderType: 'limit', snapshot: { rsi: 35, dominance: 52.1, kimchiPremium: 3.2 } },
    { id: 103, date: format(new Date(), 'yyyy-MM-dd'), time: '14:05:00', ticker: 'XRP', type: 'sell', price: 800, amount: 1000, total: 800000, orderType: 'market', pnl: 50000, pnlPercent: 6.25, snapshot: { rsi: 65, dominance: 52.0, kimchiPremium: 3.1 } },
    { id: 104, date: format(new Date(), 'yyyy-MM-dd'), time: '15:30:00', ticker: 'ETH', type: 'buy', price: 3500000, amount: 1, total: 3500000, orderType: 'limit', snapshot: { rsi: 45, dominance: 51.9, kimchiPremium: 3.0 } },
    { id: 105, date: format(new Date(), 'yyyy-MM-dd'), time: '15:31:00', ticker: 'ETH', type: 'buy', price: 3490000, amount: 1, total: 3490000, orderType: 'limit', snapshot: { rsi: 44, dominance: 51.9, kimchiPremium: 3.0 } },
    // Mixed Case: BTC Sell
    { id: 106, date: format(new Date(), 'yyyy-MM-dd'), time: '16:00:00', ticker: 'BTC', type: 'sell', price: 93500000, amount: 0.05, total: 4675000, orderType: 'market', pnl: 75000, pnlPercent: 1.63, snapshot: { rsi: 60, dominance: 52.2, kimchiPremium: 3.3 } },
];

// Mock Journal Data
const mockJournalEntries: JournalEntry[] = [];

const MOCK_CURRENT_PRICES: Record<string, number> = {
    'BTC': 92500000,
    'ETH': 3520000,
    'XRP': 815,
    'SOL': 245000
};

const allEvents: CalendarEvent[] = [
  // Today's events
  { id: 1, importance: 'high', country: 'us', date: format(new Date(), 'yyyy-MM-dd'), time: '22:30', event: 'Core Inflation Rate YoY (U.S.)', category: 'economic', previous: '3.1%', consensus: '3.0%' },
  { 
      id: 2, 
      importance: 'medium', 
      date: format(new Date(), 'yyyy-MM-dd'), 
      time: '10:00', 
      event: 'SOL 락업해제', 
      category: 'unlock', 
      ticker: 'SOL',
      customData: {
      }
  },
  { 
      id: 3, 
      importance: 'low', 
      date: format(new Date(), 'yyyy-MM-dd'), 
      time: '00:00', 
      event: '빗썸 정기점검', 
      category: 'bithumb',
      customData: {
      }
  },
  
  // Future events
  { id: 4, importance: 'high', country: 'us', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '22:30', event: 'Unemployment Rate (U.S.)', category: 'economic' },
  
  // Past events
  { id: 5, importance: 'high', country: 'us', date: format(addDays(new Date(), -2), 'yyyy-MM-dd'), time: '04:00', event: 'Fed Interest Rate Decision (U.S.)', category: 'economic', actual: '3.75%', previous: '4.0%', consensus: '3.75%' },
  { id: 6, importance: 'high', country: 'us', date: format(addDays(new Date(), -7), 'yyyy-MM-dd'), time: '00:00', event: 'Core PCE Price Index MoM (U.S.)', category: 'economic', actual: '0.2%', previous: '0.2%', consensus: '0.2%' },
];

// --- Event Detail Types & Mock Data ---
type EventScenario = {
    condition: 'high' | 'low'; 
    judgment: 'positive' | 'negative' | 'neutral';
    interpretation: string;
    checkPoint: string;
};

type PastImpact = {
    date: string;
    result: 'beat' | 'miss' | 'match'; 
    btcMove: number; 
    timeframe: string;
};

type EventDetailData = {
    description: string;
    history: { date: string; actual: number; consensus: number; btcPrice: number }[];
    scenarios: {
        high: EventScenario;
        low: EventScenario;
    };
    impacts: PastImpact[];
};

// Mock Data for CPI
const MOCK_CPI_DATA: EventDetailData = {
    description: "미국 소비자들이 물건을 살 때 느끼는 물가 상승률입니다. 연준(Fed)이 금리를 올릴지 내릴지 결정하는 가장 중요한 성적표입니다.",
    history: [
        { date: '24.12', actual: 3.1, consensus: 3.2, btcPrice: 96000000 },
        { date: '25.01', actual: 3.0, consensus: 3.0, btcPrice: 98500000 },
        { date: '25.02', actual: 2.9, consensus: 2.9, btcPrice: 102000000 },
        { date: '25.03', actual: 3.2, consensus: 3.0, btcPrice: 95000000 },
        { date: '25.04', actual: 3.1, consensus: 3.2, btcPrice: 99000000 },
        { date: '25.05', actual: 2.8, consensus: 2.9, btcPrice: 105000000 },
    ],
    scenarios: {
        high: {
            condition: 'high',
            judgment: 'negative',
            interpretation: "물가가 여전히 비싸요 (인플레 지속)",
            checkPoint: "금리를 못 내려서 비트코인이 떨어질 수 있어요"
        },
        low: {
            condition: 'low',
            judgment: 'positive',
            interpretation: "물가가 잡히고 있어요 (인플레 둔화)",
            checkPoint: "금리 인하 기대감으로 비트코인이 오를 수 있어요"
        }
    },
    impacts: [
        { date: '2025-05-14', result: 'miss', btcMove: 1.24, timeframe: '1시간' },
        { date: '2025-04-13', result: 'beat', btcMove: -0.85, timeframe: '30분' },
        { date: '2025-03-12', result: 'beat', btcMove: -1.2, timeframe: '1시간' },
    ]
};

// Mock Data for Interest Rate
const MOCK_INTEREST_RATE_DATA: EventDetailData = {
    description: "미국 연방준비제도(Fed)의 기준금리 결정입니다. 전 세계 금융 시장의 유동성과 자산 가치 평가의 기준이 되는 가장 중요한 이벤트입니다.",
    history: [
        { date: '24.09', actual: 4.50, consensus: 4.50, btcPrice: 88000000 },
        { date: '24.11', actual: 4.25, consensus: 4.25, btcPrice: 92000000 },
        { date: '24.12', actual: 4.00, consensus: 4.00, btcPrice: 96000000 },
        { date: '25.02', actual: 3.75, consensus: 3.75, btcPrice: 102000000 },
        { date: '25.03', actual: 3.75, consensus: 3.75, btcPrice: 95000000 },
        { date: '25.05', actual: 3.50, consensus: 3.50, btcPrice: 105000000 },
    ],
    scenarios: {
        high: { 
            condition: 'high',
            judgment: 'negative',
            interpretation: "예상보다 금리가 높아요 (긴축)",
            checkPoint: "돈 줄이 마르면서 주식/코인이 하락할 수 있어요"
        },
        low: { 
            condition: 'low',
            judgment: 'positive',
            interpretation: "예상보다 금리가 낮아요 (완화)",
            checkPoint: "시장에 돈이 풀리면서 강한 상승장이 올 수 있어요"
        }
    },
    impacts: [
        { date: '2025-03-20', result: 'match', btcMove: 2.5, timeframe: '하루' }, 
        { date: '2025-02-01', result: 'match', btcMove: -1.2, timeframe: '하루' }, 
    ]
};

// Mock Data for Unemployment
const MOCK_UNEMPLOYMENT_DATA: EventDetailData = {
    description: "경제 활동 인구 중 실업자의 비율입니다. 경기 침체 여부와 소비 여력을 판단하는 핵심 지표로, '샴의 법칙' 등 경기 침체 시그널로 활용됩니다.",
    history: [
        { date: '24.12', actual: 4.1, consensus: 4.1, btcPrice: 96000000 },
        { date: '25.01', actual: 4.2, consensus: 4.2, btcPrice: 98000000 },
        { date: '25.02', actual: 4.2, consensus: 4.3, btcPrice: 102000000 },
        { date: '25.03', actual: 4.3, consensus: 4.3, btcPrice: 95000000 },
        { date: '25.04', actual: 4.4, consensus: 4.4, btcPrice: 99000000 },
        { date: '25.05', actual: 4.5, consensus: 4.4, btcPrice: 105000000 },
    ],
    scenarios: {
        high: { 
            condition: 'high',
            judgment: 'positive',
            interpretation: "고용 시장 냉각 → 금리 인하 압박 가중 (Bad is Good)",
            checkPoint: "경기 침체 공포가 없다면 호재로 인식될 가능성 높음"
        },
        low: { 
            condition: 'low',
            judgment: 'negative',
            interpretation: "고용 시장 과열 지속 → 긴축 명분 유지 (Good is Bad)",
            checkPoint: "국채 금리 상승과 함께 자산 시장 조정 가능성"
        }
    },
    impacts: [
        { date: '2025-05-02', result: 'miss', btcMove: 1.5, timeframe: '1시간' }, 
        { date: '2025-04-04', result: 'match', btcMove: -0.5, timeframe: '1시간' },
    ]
};

const getEventDetailData = (eventName: string): EventDetailData | null => {
    if (eventName.includes('Inflation') || eventName.includes('CPI') || eventName.includes('PCE')) {
        return MOCK_CPI_DATA;
    }
    if (eventName.includes('Interest Rate Decision')) {
        return MOCK_INTEREST_RATE_DATA;
    }
    if (eventName.includes('Unemployment')) {
        return MOCK_UNEMPLOYMENT_DATA;
    }
    return null;
};

// --- Unlock Detail Types ---
type UnlockDetailData = {
    tokenName: string;
    symbol: string;
    currentPrice: number;
    marketCap: number; // 시가총액
    circulatingSupply: number; // 현재 유통량
    
    unlockAmount: number; // 이번 해제 물량
    unlockValue: number; // 이번 해제 가치 (계산됨)
    unlockPercent: number; // 시총 대비 비율 (계산됨)
    
    totalMaxSupply: number; // 총 발행량
    lockedPercent: number; // 남은 락업 비율
    
    nextUnlockDate?: string;
    investorType: string; // 예: 초기 투자자, 팀 물량 등
};

// Mock Data for SOL Unlock
const MOCK_SOL_UNLOCK: UnlockDetailData = {
    tokenName: "Solana",
    symbol: "SOL",
    currentPrice: 245000,
    marketCap: 110000000000000, // 약 110조
    circulatingSupply: 460000000, // 4.6억개
    
    unlockAmount: 34200000, // 3420만개
    unlockValue: 0, // 나중에 계산
    unlockPercent: 0, // 나중에 계산
    
    totalMaxSupply: 580000000,
    lockedPercent: 20.5,
    
    investorType: "Foundation & Team",
};

const generateDates = (baseDate: Date) => {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
    const dates = [];
    for (let i = 0; i < 7; i++) {
        dates.push(addDays(start, i));
    }
    return dates;
};

const getIconForCategory = (category: EventCategory, country?: string, ticker?: string) => {
    switch (category) {
        case 'economic':
            return country ? (
                <Image 
                    src={`https://flagcdn.com/w40/${country}.png`}
                    alt={`${country} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm"
                />
            ) : <Globe className="w-5 h-5 text-muted-foreground" />;
        case 'unlock':
            return <Unlock className="w-5 h-5 text-muted-foreground" />;
        case 'bithumb':
            return <CalendarIcon className="w-5 h-5 text-muted-foreground" />;
        case 'journal':
            return <BookOpen className="w-5 h-5 text-primary" />;
        default:
            return <Globe className="w-5 h-5 text-muted-foreground" />;
    }
}

const ImportanceIndicator = ({ importance }: { importance: Importance }) => {
    const color = {
        high: 'bg-destructive',
        medium: 'bg-primary',
        low: 'bg-muted-foreground'
    }[importance];
    return <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>;
}

// --- Event Detail Component ---
const EventDetailPanel = ({ event }: { event: CalendarEvent }) => {
    // Demo: Only show full detail for Economic events
    const economicData = event.category === 'economic' ? getEventDetailData(event.event) : null;
    
    // Unlock Data Logic
    const unlockData = event.category === 'unlock' ? MOCK_SOL_UNLOCK : null;

    if (event.category === 'unlock' && unlockData) {
        // Calculate dynamic values
        const unlockValue = unlockData.unlockAmount * unlockData.currentPrice;
        const unlockPercent = (unlockData.unlockAmount / unlockData.circulatingSupply) * 100;
        const impactLevel = unlockPercent > 5 ? 'high' : unlockPercent > 1 ? 'medium' : 'low';

        return (
            <div className="p-4 bg-muted/20 rounded-b-lg border-x border-b border-border/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
                {/* 1. Header Summary */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-2">
                             {unlockData.tokenName} ({unlockData.symbol})
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            현재가 {unlockData.currentPrice.toLocaleString()}원
                        </span>
                    </div>
                    <div className="text-right">
                         <span className="text-xs text-muted-foreground block">유통량 대비 비율</span>
                         <span className={`text-lg font-bold ${impactLevel === 'high' ? 'text-red-500' : 'text-foreground'}`}>
                             {unlockPercent.toFixed(2)}%
                         </span>
                    </div>
                </div>

                {/* 2. Unlock Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background p-3 rounded-lg border border-border/50">
                        <span className="text-[10px] text-muted-foreground block mb-1">해제 물량</span>
                        <span className="text-sm font-bold block">{unlockData.unlockAmount.toLocaleString()} {unlockData.symbol}</span>
                    </div>
                    <div className="bg-background p-3 rounded-lg border border-border/50">
                        <span className="text-[10px] text-muted-foreground block mb-1">금액 규모</span>
                        <span className="text-sm font-bold block">≈ {(unlockValue / 100000000).toFixed(1)}억원</span>
                    </div>
                </div>

                {/* 3. Supply Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">현재 유통 비율</span>
                        <span className="font-medium">{((1 - unlockData.lockedPercent / 100) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(1 - unlockData.lockedPercent / 100) * 100} className="h-2" />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>현재 유통량 {(unlockData.circulatingSupply / 100000000).toFixed(1)}억개</span>
                        <span>총 발행량 {unlockData.totalMaxSupply ? (unlockData.totalMaxSupply / 100000000).toFixed(1) : '?'}억개</span>
                    </div>
                </div>
            </div>
        );
    }

    const data = economicData;

    if (!data) return (
        <div className="p-6 text-center text-muted-foreground text-sm bg-muted/20 rounded-b-lg border-x border-b border-border/50">
            <p>상세 분석 데이터가 준비되지 않은 일정입니다.</p>
        </div>
    );

    return (
        <div className="p-4 bg-muted/20 rounded-b-lg border-x border-b border-border/50 space-y-6 animate-in slide-in-from-top-2 duration-300">
            {/* 0. Definition */}
            <div className="text-sm text-muted-foreground leading-relaxed bg-background p-3 rounded-lg border border-border/50">
                <span className="font-bold text-primary mr-2">[지표 정의]</span>
                {data.description}
            </div>

            {/* 1. Visual: History Graph */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                     <h4 className="font-bold text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" /> A. 과거 발표 추세
                    </h4>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">최근 6개월</span>
                </div>
                <div className="h-[200px] w-full bg-background rounded-lg border border-border/50 p-4 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.history} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis yAxisId="left" domain={['auto', 'auto']} fontSize={11} tickLine={false} axisLine={false} width={30} />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                domain={['auto', 'auto']} 
                                fontSize={11} 
                                tickLine={false} 
                                axisLine={false} 
                                width={40} 
                                tickFormatter={(val) => `${(val/100000000).toFixed(1)}억`} 
                            />
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px' }}
                                labelStyle={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}
                                formatter={(value: number, name: string) => {
                                    if (name === 'BTC 가격') return `${(value/10000).toLocaleString()}만원`;
                                    return value;
                                }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="actual" name="실제" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                            <Line yAxisId="left" type="monotone" dataKey="consensus" name="예측" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} />
                            <Line yAxisId="right" type="monotone" dataKey="btcPrice" name="BTC 가격" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-end gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>실제값</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 border-t-2 border-dashed border-blue-500"></div>
                        <span>예측값</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 bg-yellow-500"></div>
                        <span>BTC 가격</span>
                    </div>
                </div>
            </div>

            {/* 2. Logic: Scenario Cards */}
            <div className="space-y-3">
                 <h4 className="font-bold text-sm flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-primary" /> B. 시장 대응 시나리오
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {/* Scenario: Actual > Consensus */}
                    <div className="bg-background rounded-lg border border-l-4 border-l-red-500 p-3 shadow-sm hover:translate-y-[-2px] transition-transform h-full">
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-foreground">
                                    예상치 <span className="text-white">상회</span>
                                </span>
                                <span className="text-[11px] font-bold text-foreground">
                                    {data.scenarios.high.judgment === 'positive' ? '호재' : data.scenarios.high.judgment === 'negative' ? '악재' : '중립'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-[10px] text-muted-foreground block mb-0.5">해석</span>
                                <span className="text-xs font-medium leading-snug block">{data.scenarios.high.interpretation}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground block mb-0.5">대응 전략</span>
                                <span className="text-xs text-foreground leading-snug block">{data.scenarios.high.checkPoint}</span>
                            </div>
                        </div>
                    </div>

                    {/* Scenario: Actual < Consensus */}
                    <div className="bg-background rounded-lg border border-l-4 border-l-green-500 p-3 shadow-sm hover:translate-y-[-2px] transition-transform h-full">
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-foreground">
                                    예상치 <span className="text-white">하회</span>
                                </span>
                                <span className="text-[11px] font-bold text-foreground">
                                    {data.scenarios.low.judgment === 'positive' ? '호재' : data.scenarios.low.judgment === 'negative' ? '악재' : '중립'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-[10px] text-muted-foreground block mb-0.5">해석</span>
                                <span className="text-xs font-medium leading-snug block">{data.scenarios.low.interpretation}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground block mb-0.5">대응 전략</span>
                                <span className="text-xs text-foreground leading-snug block">{data.scenarios.low.checkPoint}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Validation: Past Impact */}
            <div className="space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-primary" /> C. 과거 시장 임팩트 (BTC)
                </h4>
                <div className="space-y-2">
                    {data.impacts.map((impact, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-background p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground font-mono text-xs">{impact.date}</span>
                                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${
                                    impact.result === 'beat' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 
                                    impact.result === 'miss' ? 'text-green-500 bg-green-500/10 border-green-500/20' : ''
                                }`}>
                                    {impact.result === 'beat' ? '예상 상회' : '예상 하회'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">발표 {impact.timeframe} 후</span>
                                <span className={`font-bold font-mono ${impact.btcMove > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {impact.btcMove > 0 ? '+' : ''}{impact.btcMove}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EventRow = ({ event, viewMode }: { event: CalendarEvent, viewMode: ViewMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Reset open state when view mode changes to 'all'
    useMemo(() => {
        if (viewMode === 'all') setIsOpen(false);
    }, [viewMode]);
    
    return (
        <div className="group mb-1">
            <div 
                className={`grid grid-cols-[50px_1fr_100px] sm:grid-cols-[50px_1fr_240px] items-center gap-2 sm:gap-4 text-sm p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 border border-transparent ${isOpen ? 'bg-muted/50 rounded-b-none border-border/50' : 'hover:border-border/30'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ImportanceIndicator importance={event.importance} />
                    <span className="text-xs sm:text-sm">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <div className="flex-shrink-0">
                        {getIconForCategory(event.category, event.country, event.ticker)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                         <span className="font-medium text-foreground flex items-center gap-1 sm:gap-2 truncate">
                            <span className="truncate">{event.event}</span>
                            <ChevronRight className={`w-3 h-3 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-right">
                    {event.customData ? (
                        <>
                            <div className="flex flex-col hidden sm:flex">
                                {event.customData.col1 && (
                                    <>
                                        <span className="text-xs text-muted-foreground">{event.customData.col1.label}</span>
                                        <span className="font-code font-semibold mt-1 text-foreground">{event.customData.col1.value}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                {event.customData.col2 && (
                                    <>
                                        <span className="text-xs text-muted-foreground">{event.customData.col2.label}</span>
                                        <span className="font-code font-semibold mt-1 text-foreground">{event.customData.col2.value}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col">
                                {event.customData.col3 && (
                                    <>
                                        <span className="text-xs text-muted-foreground hidden sm:inline">{event.customData.col3.label}</span>
                                        <span className="font-code font-semibold mt-0 sm:mt-1 text-foreground">{event.customData.col3.value}</span>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground hidden sm:inline">실제</span>
                                <span className={`font-code font-semibold mt-0 sm:mt-1 ${
                                    event.actual && event.consensus 
                                    // Simple logic check for color (just demo)
                                    ? (parseFloat(event.actual) > parseFloat(event.consensus) ? 'text-red-500' : 'text-blue-500')
                                    : 'text-foreground'
                                }`}>{event.actual ?? '--'}</span>
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-xs text-muted-foreground">이전</span>
                                <span className="font-code text-foreground font-semibold mt-1">{event.previous ?? '--'}</span>
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                                <span className="text-xs text-muted-foreground">예측</span>
                                <span className="font-code text-foreground font-semibold mt-1">{event.consensus ?? '--'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isOpen && <EventDetailPanel event={event} />}
        </div>
    );
};

const TradeLogRow = ({ log }: { log: TradeLog }) => (
    <div className="grid grid-cols-[50px_1fr_120px] items-center gap-4 text-sm p-3 rounded-lg bg-card border border-border/50 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col items-center gap-1">
             <span className="text-xs text-muted-foreground">{log.time}</span>
             {log.type === 'buy' ? 
                <Badge variant="outline" className="text-red-400 border-red-400/30 bg-red-400/10 text-[10px] px-1 py-0 h-5">매수</Badge> : 
                <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10 text-[10px] px-1 py-0 h-5">매도</Badge>
             }
        </div>
        
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{log.ticker}</span>
                <span className="text-muted-foreground text-xs">{log.amount} {log.ticker}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>RSI: <span className={log.snapshot.rsi > 70 ? 'text-red-400' : log.snapshot.rsi < 30 ? 'text-blue-400' : ''}>{log.snapshot.rsi}</span></span>
                <span>김프: {log.snapshot.kimchiPremium}%</span>
            </div>
        </div>

        <div className="text-right">
             <div className="font-medium">{log.total.toLocaleString()}원</div>
             {log.pnl && (
                 <div className={`text-xs ${log.pnl > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {log.pnl > 0 ? '+' : ''}{log.pnl.toLocaleString()} ({log.pnlPercent}%)
                 </div>
             )}
        </div>
    </div>
);

// Helper Component for Trade Performance Card
const TradePerformanceCard = ({ tradeGroup }: { tradeGroup: { ticker: string, trades: TradeLog[] } }) => {
    const { ticker, trades } = tradeGroup;
    
    // Calculate metrics
    const buyTrades = trades.filter(t => t.type === 'buy');
    const sellTrades = trades.filter(t => t.type === 'sell');
    
    const totalBuyAmount = buyTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalBuyValue = buyTrades.reduce((sum, t) => sum + t.total, 0);
    
    const totalSellAmount = sellTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalSellValue = sellTrades.reduce((sum, t) => sum + t.total, 0);

    // Determine Net Flow
    const isNetBuy = totalBuyAmount >= totalSellAmount;
    
    // Calculate relevant average price
    const myAvgPrice = isNetBuy 
        ? (totalBuyAmount > 0 ? Math.round(totalBuyValue / totalBuyAmount) : 0)
        : (totalSellAmount > 0 ? Math.round(totalSellValue / totalSellAmount) : 0);

    // Mock Market Data (24H Average simulation)
    const marketAvg = useMemo(() => {
        if (MOCK_CURRENT_PRICES[ticker]) return Math.round(MOCK_CURRENT_PRICES[ticker] * 0.998); // Slightly lower than current
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
    // We want to show where My Price is relative to Market Price
    // Center is Current Price (as requested)
    const myPricePercentDiff = ((myAvgPrice - currentPrice) / currentPrice) * 100;
    const marketAvgPercentDiff = ((marketAvg - currentPrice) / currentPrice) * 100;
    
    // For Buy: My Price < Market Price is Good (Left side if Low is Left)
    // For Sell: My Price > Market Price is Good (Right side if High is Right)
    
    // Let's standardise the bar: 
    // Left (Low Price) ----- Center (Current Price) ----- Right (High Price)
    // Markers show My Price and Market Avg
    
    const isGood = isNetBuy ? myAvgPrice < marketAvg : myAvgPrice > marketAvg;

    return (
        <div className="mb-3 last:mb-0 p-4 bg-background rounded-lg border border-border/50">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{ticker}</span>
                    <Badge variant="outline" className={`${isNetBuy ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'text-blue-500 border-blue-500/30 bg-blue-500/10'}`}>
                        {isNetBuy ? '순매수' : '순매도'}
                    </Badge>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm relative mb-4">
                {/* Vertical Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />
                
                <div>
                    <div className="text-xs text-muted-foreground mb-1">내 평단가</div>
                    <div className="font-mono font-medium">{myAvgPrice.toLocaleString()}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">빗썸 24H 평균</div>
                    <div className="font-mono font-medium text-muted-foreground">{marketAvg.toLocaleString()}</div>
                </div>
            </div>

            {/* Visual Comparison Bar */}
            <div className="relative pt-6 pb-6 mt-4">
                {/* Track */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-visible relative">
                    
                    {/* Center Marker (Current Price) */}
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-3 bg-yellow-400 z-10" />
                     {/* Current Price Label (Bottom) */}
                     <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center min-w-[100px] z-10">
                         <div className="w-0.5 h-1.5 bg-yellow-400/50 mb-0.5"></div>
                         <span className="text-[10px] font-mono text-yellow-500 font-bold bg-background/80 px-1 rounded shadow-sm border border-yellow-500/20 whitespace-nowrap">
                            현재가: {currentPrice.toLocaleString()}원
                         </span>
                     </div>

                    {/* Market Avg Marker (Dynamic) - 'B' */}
                    <div 
                        className="absolute top-1/2 z-20 transition-all duration-300 ease-out"
                        style={{ 
                            left: `${Math.min(Math.max(50 + (marketAvgPercentDiff * 10), 0), 100)}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                         <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
                             <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-orange-400">
                                 B
                             </div>
                             <div className="w-0.5 h-1.5 bg-orange-500"></div>
                         </div>
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm bg-orange-500" />
                    </div>
                    
                    {/* My Price Marker (Dynamic) - '나' */}
                    <div 
                        className="absolute top-1/2 z-30 transition-all duration-300 ease-out"
                        style={{ 
                            left: `${Math.min(Math.max(50 + (myPricePercentDiff * 10), 0), 100)}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                         <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
                             <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-green-400">
                                 나
                             </div>
                             <div className="w-0.5 h-1.5 bg-green-500"></div>
                         </div>
                        <div className="w-3 h-3 rounded-full border-2 border-background shadow-sm bg-green-500" />
                    </div>
                </div>
                <div className="flex justify-between mt-6 text-[10px] text-muted-foreground font-mono">
                    <span>당일저가 {dayLow.toLocaleString()}</span>
                    <span>당일고가 {dayHigh.toLocaleString()}</span>
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
            <Label className="text-xs text-muted-foreground mb-2 block">매매 코인</Label>
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

const DailySummary = () => (
  <div className="mb-6">
    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        전날 요약
    </h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
            <MarketOverviewCard />
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-4">
            <MarketMoversCard />
            <AverageCryptoRsi />
            <TopMoverSummaryCard type="gainer" />
            <TopMoverSummaryCard type="loser" />
        </div>
    </div>
  </div>
);

export default function EconomicCalendar() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Real State for Journal
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // New Diary Flow State
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

  const dates = useMemo(() => generateDates(currentWeek), [currentWeek]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentWeek(startOfWeek(date, { weekStartsOn: 1 }));
    setViewMode('day');
    setIsCalendarOpen(false);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }));
    setViewMode('day');
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const amount = direction === 'prev' ? -7 : 7;
    setCurrentWeek(addDays(currentWeek, amount));
  };
  
  const filteredEvents = useMemo(() => {
    return allEvents
      .filter(event => (activeCategory === 'all' || event.category === activeCategory))
      .filter(event => viewMode === 'all' || isSameDay(parseISO(event.date), selectedDate))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [activeCategory, selectedDate, viewMode]);
  
  const groupedEvents = useMemo(() => {
    if (!filteredEvents) return {};
    return filteredEvents.reduce((acc, event) => {
        const eventDate = event.date;
        if (!eventDate || !eventDate.match(/^\d{4}-\d{2}-\d{2}$/)) return acc;
        const parsedDate = parseISO(eventDate);
        if (isNaN(parsedDate.getTime())) return acc;
        if (!acc[eventDate]) {
            acc[eventDate] = [];
        }
        acc[eventDate].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [filteredEvents]);

  // Filter Trades for selected date
  const selectedDateTrades = useMemo(() => {
      return mockTradeLogs.filter(log => log.date === format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const eventCategories: { id: EventCategory, label: string }[] = [
      { id: 'all', label: '전체' },
      { id: 'economic', label: '경제지표' },
      { id: 'unlock', label: '락업해제' },
      { id: 'bithumb', label: '빗썸' },
  ];

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

  // Helper to get unique tickers from trades
  const todayTickers = useMemo(() => {
      // In real app, we use fetched trades. Here using mocks.
      const tickers = new Set(mockRawTrades.map(t => t.ticker));
      return Array.from(tickers);
  }, []);

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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={handleTodayClick}>오늘</Button>
             <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                 <PopoverTrigger asChild>
                     <Button variant="ghost" size="icon">
                         <CalendarDays className="w-5 h-5 text-muted-foreground" />
                     </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                         mode="single"
                         locale={ko}
                         selected={selectedDate}
                         onSelect={(date) => {
                            if (date) handleDateSelect(date);
                         }}
                         initialFocus
                     />
                 </PopoverContent>
             </Popover>
        </div>
      </div>
      
      {viewMode === 'day' && (
        <>
          <div className="relative mb-4">
              <Button variant="ghost" size="icon" className="absolute -left-4 top-1/2 -translate-y-1/2 z-10" onClick={() => changeWeek('prev')}>
                  <ChevronLeft />
              </Button>
              <div className="overflow-hidden">
                  <div className="flex justify-between gap-2 pb-1">
                      {dates.map((date, index) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const hasTrade = journalEntries.some(e => e.date === dateStr);
                          // Simple logic: if journal exists, show dot
                          
                          return (
                          <div key={index} className="flex-[1_1_0] min-w-0">
                              <Button 
                                  variant={isSameDay(date, selectedDate) ? 'outline' : 'ghost'}
                                  onClick={() => handleDateSelect(date)}
                                  className={`relative flex flex-col items-center h-auto w-full px-2 py-2 rounded-lg ${isToday(date) ? 'border-primary' : ''} ${hasTrade ? 'bg-primary/5' : ''}`}
                              >
                                  <span className="text-sm text-muted-foreground">{format(date, 'EEE', { locale: ko })}</span>
                                  <span className="text-xl font-bold">{format(date, 'dd')}</span>
                                  
                                  {hasTrade && (
                                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                                  )}
                              </Button>
                          </div>
                      )})}
                  </div>
              </div>
              <Button variant="ghost" size="icon" className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" onClick={() => changeWeek('next')}>
                  <ChevronRight />
              </Button>
          </div>
          <DailySummary />
          
          <div className="flex flex-col gap-4 mb-4 mt-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                주요 일정
            </h3>
            <div className="flex items-center justify-between">
                <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as EventCategory)}>
                    <TabsList>
                        {eventCategories.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                    <TabsList>
                        <TabsTrigger value="day">일별</TabsTrigger>
                        <TabsTrigger value="all">전체</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
          </div>
        </>
      )}

      <div className="flex-1 mt-4">
        <ScrollArea className="h-[calc(100vh-14rem)] pb-20">
          <div className="space-y-6 pr-4">
            {Object.keys(groupedEvents).length > 0 ? (
                Object.entries(groupedEvents).map(([dateStr, events]) => {
                    const parsedDate = parseISO(dateStr);
                    if (isNaN(parsedDate.getTime())) return null;
                    return (
                        <div key={dateStr} className="mb-8">
                            <h3 className="font-bold text-lg mb-2 sticky top-0 bg-background-dark py-2">
                               {format(parsedDate, 'M월 d일 (EEE)', { locale: ko })}
                            </h3>
                            <div className="space-y-2">
                               {events.map(event => <EventRow key={event.id} event={event} viewMode={viewMode} />)}
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="flex items-center justify-center h-20 mb-8">
                    <p className="text-muted-foreground">선택한 날짜에 예정된 이벤트가 없습니다.</p>
                </div>
            )}

             {/* Journal Section - Only visible in day mode */}
             {viewMode === 'day' && (
                 <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between sticky top-0 bg-background-dark py-2 z-10">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                             <BookOpen className="w-5 h-5 text-primary" />
                             투자 일지
                        </h3>
                         <Sheet>
                             <SheetTrigger asChild>
                                 <Button size="sm" variant="outline" className="gap-2">
                                     <PenTool className="w-4 h-4" />
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
                     
                     {/* Trade Flow Chart (Visual Summary) - Removed from here, moved into Journal Entry */}
                     
                     {/* Journal Entry Display */}
                     {journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd')) ? (
                         <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                             <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                                 <div className="flex items-center gap-3">
                                     <span className="text-3xl">
                                        {{
                                            'best': '🤑',
                                            'good': '😌',
                                            'soso': '😐',
                                            'bad': '😰',
                                            'angry': '😡'
                                        }[journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.moodEmoji || ''] || ''}
                                     </span>
                                     <div className="flex flex-col">
                                         <span className="text-sm text-muted-foreground">오늘의 매매 기분</span>
                                         <span className="font-semibold text-foreground">
                                             {{
                                                'best': '최고에요!',
                                                'good': '좋아요',
                                                'soso': '그저 그래요',
                                                'bad': '아쉬워요',
                                                'angry': '화나요'
                                             }[journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.moodEmoji || ''] || '-'}
                                         </span>
                                     </div>
                                 </div>
                                 {journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.moodScore !== undefined && (
                                     <div className="text-right">
                                         <span className="text-xs text-muted-foreground block mb-1">매매 점수</span>
                                         <span className="text-2xl font-bold text-primary">{journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.moodScore}<span className="text-sm font-normal text-muted-foreground ml-1">점</span></span>
                                     </div>
                                 )}
                             </div>

                             {/* Market Snapshot (BTC Dom/Kimchi) - Moved Here */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                 {/* Left Column: BTC Dominance & Price */}
                                 <div className="bg-background p-3 rounded-lg border flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                                     <div className="flex w-full justify-between items-center sm:flex-col sm:justify-center">
                                         <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-muted-foreground mb-1">BTC 도미넌스</span>
                                            <span className="text-sm font-bold mb-0 sm:mb-2">52.1%</span>
                                         </div>
                                         <div className="h-8 w-px bg-border/50 mx-2 sm:hidden" />
                                         <div className="hidden sm:block w-full h-px bg-border/50 mb-2" />
                                         <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-muted-foreground mb-1">BTC 현재가</span>
                                            <span className="text-sm font-bold text-foreground">{MOCK_CURRENT_PRICES['BTC'].toLocaleString()}</span>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Right Column: Dynamic Indicator & Selector */}
                                 <div className="relative group h-full min-h-[160px]">
                                     <ScrollArea className="h-full max-h-[300px] w-full rounded-lg border bg-background/50">
                                         <div className={`grid gap-2 p-2 ${
                                             activeRightIndicators.length === 1 ? 'grid-cols-1 h-full' :
                                             activeRightIndicators.length === 2 ? 'grid-rows-2 h-full' :
                                             'grid-cols-2 auto-rows-fr'
                                         }`}>
                                             {activeRightIndicators.map((id) => (
                                                 <div key={id} className="bg-background p-3 rounded-lg border flex flex-col items-center justify-center shadow-sm relative min-h-[80px]">
                                                     <span className="text-[10px] text-muted-foreground mb-1">{indicatorData[id].title}</span>
                                                     <span className={`text-sm font-bold ${id === 'kimchi' ? 'text-red-500' : ''}`}>
                                                        {indicatorData[id].value}
                                                     </span>
                                                     {/* Remove Button for each item */}
                                                     <button 
                                                        className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveRightIndicators(prev => prev.filter(item => item !== id));
                                                        }}
                                                     >
                                                         <X className="w-3 h-3" />
                                                     </button>
                                                 </div>
                                             ))}
                                         </div>
                                     </ScrollArea>
                                     
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 absolute bottom-0 right-0 m-2 bg-background/80 hover:bg-background shadow-sm border z-10 rounded-full"
                                        onClick={() => setIsIndicatorDialogOpen(true)}
                                     >
                                         <Plus className="w-4 h-4 text-primary" />
                                     </Button>

                                     <Dialog open={isIndicatorDialogOpen} onOpenChange={setIsIndicatorDialogOpen}>
                                         <DialogContent className="sm:max-w-md">
                                             <DialogHeader>
                                                 <DialogTitle>보조지표 선택</DialogTitle>
                                                 <DialogDescription>
                                                     일지에 표시할 보조지표를 선택하세요.
                                                 </DialogDescription>
                                             </DialogHeader>
                                             <div className="grid grid-cols-2 gap-4 py-4">
                                                 {Object.values(indicatorData).filter(i => i.id !== 'dominance').map((indicator) => {
                                                     const isSelected = activeRightIndicators.includes(indicator.id);
                                                     return (
                                                         <div 
                                                            key={indicator.id}
                                                            className={`
                                                                flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all
                                                                ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted hover:border-foreground/20'}
                                                            `}
                                                            onClick={() => {
                                                                setActiveRightIndicators(prev => {
                                                                    if (isSelected) {
                                                                        // If already selected, remove it
                                                                        if (prev.length === 1) return prev; // Keep at least one
                                                                        return prev.filter(id => id !== indicator.id);
                                                                    } else {
                                                                        // Add new one
                                                                        return [...prev, indicator.id];
                                                                    }
                                                                });
                                                                setIsIndicatorDialogOpen(false); // Close on selection as requested
                                                            }}
                                                         >
                                                             <span className="text-xs text-muted-foreground mb-2">{indicator.title}</span>
                                                             <span className="font-bold text-lg">{indicator.value}</span>
                                                             {isSelected && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                         </DialogContent>
                                     </Dialog>
                                 </div>
                             </div>

                             <div className="mb-6">
                                <Label className="text-xs text-muted-foreground mb-2 block">매매 메모</Label>
                                <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.content}</p>
                             </div>
                             
                             <div className="mb-6 flex flex-wrap gap-2">
                                {journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.tags.map(tag => (
                                   <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">#{tag}</Badge>
                                ))}
                             </div>

                             {/* Trade Performance (Average Price Comparison) - Moved Here */}
                             {journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))?.trades.length ? (
                                 <div className="pt-4 border-t border-border/50">
                                     <TradeFlowChart trades={journalEntries.find(j => j.date === format(selectedDate, 'yyyy-MM-dd'))!.trades} />
                                 </div>
                             ) : null}
                         </div>
                     ) : (
                         <div className="p-4 rounded-lg border border-dashed text-center text-muted-foreground text-sm">
                             작성된 일지가 없습니다.
                         </div>
                     )}
                 </div>
             )}
          </div>
          <div className="h-20" /> {/* Extra spacer for mobile scroll */}
        </ScrollArea>
      </div>
    </div>
  );
}
