import { useState, useMemo } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, isToday, parseISO, addDays, isSameDay, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Globe, Unlock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, RefreshCcw, CalendarDays, BrainCircuit, BookOpen, FlaskConical, Bell, Wallet, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Zap, X, Landmark, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MarketMoversCard } from './market-movers-card';
import { MarketOverviewCard } from './market-overview-card';
import { TopMoverSummaryCard } from './top-mover-summary-card';
import { AverageCryptoRsi } from './average-crypto-rsi';
import TrendComparisonChart from './trend-comparison-chart';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { Progress } from "@/components/ui/progress";
import InvestmentJournal from './investment-journal';
import EtfFlowTracker from './etf-flow-tracker';
import CorporateHoldingsChart from './corporate-holdings-chart';
import { Separator } from '@/components/ui/separator';
import MarketChart from './market-chart';
import DominanceChart from './dominance-chart';
import BitcoinDominance from './bitcoin-dominance';
import BtcFearGreedIndex from './btc-fear-greed-index';
import KimchiPremium from './kimchi-premium';
import BithumbVolume from './bithumb-volume';
import TechnicalAnalysis from './technical-analysis';
import SniperFeed, { allFeedItems } from './sniper-feed';
import MaxPainChart from './max-pain-chart';
import DexFuturesPositions from './dex-futures-positions';
import BithumbWhalePortfolio from './bithumb-whale-portfolio';

// ... existing types ...



const LabNavBar = ({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) => {
    // 1. Market Overview Group
    const marketOverviewItems = [
        { id: 'overview', label: '전체' },
        { id: 'fear-greed', label: '공포/탐욕' },
        { id: 'kimchi', label: '김치프리미엄' },
        { id: 'dominance', label: '도미넌스' },
        { id: 'volume', label: '거래대금' },
        { id: 'drop', label: 'MDD' },
        { id: 'stable', label: '스테이블' },
        { id: 'm2', label: '통화량' },
    ];

    // 2. Smart Money Group
    const smartMoneyItems = [
        { id: 'etf', label: 'ETF' },
        { id: 'dat', label: '기업보유' },
        { id: 'whale', label: '고래' },
    ];

    // Determine which items to show based on currentView
    const isSmartMoney = smartMoneyItems.some(item => item.id === currentView);
    const items = isSmartMoney ? smartMoneyItems : marketOverviewItems;
    
    return (
        <div className="w-full bg-background/95 backdrop-blur z-40 sticky top-0 py-1">
             <Carousel 
                opts={{ align: "start", dragFree: true }}
                className="w-full"
             >
                <CarouselContent className="-ml-2">
                    {items.map(item => (
                        <CarouselItem key={item.id} className="pl-2 basis-auto">
                            <button
                                onClick={() => onViewChange(item.id)}
                                className={`
                                    px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border whitespace-nowrap
                                    ${currentView === item.id 
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                        : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

// MarketBreadthCard removed - using MarketMoversCard instead for consistency


const DailySummary = () => (
  <Card className="bg-card border-border shadow-sm mb-6">
    <CardContent className="p-4">
      <h3 className="text-base font-bold flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-primary rounded-full" />
        24시간 요약
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <MarketMoversCard />
        <AverageCryptoRsi />
        <TopMoverSummaryCard type="gainer" />
        <TopMoverSummaryCard type="loser" />
      </div>
    </CardContent>
  </Card>
);

const LabDetailView = ({ viewType, onClose, onViewChange }: { viewType: string, onClose: () => void, onViewChange: (view: string) => void }) => {
    // Local state for internal tabs in detail views
    const [detailTab, setDetailTab] = useState<'status' | 'technical' | 'auxiliary'>('status');

    // Mock Data based on viewType
    const renderContent = () => {
        switch (viewType) {
            case 'alert':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <SniperFeed />
                    </div>
                );
            case 'status-detail':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         {/* 1. Custom Tab Navigation using LabNavBar/Pill style */}
                         <div className="w-full mb-2">
                             <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pl-0">
                                <button
                                    onClick={() => setDetailTab('status')}
                                    className={`
                                        px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border whitespace-nowrap
                                        ${detailTab === 'status' 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                        }
                                    `}
                                >
                                    현황
                                </button>
                                <button
                                    onClick={() => setDetailTab('auxiliary')}
                                    className={`
                                        px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border whitespace-nowrap
                                        ${detailTab === 'auxiliary' 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                        }
                                    `}
                                >
                                    보조지표
                                </button>
                                <button
                                    onClick={() => setDetailTab('technical')}
                                    className={`
                                        px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 border whitespace-nowrap
                                        ${detailTab === 'technical' 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                        }
                                    `}
                                >
                                    기술적분석
                                </button>
                             </div>
                        </div>

                        {/* Content based on tab */}
                        {detailTab === 'status' ? (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div className="grid grid-cols-2 gap-3">
                                    <MarketMoversCard />
                                    <AverageCryptoRsi />
                                    <TopMoverSummaryCard type="gainer" />
                                    <TopMoverSummaryCard type="loser" />
                                </div>
                                <TrendComparisonChart />
                            </div>
                        ) : detailTab === 'technical' ? (
                            <div className="animate-in fade-in duration-200">
                                <TechnicalAnalysis />
                            </div>
                        ) : (
                            <div className="space-y-2 animate-in fade-in duration-200">
                                <MarketChart />
                                <DominanceChart />
                            </div>
                        )}
                    </div>
                );
            case 'fear-greed':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* ... existing fear-greed content ... */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Main Indicator */}
                            <Card className="md:col-span-1 border-green-500/30 bg-green-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-green-500" />
                                        공포/탐욕 지수
                                    </CardTitle>
                                    <CardDescription>현재 시장 참여자들의 심리 상태입니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-4xl md:text-6xl font-black text-green-500 mb-2">65</div>
                                    <Badge className="bg-green-500 text-white text-base md:text-lg px-4 py-1 mb-4">GREED (탐욕)</Badge>
                                    <p className="text-muted-foreground">사람들이 매수에 적극적입니다.</p>
                                    <Progress value={65} className="h-4 mt-6 bg-green-950/20" indicatorClassName="bg-gradient-to-r from-green-600 to-green-400" />
                                </CardContent>
                            </Card>

                            {/* Right: How to use */}
                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        활용 가이드
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-red-500">극단적 공포 (0~20)</h4>
                                        <p className="text-xs text-muted-foreground">대중이 패닉에 빠져 투매가 나오는 구간입니다. <strong>역발상 매수(저점 매집)</strong>의 기회로 활용할 수 있습니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-green-500/20 bg-green-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-green-600">현재: 탐욕 (60~80)</h4>
                                        <p className="text-xs text-foreground">상승세가 지속되며 포모(FOMO)가 발생하기 시작합니다. <strong>추격 매수는 신중히</strong> 하고, 분할 매도로 수익을 실현하는 것을 고려하세요.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-green-500">극단적 탐욕 (80~100)</h4>
                                        <p className="text-xs text-muted-foreground">시장이 과열되었습니다. 곧 조정이 올 수 있으므로 <strong>현금 비중을 늘리는 것</strong>이 좋습니다.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                         {/* Chart Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    최근 3개월 추세
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { date: '10.01', value: 45 }, { date: '10.15', value: 30 }, { date: '11.01', value: 25 },
                                        { date: '11.15', value: 55 }, { date: '12.01', value: 70 }, { date: '12.15', value: 82 },
                                        { date: '01.01', value: 65 }
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} domain={[0, 100]} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                                        <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'kimchi':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1 border-indigo-500/30 bg-indigo-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                                        김치 프리미엄 (Kimchi Premium)
                                    </CardTitle>
                                    <CardDescription>국내 거래소(업비트)와 해외 거래소(바이낸스) 간의 가격 차이입니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-4xl md:text-6xl font-black text-indigo-500 mb-2">+1.38%</div>
                                    <Badge className="bg-indigo-500 text-white text-base md:text-lg px-4 py-1 mb-4">안정적</Badge>
                                    <p className="text-muted-foreground">국내 가격이 해외보다 약 1.38% 비쌉니다.</p>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        투자 포인트
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-green-500">역프리미엄 (-%) 발생 시</h4>
                                        <p className="text-xs text-muted-foreground">해외보다 국내가 더 쌉니다. <strong>매수 적기</strong>로 판단할 수 있습니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-indigo-600">적정 수준 (0~3%)</h4>
                                        <p className="text-xs text-foreground">시장 과열이 없는 상태입니다. 평소와 같은 매매를 지속하세요.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-red-500">과열 (5% 이상)</h4>
                                        <p className="text-xs text-muted-foreground">국내 매수세가 과열되었습니다. <strong>차익 실현(매도)</strong>을 고려하거나 해외로 재정거래를 할 수 있습니다.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'dominance':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1 border-orange-500/30 bg-orange-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-orange-500" />
                                        BTC 도미넌스
                                    </CardTitle>
                                    <CardDescription>전체 암호화폐 시가총액 중 비트코인이 차지하는 비율입니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-4xl md:text-6xl font-black text-orange-500 mb-2">54.2%</div>
                                    <Badge className="bg-orange-500 text-white text-base md:text-lg px-4 py-1 mb-4">비트코인 강세</Badge>
                                    <p className="text-muted-foreground">알트코인보다 비트코인으로 자금이 쏠리고 있습니다.</p>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        알트장은 언제 올까?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-muted/50 rounded-lg border border-orange-500/20 bg-orange-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-orange-600">도미넌스 상승 (현재)</h4>
                                        <p className="text-xs text-foreground">비트코인 독주 체제입니다. <strong>비트코인 위주로 포트폴리오</strong>를 구성하는 것이 안전합니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-green-500">도미넌스 하락 + BTC 가격 횡보</h4>
                                        <p className="text-xs text-muted-foreground">비트코인의 자금이 알트코인으로 이동하는 <strong>'알트 시즌'</strong>의 신호입니다. 이때 알트코인 매수를 적극 고려하세요.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'volume':
                 return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                        빗썸 거래대금
                                    </CardTitle>
                                    <CardDescription>국내 투자자들의 시장 참여 활성도를 나타냅니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-6xl font-black text-foreground mb-2">2.13조</div>
                                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 text-lg px-4 py-1 mb-4">▲ 전일 대비 급증</Badge>
                                    <p className="text-muted-foreground">시장이 매우 활발합니다.</p>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        해석 가이드
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-muted/50 rounded-lg border border-red-500/20 bg-red-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-red-600">거래대금 급증</h4>
                                        <p className="text-xs text-foreground">투자자들의 관심이 폭발하고 있습니다. 변동성이 커질 수 있으니 <strong>단기 매매 기회</strong>가 많아집니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-muted-foreground">거래대금 감소</h4>
                                        <p className="text-xs text-muted-foreground">시장 관심이 식어가고 있습니다. <strong>횡보장</strong>이 이어질 가능성이 높습니다.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'drop':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1 border-blue-500/30 bg-blue-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowDownRight className="w-5 h-5 text-blue-500" />
                                        BTC 고점 대비 낙폭 (MDD)
                                    </CardTitle>
                                    <CardDescription>비트코인 역대 최고가(ATH) 대비 현재 얼마나 떨어졌는지 보여줍니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-6xl font-black text-blue-500 mb-2">-30.6%</div>
                                    <Badge className="bg-blue-500 text-white text-lg px-4 py-1 mb-4">조정장 진행 중</Badge>
                                    <p className="text-muted-foreground">저점 매수의 기회일 수 있습니다.</p>
                                </CardContent>
                            </Card>
                             <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        매수 타이밍 잡기
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="p-3 bg-muted/50 rounded-lg border border-blue-500/20 bg-blue-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-blue-600">-20% ~ -30% 구간</h4>
                                        <p className="text-xs text-foreground">건전한 조정장입니다. <strong>분할 매수</strong>를 시작하기 좋은 구간입니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-red-500">-50% 이상 폭락</h4>
                                        <p className="text-xs text-muted-foreground">역사적인 저점 매수 기회입니다. 공포에 매수하는 <strong>용기가 필요한 시점</strong>입니다.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

             case 'stable':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1 border-green-500/30 bg-green-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-green-500" />
                                        스테이블코인 시가총액
                                    </CardTitle>
                                    <CardDescription>암호화폐 시장에 대기 중인 '매수 대기 자금'의 규모입니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-4xl md:text-6xl font-black text-green-500 mb-2">178B</div>
                                    <Badge className="bg-green-500 text-white text-base md:text-lg px-4 py-1 mb-4">자금 유입 중</Badge>
                                    <p className="text-muted-foreground">총알(매수세)이 계속 장전되고 있습니다.</p>
                                </CardContent>
                            </Card>
                             <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        시장 예측
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="p-3 bg-muted/50 rounded-lg border border-green-500/20 bg-green-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-green-600">시총 계속 상승 시</h4>
                                        <p className="text-xs text-foreground">외부 자금이 시장으로 들어오고 있다는 뜻입니다. <strong>장기적인 상승장</strong>의 강력한 시그널입니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-red-500">시총 하락 반전</h4>
                                        <p className="text-xs text-muted-foreground">자금이 시장을 이탈하고 있습니다. 하락장이 시작될 수 있으니 주의하세요.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            
             case 'm2':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Landmark className="w-5 h-5 text-primary" />
                                        M2 통화량 (Global Liquidity)
                                    </CardTitle>
                                    <CardDescription>전 세계에 풀린 돈의 양(유동성)을 나타냅니다.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="text-4xl md:text-6xl font-black text-foreground mb-2">4,100조</div>
                                    <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 text-base md:text-lg px-4 py-1 mb-4">▲ 유동성 증가</Badge>
                                    <p className="text-muted-foreground">돈이 풀리면 자산 가격(비트코인)은 오릅니다.</p>
                                </CardContent>
                            </Card>
                             <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500" />
                                        거시경제 해석
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="p-3 bg-muted/50 rounded-lg border border-green-500/20 bg-green-500/5">
                                        <h4 className="font-bold text-sm mb-1 text-green-600">통화량(M2) 증가</h4>
                                        <p className="text-xs text-foreground">중앙은행이 돈을 풀고 있습니다. 화폐 가치가 떨어지면서 비트코인 같은 <strong>자산 가격은 상승</strong>할 가능성이 높습니다.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <h4 className="font-bold text-sm mb-1 text-red-500">통화량 감소 (긴축)</h4>
                                        <p className="text-xs text-muted-foreground">시장에서 돈을 회수하고 있습니다. 자산 시장 전반에 <strong>하락 압력</strong>이 커집니다.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'etf':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <EtfFlowTracker />
                    </div>
                );

            case 'dat':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <CorporateHoldingsChart />
                    </div>
                );

            case 'whale':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2">
                        <MaxPainChart />
                        <DexFuturesPositions />
                        <BithumbWhalePortfolio />
                    </div>
                );
            
            default: // 'overview' or others
                return <MarketLabDashboard onClose={onClose} onViewChange={onViewChange} />;
        }
    };

    if (viewType === 'overview') {
        return <MarketLabDashboard onClose={onClose} onViewChange={onViewChange} />;
    }

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {['etf', 'dat', 'whale', 'status-detail', 'alert'].includes(viewType) ? (
                                <span className="text-indigo-500 flex items-center gap-1">
                                    Bithumb Lab
                                </span>
                            ) : (
                                <>
                                    {viewType === 'fear-greed' && <><Zap className="w-5 h-5 text-green-500" /> 공포/탐욕 지수 상세</>}
                                </>
                            )}
                        </h2>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                </Button>
            </div>
            
            {viewType !== 'status-detail' && viewType !== 'alert' && <LabNavBar currentView={viewType} onViewChange={onViewChange} />}

            <ScrollArea className="h-[calc(100vh-200px)] -mx-6 px-6 pb-20">
                {renderContent()}
            </ScrollArea>
        </div>
    );
}

// Rename existing Dashboard to avoid confusion, though we reuse it for 'overview'
// New Dashboard Component for Lab Mode
const MarketLabDashboard = ({ onClose, onViewChange }: { onClose: () => void, onViewChange: (view: string) => void }) => {
    return (
        <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-500">
                            Bithumb Lab
                        </h2>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                </Button>
            </div>

            <DailySummary />

            <LabNavBar currentView="overview" onViewChange={onViewChange} />

            <ScrollArea className="h-[calc(100vh-200px)] -mx-6 px-6">
                <div className="space-y-6 pb-20">

                    <MaxPainChart />
                    <DexFuturesPositions />

                    {/* 3. Detailed Signals Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-indigo-500" />
                                실시간 감지 시그널
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {[
                                    { time: '14:32:05', coin: 'BTC', type: 'whale_buy', message: '바이낸스 현물 500 BTC 매수 체결', impact: 'high' },
                                    { time: '14:28:10', coin: 'ETH', type: 'indicator', message: 'RSI(14) 30 하회 (과매도 진입)', impact: 'medium' },
                                    { time: '14:15:22', coin: 'SOL', type: 'whale_move', message: '코인베이스 → 익명지갑 150,000 SOL 이동', impact: 'high' },
                                    { time: '13:50:00', coin: 'XRP', type: 'volume', message: '전일 동시간 대비 거래량 300% 급증', impact: 'medium' },
                                    { time: '13:10:45', coin: 'DOGE', type: 'social', message: '트위터 언급량 급증 (Trending #1)', impact: 'low' },
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/40 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-mono text-muted-foreground w-16">{log.time}</span>
                                            <Badge variant={log.impact === 'high' ? 'destructive' : 'secondary'} className="w-16 justify-center">
                                                {log.coin}
                                            </Badge>
                                            <span className="text-sm">{log.message}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {log.impact === 'high' && <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
};


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


const allEvents: CalendarEvent[] = [
  // Today's events
  { id: 1, importance: 'high', country: 'us', date: format(new Date(), 'yyyy-MM-dd'), time: '22:30', event: '소비자물가지수(YoY) (12월)', category: 'economic', previous: '3.1%', consensus: '3.0%' },
  { 
      id: 2, 
      importance: 'medium', 
      date: format(new Date(), 'yyyy-MM-dd'), 
      time: '10:00', 
      event: 'SOL 락업해제', 
      category: 'unlock', 
      ticker: 'SOL',
      customData: {
        col1: { label: '해제물량', value: '34.2M' },
        col2: { label: '공급%', value: '7.4%' }
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
        col1: { label: '상태', value: '진행예정' },
        col2: { label: '예상시간', value: '4시간' }
      }
  },
  
  // Future events
  { id: 4, importance: 'high', country: 'us', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '22:30', event: '실업률 (12월)', category: 'economic' },
  
  // Past events
  { id: 5, importance: 'high', country: 'us', date: format(addDays(new Date(), -2), 'yyyy-MM-dd'), time: '04:00', event: 'Fed 금리결정', category: 'economic', actual: '3.75%', previous: '4.0%', consensus: '3.75%' },
  { id: 6, importance: 'high', country: 'us', date: format(addDays(new Date(), -7), 'yyyy-MM-dd'), time: '00:00', event: '근원 소비지출물가지수(MoM)', category: 'economic', actual: '0.2%', previous: '0.2%', consensus: '0.2%' },
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
    if (eventName.includes('Inflation') || eventName.includes('CPI') || eventName.includes('PCE') || eventName.includes('소비자물가지수') || eventName.includes('근원 소비지출물가지수')) {
        return MOCK_CPI_DATA;
    }
    if (eventName.includes('Interest Rate Decision') || eventName.includes('Fed 금리결정')) {
        return MOCK_INTEREST_RATE_DATA;
    }
    if (eventName.includes('Unemployment') || eventName.includes('실업률')) {
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
    if (ticker) {
        return (
            <img 
                src={`https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`}
                alt={ticker}
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        );
    }
    switch (category) {
        case 'economic':
            return country ? (
                <img 
                    src={`https://flagcdn.com/w40/${country}.png`}
                    alt={`${country} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm w-5 h-[15px] object-cover"
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
        high: 'bg-price-up',
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
                         <span className={`text-lg font-bold ${impactLevel === 'high' ? 'text-price-up' : 'text-foreground'}`}>
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
                        <div className="w-2 h-2 rounded-full bg-price-up"></div>
                        <span>실제값</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-0.5 border-t-2 border-dashed border-price-down"></div>
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
                    <div className="bg-background rounded-lg border border-l-4 border-l-price-up p-3 shadow-sm hover:translate-y-[-2px] transition-transform h-full">
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-foreground">
                                    예상치 <span className="text-foreground/80">상회</span>
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
                    <div className="bg-background rounded-lg border border-l-4 border-l-price-down p-3 shadow-sm hover:translate-y-[-2px] transition-transform h-full">
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-foreground">
                                    예상치 <span className="text-foreground/80">하회</span>
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
                                    impact.result === 'beat' ? 'text-price-up bg-price-up/10 border-price-up/20' : 
                                    impact.result === 'miss' ? 'text-price-down bg-price-down/10 border-price-down/20' : ''
                                }`}>
                                    {impact.result === 'beat' ? '예상 상회' : '예상 하회'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">발표 {impact.timeframe} 후</span>
                                <span className={`font-bold font-mono ${impact.btcMove > 0 ? 'text-price-up' : 'text-price-down'}`}>
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
                className={`grid grid-cols-[30px_1fr_auto] items-center gap-2 text-xs p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 border ${isOpen ? 'bg-muted/50 rounded-b-none border-border/50' : 'bg-background border-border/40 hover:border-border/60 hover:shadow-sm'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-[9px] font-mono">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
                    <div className="flex-shrink-0">
                        {getIconForCategory(event.category, event.country, event.ticker)}
                    </div>
                    <div className="flex-1 flex items-center gap-1 overflow-hidden min-w-0">
                         <span className="font-medium text-foreground truncate text-[10px] flex-1">
                            {event.event}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 text-right">
                    {event.customData ? (
                        <>
                            <div className="flex flex-col">
                                {event.customData.col1 && (
                                    <>
                                        <span className="text-[9px] text-muted-foreground scale-90 origin-right">{event.customData.col1.label}</span>
                                        <span className="font-code font-semibold mt-0.5 text-foreground text-[10px] scale-90 origin-right">{event.customData.col1.value}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col">
                                {event.customData.col2 && (
                                    <>
                                        <span className="text-[9px] text-muted-foreground scale-90 origin-right">{event.customData.col2.label}</span>
                                        <span className="font-code font-semibold mt-0.5 text-foreground text-[10px] scale-90 origin-right">{event.customData.col2.value}</span>
                                    </>
                                )}
                            </div>
                            {event.customData.col3 && (
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-muted-foreground scale-90 origin-right">{event.customData.col3.label}</span>
                                    <span className="font-code font-semibold mt-0.5 text-foreground text-[10px] scale-90 origin-right">{event.customData.col3.value}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-muted-foreground scale-90 origin-right">실제</span>
                                <span className={`font-code font-semibold mt-0.5 text-[10px] scale-90 origin-right ${
                                    event.actual && event.consensus 
                                    ? (parseFloat(event.actual) > parseFloat(event.consensus) ? 'text-price-up' : 'text-price-down')
                                    : 'text-foreground'
                                }`}>{event.actual ?? '--'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-muted-foreground scale-90 origin-right">예측</span>
                                <span className="font-code text-foreground font-semibold mt-0.5 text-[10px] scale-90 origin-right">{event.consensus ?? '--'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-muted-foreground scale-90 origin-right">이전</span>
                                <span className="font-code text-foreground font-semibold mt-0.5 text-[10px] scale-90 origin-right">{event.previous ?? '--'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isOpen && <EventDetailPanel event={event} />}
        </div>
    );
};


export default function EconomicCalendar() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeLabView, setActiveLabView] = useState<string | null>(null); // Refactored State
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dates = useMemo(() => generateDates(currentWeek), [currentWeek]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Control Sheet Open State

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentWeek(startOfWeek(date, { weekStartsOn: 1 }));
    setViewMode('day');
    setIsCalendarOpen(false);
  };
  
  // Enter Lab Mode Handler with View Type
  const handleEnterLabMode = (viewType: string = 'overview') => {
    // Just switch the mode. The Sheet will be unmounted as the parent view changes.
    // Using setTimeout to ensure the click event finishes bubbling before unmounting.
    setTimeout(() => {
        setActiveLabView(viewType);
        setIsSheetOpen(false);
    }, 100);
  };

  // Exit Lab Mode Handler
  const handleExitLabMode = () => {
    setActiveLabView(null);
  };

  // Back to Lab Overview (Sidebar)
  const handleBackToOverview = () => {
    setActiveLabView(null);
    // Use timeout to allow state transition before opening sheet
    setTimeout(() => {
        setIsSheetOpen(true);
    }, 50);
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

  const eventCategories: { id: EventCategory, label: string }[] = [
      { id: 'all', label: '전체' },
      { id: 'economic', label: '경제지표' },
      { id: 'unlock', label: '락업해제' },
      { id: 'bithumb', label: '빗썸' },
  ];

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {activeLabView ? (
          <LabDetailView viewType={activeLabView} onClose={handleBackToOverview} onViewChange={setActiveLabView} />
      ) : (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-none">
          <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" onClick={handleTodayClick}>Today</Button>
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
          
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300">
                    Lab
                </Button>
            </SheetTrigger>
        </div>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="pb-20">
                {viewMode === 'day' && (
                  <>
                    <div className="relative mb-6">
                        <Button variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 z-10" onClick={() => changeWeek('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="overflow-hidden px-10">
                            <div className="flex justify-between gap-1 pb-1">
                                {dates.map((date, index) => {
                                    const dateStr = format(date, 'yyyy-MM-dd');
                                    const hasEvent = allEvents.some(e => e.date === dateStr);
                                    
                                    return (
                                    <div key={index} className="flex-[1_1_0] min-w-0">
                                        <Button 
                                            variant="ghost"
                                            onClick={() => handleDateSelect(date)}
                                            className={`relative flex flex-col items-center h-auto w-full px-1 py-2 rounded-xl transition-all
                                              ${isSameDay(date, selectedDate) 
                                                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                                                  : isToday(date)
                                                      ? 'text-primary font-bold'
                                                      : 'text-muted-foreground hover:bg-background/50'
                                              }
                                            `}
                                        >
                                            <span className={`text-[10px] mb-0.5 ${isSameDay(date, selectedDate) ? 'text-primary-foreground/80' : ''}`}>{format(date, 'EEE', { locale: ko })}</span>
                                            <span className="text-lg font-bold">{format(date, 'd')}</span>
                                            
                                            {hasEvent && !isSameDay(date, selectedDate) && (
                                                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary/70" />
                                            )}
                                            {hasEvent && isSameDay(date, selectedDate) && (
                                                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white" />
                                            )}
                                        </Button>
                                    </div>
                                )})}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 z-10" onClick={() => changeWeek('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <DailySummary />
                  </>
                )}


                {/* Major Schedule Card */}
                <Card className="bg-card border-border shadow-sm mb-6 overflow-hidden">
                  <CardContent className="p-0">
                      <div className="p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                          <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                  <h3 className="text-base font-bold flex items-center gap-2">
                                      <div className="w-1 h-4 bg-primary rounded-full" />
                                      주요 일정
                                  </h3>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                  <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as EventCategory)} className="scale-90 origin-left">
                                      <TabsList className="h-8">
                                          {eventCategories.map(cat => (
                                              <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-2 h-6">{cat.label}</TabsTrigger>
                                          ))}
                                      </TabsList>
                                  </Tabs>
                                  
                                  {viewMode !== 'all' && (
                                  <div className="h-8 bg-muted rounded-lg p-1 flex items-center ml-auto scale-90 origin-right">
                                      <button
                                          onClick={() => setViewMode('all')}
                                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 h-6 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                      >
                                          펼쳐보기
                                      </button>
                                  </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="p-4 space-y-6">
                          {Object.keys(groupedEvents).length > 0 ? (
                              Object.entries(groupedEvents).map(([dateStr, events]) => {
                                  const parsedDate = parseISO(dateStr);
                                  if (isNaN(parsedDate.getTime())) return null;
                                  return (
                                      <div key={dateStr} className="mb-6">
                                          {viewMode === 'all' && (
                                              <h3 className="font-bold text-sm mb-2 sticky top-0 bg-background py-2 z-10 border-b border-border/50">
                                              {format(parsedDate, 'M월 d일 (EEE)', { locale: ko })}
                                              </h3>
                                          )}
                                          <div className="space-y-1.5">
                                          {events.map(event => <EventRow key={event.id} event={event} viewMode={viewMode} />)}
                                          </div>
                                      </div>
                                  )
                              })
            ) : (
                <div className="flex items-center justify-center h-20 mb-8">
                    <p className="text-xs text-muted-foreground">선택한 날짜에 예정된 이벤트가 없습니다.</p>
                </div>
            )}
                    </div>
                </CardContent>
              </Card>

              {/* Investment Journal Card - Separated */}
              {viewMode === 'day' && (
                 <Card className="bg-background border-border shadow-sm">
                     <CardContent className="p-4">
                         <InvestmentJournal selectedDate={selectedDate} />
                     </CardContent>
                 </Card>
              )}
          </div>
      </ScrollArea>
      </div>
      )}

      <SheetContent className="w-[320px] sm:w-[380px] overflow-y-auto">
          <SheetHeader className="mb-4">
              <SheetTitle className="flex items-center gap-2 text-indigo-600 text-lg">
                  Bithumb Lab
              </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
              {/* 1. Market Status Section (Sidebar Only) */}
              <section className="space-y-3">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <div className="w-1 h-3 bg-primary/70 rounded-full" />
                          마켓
                      </h3>
                      <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1" onClick={() => handleEnterLabMode('status-detail')}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <BitcoinDominance />
                      <BtcFearGreedIndex />
                      <KimchiPremium />
                      <BithumbVolume />
                  </div>
              </section>

              {/* 2. Market Overview Section removed as per user request */}
              
              <Separator />

              {/* 3. Smart Money Section */}
              <section className="space-y-3">
                  <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <div className="w-1 h-3 bg-primary/70 rounded-full" />
                          스마트머니
                      </h3>
                      <Button variant="ghost" size="icon" className="h-5 w-5 -mr-1" onClick={() => handleEnterLabMode('etf')}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                  </div>
                  
                  <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                      <CarouselContent className="-ml-2">
                          {/* ETF Button */}
                          <CarouselItem className="pl-2 basis-[32%] sm:basis-[30%]">
                              <div 
                                  className="h-full p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer flex flex-col justify-between"
                                  onClick={() => handleEnterLabMode('etf')}
                              >
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
                                          <BarChart3 className="w-4 h-4" />
                                      </div>
                                  </div>
                                  <div>
                                      <div className="text-[9px] font-bold mb-0.5">ETF (기관)</div>
                                      <div className="text-[8px] text-muted-foreground">현물 ETF 유입</div>
                                  </div>
                              </div>
                          </CarouselItem>

                          {/* DAT Button */}
                          <CarouselItem className="pl-2 basis-[32%] sm:basis-[30%]">
                              <div 
                                  className="h-full p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer flex flex-col justify-between"
                                  onClick={() => handleEnterLabMode('dat')}
                              >
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
                                          <Landmark className="w-4 h-4" />
                                      </div>
                                  </div>
                                  <div>
                                      <div className="text-[9px] font-bold mb-0.5">DAT (기업)</div>
                                      <div className="text-[8px] text-muted-foreground">기업 보유량</div>
                                  </div>
                              </div>
                          </CarouselItem>
                          
                          {/* Whale Button */}
                          <CarouselItem className="pl-2 basis-[32%] sm:basis-[30%]">
                              <div 
                                  className="h-full p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer flex flex-col justify-between"
                                  onClick={() => handleEnterLabMode('whale')}
                              >
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                                          <Wallet className="w-4 h-4" />
                                      </div>
                                  </div>
                                  <div>
                                      <div className="text-[9px] font-bold mb-0.5">Whale (고래)</div>
                                      <div className="text-[8px] text-muted-foreground">온체인 큰손 동향</div>
                                  </div>
                              </div>
                          </CarouselItem>
                      </CarouselContent>
                  </Carousel>
              </section>

              <Separator />

              {/* 4. Notification Section */}
              <section className="space-y-3">
                  <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <div className="w-1 h-3 bg-primary/70 rounded-full" />
                          알림
                      </h3>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleEnterLabMode('alert')}>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Button>
                  </div>
                  
                  <div className="grid gap-1.5">
                      {allFeedItems.slice(0, 3).map((item, i) => {
                          const isWhale = item.type.includes('whale');
                          const isSurge = item.type.endsWith('_surge');
                          const isDip = item.type.endsWith('_dip');
                          const level = (isWhale || isSurge) ? 'info' : isDip ? 'warning' : 'info';
                          
                          let title = "";
                          let desc = "";
                          
                          if (isWhale) {
                              title = `${item.ticker} 고래 ${item.type === 'whale_buy' ? '매수' : '매도'} 포착`;
                              desc = item.description;
                          } else if (item.type.startsWith('price_')) {
                              title = `${item.ticker} 시세 ${isSurge ? '급등' : '급락'}`;
                              desc = item.description;
                          } else if (item.type.startsWith('volume_')) {
                              title = `${item.ticker} 거래량 ${isSurge ? '급증' : '급락'}`;
                              desc = item.description;
                          } else {
                              title = `${item.ticker} ${item.type}`;
                              desc = item.description;
                          }

                          return (
                          <div key={i} className="flex gap-2.5 p-2.5 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer" onClick={() => handleEnterLabMode('alert')}>
                              <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-none ${level === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                              <div className="flex-1 space-y-0.5">
                                  <div className="flex justify-between items-start">
                                      <p className="text-xs font-medium leading-none">{title}</p>
                                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                              </div>
                          </div>
                      )})}
                  </div>
              </section>
          </div>
      </SheetContent>
    </Sheet>
  );
}
