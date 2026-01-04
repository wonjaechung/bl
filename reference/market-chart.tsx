'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronDown, Check, Activity, Calculator, ArrowRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allCoins = [
    { value: 'BTC', label: '비트코인', price: 87800000, satoshi: 1.00, marketCap: 1723456700000000, change: 0.86, vwapPosition: 45 },
    { value: 'ETH', label: '이더리움', price: 4500000, satoshi: 0.051, marketCap: 543210900000000, change: 1.23, vwapPosition: 55 },
    { value: 'XRP', label: '리플', price: 700, satoshi: 0.000008, marketCap: 38000000000000, change: -0.52, vwapPosition: 35 },
    { value: 'SOL', label: '솔라나', price: 230000, satoshi: 0.0026, marketCap: 100000000000000, change: 2.15, vwapPosition: 60 },
    { value: 'DOGE', label: '도지코인', price: 210, satoshi: 0.0000024, marketCap: 30000000000000, change: -1.10, vwapPosition: 40 },
    { value: 'ADA', label: '에이다', price: 650, satoshi: 0.0000074, marketCap: 22000000000000, change: 0.45, vwapPosition: 42 },
    { value: 'AVAX', label: '아발란체', price: 45000, satoshi: 0.00051, marketCap: 18000000000000, change: 3.21, vwapPosition: 70 },
    { value: 'DOT', label: '폴카닷', price: 9800, satoshi: 0.00011, marketCap: 14000000000000, change: -0.23, vwapPosition: 30 },
    { value: 'SHIB', label: '시바이누', price: 0.025, satoshi: 0.00000000028, marketCap: 15000000000000, change: 5.12, vwapPosition: 80 },
    { value: 'LINK', label: '체인링크', price: 21000, satoshi: 0.00024, marketCap: 12000000000000, change: 1.50, vwapPosition: 58 },
]

const generateData = (coin: typeof allCoins[0], chartType: '원화' | '사토시' | '시가총액', timeframe: string) => {
    const data = [];
    let baseValue;
    switch(chartType) {
        case '원화': baseValue = coin.price; break;
        case '사토시': baseValue = coin.satoshi; break;
        case '시가총액': baseValue = coin.marketCap; break;
    }

    let points = 24;
    let variation = 0.05;

    switch(timeframe) {
        case '24h': points = 24; variation = 0.02; break;
        case '7D': points = 28; variation = 0.10; break;
        case '30D': points = 30; variation = 0.15; break;
        case '90D': points = 90; variation = 0.25; break;
        case '1Y': points = 52; variation = 0.40; break;
        case 'All': points = 60; variation = 0.60; break;
    }

    for (let i = 0; i < points; i++) {
        const date = new Date();
        if (timeframe === '24h') {
             date.setHours(date.getHours() - (points - 1 - i));
        } else if (timeframe === '7D') {
             date.setHours(date.getHours() - (points - 1 - i) * 6); 
        } else if (timeframe === '30D' || timeframe === '90D') {
             date.setDate(date.getDate() - (points - 1 - i));
        } else if (timeframe === '1Y') {
             date.setDate(date.getDate() - (points - 1 - i) * 7);
        } else {
             date.setMonth(date.getMonth() - (points - 1 - i));
        }

        let value = baseValue * (1 + (Math.random() - 0.5) * variation);
        if (i === points - 1) value = baseValue;

        let timeLabel = '';
        if (timeframe === '24h') {
            timeLabel = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        } else if (timeframe === '1Y' || timeframe === 'All') {
            timeLabel = date.toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric' });
        } else {
             timeLabel = date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
        }
        
        data.push({
            time: timeLabel,
            value: value
        });
    }
    return data;
};

const TimeframeButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={`px-3 py-1 h-auto text-sm rounded-full ${
            active ? 'bg-zinc-700 text-white' : 'text-zinc-400'
        }`}
    >
        {children}
    </Button>
);

const ChartTypeButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={`flex-1 rounded-md text-sm ${
            active ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'
        }`}
    >
        {children}
    </Button>
);

const formatRangeValue = (value: number, type: '원화' | '사토시' | '시가총액') => {
    if (type === '사토시') return `${value.toFixed(8)} BTC`;
    if (type === '시가총액') {
        if (value >= 1000000000000) return `${(value / 1000000000000).toFixed(2)}조`;
        if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억원`;
        return `${value.toLocaleString()}원`;
    }
    return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;
};

const RangeBar = ({ vwapPosition, showVwap, currentPosition, lowPrice, highPrice, activeChartType } : { vwapPosition: number, showVwap: boolean, currentPosition: number, lowPrice: number, highPrice: number, activeChartType: '원화' | '사토시' | '시가총액' }) => (
    <div className="w-full relative h-10 mt-4">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded-full w-full absolute top-1/2 -translate-y-1/2" />
        
        {showVwap && (
            <div className="absolute bottom-full" style={{ left: `${vwapPosition}%`}}>
               <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500 transform -translate-x-1/2 translate-y-1.5"></div>
               <span className="text-xs text-zinc-400 absolute left-1/2 -translate-x-1/2 whitespace-nowrap bottom-full mb-1">평균매수가격</span>
            </div>
        )}
        
        <div className="absolute top-full" style={{ left: `${currentPosition}%`}}>
           <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-500 transform -translate-x-1/2 -translate-y-1.5"></div>
           <span className="text-xs text-zinc-400 absolute left-1/2 -translate-x-1/2 whitespace-nowrap top-full mt-1">현재위치</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-400 absolute w-full" style={{ top: 'calc(50% + 0.75rem)' }}>
            <div className="flex flex-col items-start">
                <span>{formatRangeValue(lowPrice, activeChartType)}</span>
                <span className="text-[10px] text-zinc-600 mt-0.5">저가</span>
            </div>
            <div className="flex flex-col items-end">
                <span>{formatRangeValue(highPrice, activeChartType)}</span>
                <span className="text-[10px] text-zinc-600 mt-0.5">고가</span>
            </div>
        </div>
    </div>
);


// Mock User Portfolio Data (In a real app, this would come from an API/Context)
const mockUserPortfolio: Record<string, { avgPrice: number; holdings: number }> = {
    'BTC': { avgPrice: 85000000, holdings: 0.15 },
    'ETH': { avgPrice: 4800000, holdings: 2.5 },
    'XRP': { avgPrice: 850, holdings: 5000 },
    'SOL': { avgPrice: 120000, holdings: 150 },
    'DOGE': { avgPrice: 150, holdings: 10000 },
};

const CalculatorDialog = ({ 
    activeChartType, 
    selectedCoin, 
    allCoins 
}: { 
    activeChartType: '원화' | '사토시' | '시가총액', 
    selectedCoin: typeof allCoins[0],
    allCoins: typeof allCoins
}) => {
    // KRW States
    const [avgPrice, setAvgPrice] = useState<string>('');
    const [holdings, setHoldings] = useState<string>('');
    const [buyPrice, setBuyPrice] = useState<string>(selectedCoin.price.toFixed(0));
    const [buyAmount, setBuyAmount] = useState<string>('');

    // Satoshi States
    const [satoshiMode, setSatoshiMode] = useState<'investment' | 'holding'>('investment');
    const [investKrw, setInvestKrw] = useState<string>('1000000');
    const [targetSatMult, setTargetSatMult] = useState<number>(1.0); // 1x default
    const [btcChangePct, setBtcChangePct] = useState<number>(0);

    // Market Cap States
    const [targetRankCoin, setTargetRankCoin] = useState<string>('ETH');
    const [mcHoldings, setMcHoldings] = useState<string>(() => {
        const userAsset = mockUserPortfolio[selectedCoin.value];
        return userAsset ? userAsset.holdings.toString() : '';
    });

    // Load portfolio data when coin changes
    useEffect(() => {
        setBuyPrice(selectedCoin.price.toFixed(0));
        setTargetSatMult(1.0); // Reset slider to 1.0 (Current Price)
        
        const userAsset = mockUserPortfolio[selectedCoin.value];
        if (userAsset) {
            setAvgPrice(userAsset.avgPrice.toString());
            setHoldings(userAsset.holdings.toString());
            setMcHoldings(userAsset.holdings.toString());
        } else {
            // Default empty if no position
            setAvgPrice('');
            setHoldings('');
            setMcHoldings('');
        }
    }, [selectedCoin]);

    // KRW Calculation
    const krwResult = useMemo(() => {
        const currentAvg = parseFloat(avgPrice) || 0;
        const currentQty = parseFloat(holdings) || 0;
        const newPrice = parseFloat(buyPrice) || 0;
        const newQty = parseFloat(buyAmount) || 0;

        if (currentQty + newQty === 0) return null;

        const totalCost = (currentAvg * currentQty) + (newPrice * newQty);
        const totalQty = currentQty + newQty;
        const newAvg = totalCost / totalQty;
        const currentPrice = selectedCoin.price;
        const breakEven = ((newAvg - currentPrice) / currentPrice) * 100;

        return { newAvg, totalQty, totalCost, breakEven };
    }, [avgPrice, holdings, buyPrice, buyAmount, selectedCoin.price]);

    // Satoshi Calculation
    const satResult = useMemo(() => {
        const btcCoin = allCoins.find(c => c.value === 'BTC');
        const btcPrice = btcCoin ? btcCoin.price : 100000000;
        
        // Common Data
        // Calculate dynamic satoshi price based on current KRW prices
        // This ensures consistency even if selectedCoin.price updates dynamically (e.g. from API) while satoshi field in allCoins remains static
        const currentSat = selectedCoin.value === 'BTC' ? 1.0 : (selectedCoin.price / btcPrice);
        const targetSat = currentSat * targetSatMult;
        const futureBtcPrice = btcPrice * (1 + btcChangePct / 100);

        if (satoshiMode === 'investment') {
            const investment = parseFloat(investKrw) || 0;
            // 1. Buy BTC directly
            const btcDirect = investment / btcPrice;
            // 2. Buy Alt -> Sell at Target Sat
            const altQty = investment / selectedCoin.price;
            const btcViaAlt = altQty * targetSat; 
            
            const gain = btcViaAlt - btcDirect;
            const gainPct = btcDirect > 0 ? ((btcViaAlt - btcDirect) / btcDirect) * 100 : 0;
            const finalKrwValue = btcViaAlt * futureBtcPrice;

            return { btcDirect, btcViaAlt, gain, gainPct, targetSat, currentSat, finalKrwValue, altQty };
        } else {
            // Holding Mode (Alt Accumulation Strategy: Sell Now -> Buy Back at Target)
            const qty = parseFloat(holdings) || 0;
            
            // 1. Sell All Now -> Get BTC
            const btcFromSellNow = qty * currentSat;
            
            // 2. Buy Back at Target -> Get New Qty
            // Target Sat is the price we buy back at.
            const newQty = targetSat > 0 ? btcFromSellNow / targetSat : 0;
            
            const gain = newQty - qty; // Gain in Alts
            const gainPct = qty > 0 ? ((newQty - qty) / qty) * 100 : 0;
            
            // KRW Value if we successfully execute this (New Qty * Target Price * Future BTC Price?)
            // No, strictly speaking:
            // We have `newQty` Alts.
            // Value in KRW = newQty * (TargetSat * FutureBtcPrice).
            const finalKrwValue = newQty * targetSat * futureBtcPrice; 
            
            // If we just held:
            // Value = qty * (TargetSat * FutureBtcPrice) ?
            // No, usually we compare vs "Hold".
            // If we hold, we have `qty`. Price goes to `targetSat`.
            // Value = qty * targetSat * futureBtcPrice.
            // Wait, if price DROPS (0.5x), "Holding" loses value.
            // "Strategy" preserves BTC value (since we sold), so we can buy more Alts.
            
            return { btcFromSellNow, newQty, gain, gainPct, targetSat, currentSat, finalKrwValue, qty };
        }
    }, [investKrw, targetSatMult, selectedCoin, allCoins, btcChangePct, satoshiMode, holdings]);

    // Market Cap Calculation
    const mcResult = useMemo(() => {
        const target = allCoins.find(c => c.value === targetRankCoin);
        if (!target) return null;

        // Target Market Cap / Current Circulating Supply (derived from MC/Price)
        const currentSupply = selectedCoin.marketCap / selectedCoin.price;
        const targetPrice = target.marketCap / currentSupply;
        
        const upside = ((targetPrice - selectedCoin.price) / selectedCoin.price) * 100;
        const myBalance = (parseFloat(mcHoldings) || 0) * targetPrice;

        return { targetPrice, upside, myBalance, targetName: target.label };
    }, [targetRankCoin, selectedCoin, mcHoldings, allCoins]);

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    {activeChartType === '원화' && '물타기/평단 계산기'}
                    {activeChartType === '사토시' && (satoshiMode === 'investment' ? 'BTC 갯수 늘리기' : '알트코인 갯수 늘리기')}
                    {activeChartType === '시가총액' && '행복회로 시뮬레이터'}
                </DialogTitle>
                <DialogDescription className="text-left">
                    {activeChartType === '원화' && '추가 매수 시 평단가 변화를 계산해보세요.'}
                    {activeChartType === '사토시' && (satoshiMode === 'investment' ? '알트코인 투자로 비트코인을 얼마나 늘릴 수 있을까요?' : '고점 매도/저점 매수로 보유 수량을 늘려보세요.')}
                    {activeChartType === '시가총액' && `${selectedCoin.label}이(가) 다른 코인만큼 성장한다면?`}
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                {activeChartType === '원화' && (
                    <div className="space-y-4">
                        {mockUserPortfolio[selectedCoin.value] ? (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <RefreshCcw className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-sm text-blue-400 font-bold block">빗썸 자산 연동됨</span>
                                            <span className="text-[10px] text-muted-foreground block">
                                                보유중인 {selectedCoin.value} 자산을 불러왔습니다
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-muted-foreground block mb-1">총 평가금액</span>
                                        <span className="text-xl font-bold text-white tracking-tight">
                                            {((parseFloat(avgPrice) * parseFloat(holdings)) / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/20">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">평균단가</span>
                                        <span className="text-lg font-bold text-blue-100">{parseFloat(avgPrice).toLocaleString()}원</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-end gap-2 text-right">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">보유수량</span>
                                        <span className="text-lg font-bold text-blue-100">{parseFloat(holdings).toLocaleString()} {selectedCoin.value}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>현재 평단가</Label>
                                    <Input type="number" value={avgPrice} onChange={e => setAvgPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>보유 수량</Label>
                                    <Input type="number" value={holdings} onChange={e => setHoldings(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                            <div className="space-y-2">
                                <Label className="text-primary text-xs">추가 매수가</Label>
                                <Input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-primary text-xs">추가 수량</Label>
                                <Input type="number" value={buyAmount} onChange={e => setBuyAmount(e.target.value)} />
                            </div>
                        </div>
                        
                        {krwResult && (
                            <div className="bg-muted p-4 rounded-lg space-y-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">예상 평단가</span>
                                    <span className="font-bold text-lg text-primary">{krwResult.newAvg.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        {krwResult.breakEven > 0 ? '원금 회복까지' : '현재 수익률'}
                                    </span>
                                    <span className={`font-bold ${krwResult.breakEven > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {krwResult.breakEven > 0 ? '+' : ''}{krwResult.breakEven > 0 ? krwResult.breakEven.toFixed(2) : (krwResult.breakEven * -1).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/50">
                                    <span>총 보유량 {krwResult.totalQty} {selectedCoin.value}</span>
                                    <span>총 투자금 {(krwResult.totalCost / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원</span>
                                </div>
                                <div className="flex gap-2 mt-2 w-full">
                                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-10 text-xs sm:text-sm px-1">
                                        {selectedCoin.value} 추가 매수하기
                                    </Button>
                                    <Button className="flex-1 bg-[#26A17B] hover:bg-[#26A17B]/90 text-white font-bold h-10 text-xs sm:text-sm px-1">
                                        USDT 대여 후 {selectedCoin.value} 매수하기
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeChartType === '사토시' && (
                    <div className="space-y-6">
                        {selectedCoin.value === 'BTC' ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>비트코인은 기준 통화이므로 <br/>사토시 차트 분석이 필요하지 않습니다.</p>
                                <p className="text-xs mt-2">알트코인을 선택해서 분석해보세요!</p>
                            </div>
                        ) : (
                            <Tabs defaultValue="investment" className="w-full" onValueChange={(v) => {
                                setSatoshiMode(v as any);
                                setTargetSatMult(1.0);
                            }}>
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="investment">신규 투자</TabsTrigger>
                                    <TabsTrigger value="holding">보유량 늘리기</TabsTrigger>
                                </TabsList>

                                <TabsContent value="investment" className="space-y-6">
                                    {/* 1. Investment Input & Baseline */}
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label>투자할 원화 금액</Label>
                                            <Input type="number" value={investKrw} onChange={e => setInvestKrw(e.target.value)} placeholder="1000000" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-zinc-800/50 p-2 rounded-lg border border-border/50 text-xs text-center">
                                                <span className="text-muted-foreground block mb-1">비트코인 대신 {selectedCoin.value} 매수 시</span>
                                                <span className="font-mono font-bold block text-primary text-sm">{satResult.altQty?.toFixed(2)} {selectedCoin.value} 확보</span>
                                            </div>
                                            <div className="rounded-lg border border-transparent"></div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="holding" className="space-y-6">
                                     <div className="space-y-3">
                                        {mockUserPortfolio[selectedCoin.value] ? (
                                             <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                        <RefreshCcw className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-blue-400 font-bold">빗썸 자산 연동됨</span>
                                                        <span className="text-[10px] text-muted-foreground">보유중인 {selectedCoin.label} 자산을 불러왔습니다</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-white block">
                                                        {parseFloat(holdings).toLocaleString()} {selectedCoin.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <Label>보유 수량 ({selectedCoin.value})</Label>
                                                <Input type="number" value={holdings} onChange={e => setHoldings(e.target.value)} placeholder="0" />
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-zinc-800/50 p-2 rounded-lg border border-border/50 text-xs text-center">
                                                <span className="text-muted-foreground block mb-1">현재가 매도 시</span>
                                                <span className="font-mono font-bold block text-primary text-sm">{satResult.btcFromSellNow?.toFixed(8) || 0} BTC 확보</span>
                                            </div>
                                            <div className="rounded-lg border border-transparent"></div>
                                        </div>
                                     </div>
                                </TabsContent>

                                {/* Shared Sliders & Result */}
                                <div className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <Label>{selectedCoin.value} {satoshiMode === 'investment' ? '목표 상승률' : '재매수 목표가'}</Label>
                                                <span className="text-xs text-muted-foreground">사토시 차트 기준</span>
                                            </div>
                                            <span className="text-lg font-bold text-primary">{(targetSatMult - 1) * 100 >= 0 ? '+' : ''}{((targetSatMult - 1) * 100).toFixed(0)}% <span className="text-xs font-normal text-muted-foreground">({satResult.targetSat.toFixed(8)} BTC)</span></span>
                                        </div>
                                        <Slider 
                                            value={[targetSatMult]} 
                                            min={satoshiMode === 'investment' ? 1.0 : 0.1} 
                                            max={satoshiMode === 'investment' ? 5.0 : 1.0} 
                                            step={0.01} 
                                            onValueChange={(v) => setTargetSatMult(v[0])} 
                                            dir={satoshiMode === 'holding' ? 'rtl' : 'ltr'}
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                                            {satoshiMode === 'investment' ? (
                                                <>
                                                    <span>현재가</span>
                                                    <span>3배(+200%)</span>
                                                    <span>5배(+400%)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>현재가</span>
                                                    <span>-50%</span>
                                                    <span>-90%</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bitcoin Slider Removed for Simplicity based on user feedback */}
                                    {/* 
                                    {satoshiMode === 'investment' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <Label>비트코인 목표 변동률</Label>
                                                    <span className="text-xs text-muted-foreground">원화 차트 기준</span>
                                                </div>
                                                <span className={`text-lg font-bold ${btcChangePct >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {btcChangePct >= 0 ? '+' : ''}{btcChangePct}%
                                                </span>
                                            </div>
                                            <Slider 
                                                value={[btcChangePct]} 
                                                min={-50} 
                                                max={100} 
                                                step={5} 
                                                onValueChange={(v) => setBtcChangePct(v[0])} 
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                                <span>-50%</span>
                                                <span>0%</span>
                                                <span>+50%</span>
                                                <span>+100%</span>
                                            </div>
                                        </div>
                                    )} 
                                    */}
                                </div>

                                <div className="bg-muted p-4 rounded-lg space-y-4 border-2 border-primary/10 mt-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                            <span className="text-sm text-muted-foreground">
                                                {satoshiMode === 'investment' ? `${selectedCoin.value} 매도 후 비트코인 구매 시` : `BTC 매도 후 ${selectedCoin.value} 재매수 시`}
                                            </span>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-primary block">
                                                    {satoshiMode === 'investment' ? `${satResult.btcViaAlt?.toFixed(8)} BTC` : `${satResult.newQty?.toFixed(2)} ${selectedCoin.value}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-sm text-muted-foreground">
                                                {satoshiMode === 'investment' ? '그냥 비트코인 샀을 때보다' : '그냥 존버했을 때보다'}
                                            </span>
                                            <div className="text-right">
                                                <span className={`block font-bold ${satResult.gain > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                    {satResult.gain > 0 ? '+' : ''}{satoshiMode === 'investment' ? satResult.gain?.toFixed(8) : satResult.gain?.toFixed(2)} {satoshiMode === 'investment' ? 'BTC' : selectedCoin.value}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 mt-4 w-full">
                                            <Button className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-10 text-xs sm:text-sm px-1">
                                                {satoshiMode === 'investment' ? `${selectedCoin.value} 매수하기` : `${selectedCoin.value} 매도하기`}
                                            </Button>
                                            <Button className="flex-1 bg-[#26A17B] hover:bg-[#26A17B]/90 text-white font-bold h-10 text-xs sm:text-sm px-1">
                                                {satoshiMode === 'investment' ? `BTC 대여 후 ${selectedCoin.value} 매수하기` : `${selectedCoin.value} 대여 후 매도하기`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Tabs>
                        )}
                    </div>
                )}

                {activeChartType === '시가총액' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>비교할 대상 코인</Label>
                            <div className="flex flex-wrap gap-2">
                                {allCoins.filter(c => c.value !== selectedCoin.value).map(coin => (
                                    <Badge 
                                        key={coin.value}
                                        variant={targetRankCoin === coin.value ? "default" : "outline"}
                                        className="cursor-pointer hover:bg-primary/20"
                                        onClick={() => setTargetRankCoin(coin.value)}
                                    >
                                        {coin.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {mcResult && (
                            <div className="bg-muted/50 p-6 rounded-xl border border-border text-center space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                                
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {selectedCoin.label}이(가) <span className="font-bold text-foreground">{mcResult.targetName}</span> 시총이 되면
                                    </p>
                                    <div className="flex items-end justify-center gap-2">
                                        <span className="text-3xl font-bold text-primary">
                                            {mcResult.targetPrice.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원
                                        </span>
                                    </div>
                                    <Badge variant="secondary" className="mt-2 text-green-600 bg-green-500/10 hover:bg-green-500/20">
                                        현재가 대비 +{mcResult.upside.toLocaleString(undefined, { maximumFractionDigits: 0 })}% 상승 필요
                                    </Badge>
                                </div>

                                <div className="pt-4 border-t border-border/50">
                                    {mockUserPortfolio[selectedCoin.value] ? (
                                        <div className="mb-4">
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                        <RefreshCcw className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-xs text-blue-400 font-bold">빗썸 자산 연동됨</span>
                                                        <span className="text-[10px] text-muted-foreground">보유중인 {selectedCoin.label} 자산을 불러왔습니다</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-white block">
                                                        {(parseFloat(mcHoldings) || 0).toLocaleString()} {selectedCoin.value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mb-2">
                                            <Input 
                                                placeholder="보유 수량 입력..." 
                                                className="h-8 text-center" 
                                                value={mcHoldings}
                                                onChange={e => setMcHoldings(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">{mockUserPortfolio[selectedCoin.value] ? '현재 보유 수량 기준 예상 평가금액' : '개 보유 시 예상 평가금액'}</p>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        {mockUserPortfolio[selectedCoin.value] && (
                                            <>
                                                 <span className="text-lg font-bold text-muted-foreground line-through decoration-zinc-500/50">
                                                    {(parseFloat(mcHoldings) * selectedCoin.price / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                            </>
                                        )}
                                        <span className="text-2xl font-bold text-primary">
                                            {mcResult.myBalance > 0 
                                                ? `${Math.round(mcResult.myBalance / 10000).toLocaleString()}만원`
                                                : '-'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DialogContent>
    );
};

export default function MarketChart() {
    const [activeTimeframe, setActiveTimeframe] = useState('7D');
    const [activeChartType, setActiveChartType] = useState<'원화' | '사토시' | '시가총액'>('원화');
    const [selectedCoin, setSelectedCoin] = useState(allCoins.find(c => c.value === 'XRP') || allCoins[0]);
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedCoin.value === 'XRP' && activeChartType === '원화') {
                try {
                    const res = await fetch(`/api/xrp-metrics?timeframe=${activeTimeframe}`);
                    if (res.ok) {
                        const data = await res.json();
                        setChartData(data);
                        
                        // Update current price to match the latest data point
                        if (data.length > 0) {
                             const latestPrice = data[data.length - 1].value;
                             setSelectedCoin(prev => {
                                 if (prev.value === 'XRP' && prev.price !== latestPrice) {
                                     return { ...prev, price: latestPrice };
                                 }
                                 return prev;
                             });
                        }
                        return;
                    }
                } catch (e) {
                    console.error("Failed to fetch XRP data", e);
                }
            }
            
            // Fallback to generated data
            setChartData(generateData(selectedCoin, activeChartType, activeTimeframe));
        };

        fetchData();
    }, [selectedCoin.value, activeChartType, activeTimeframe]);

    const { minPrice, maxPrice, currentPrice, currentPosition } = useMemo(() => {
        if (!chartData.length) return { minPrice: 0, maxPrice: 0, currentPrice: 0, currentPosition: 50 };
        
        const values = chartData.map(d => d.value);
        const minPrice = Math.min(...values);
        const maxPrice = Math.max(...values);
        const currentPrice = values[values.length - 1];
        
        const range = maxPrice - minPrice;
        const currentPosition = range === 0 ? 50 : ((currentPrice - minPrice) / range) * 100;
        
        return { minPrice, maxPrice, currentPrice, currentPosition };
    }, [chartData]);


    const handleCoinSelect = (coinValue: string) => {
        const coin = allCoins.find(c => c.value === coinValue);
        if(coin) {
            setSelectedCoin(coin);
            setPopoverOpen(false);
        }
    }

    const formatPrice = () => {
        switch(activeChartType) {
            case '원화': return `${selectedCoin.price.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;
            case '사토시': return `${selectedCoin.satoshi.toFixed(8)} BTC`;
            case '시가총액': return `${(selectedCoin.marketCap / 1000000000000).toLocaleString('ko-KR', {maximumFractionDigits: 0})}조원`;
            default: return '';
        }
    }
    
    const yAxisFormat = (value: any) => {
         switch(activeChartType) {
            case '원화': 
                if (value >= 10000) return `${(value / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`;
                return `${value.toLocaleString()}원`;
            case '사토시': return `${value.toFixed(8)}`;
            case '시가총액': return `${(value / 1000000000000).toFixed(0)}조`;
            default: return value.toString();
        }
    }
    
    const yDomain = useMemo(() => {
        if (!chartData || chartData.length === 0) return [0, 0];
        const values = chartData.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max-min) * 0.1;
        return [min - padding, max + padding];
    }, [chartData]);


    return (
        <Card className="bg-card-dark border-zinc-800">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 pt-1">
                        <Activity className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-white">실시간 시세</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-primary transition-colors" title="계산기">
                                        <Calculator className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
                                    </Button>
                                </DialogTrigger>
                                <CalculatorDialog 
                                    activeChartType={activeChartType}
                                    selectedCoin={selectedCoin}
                                    allCoins={allCoins}
                                />
                            </Dialog>

                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent justify-end">
                                        <h2 className="text-base font-bold text-white">{selectedCoin.label} ({selectedCoin.value})</h2>
                                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                                    </Button>
                                </PopoverTrigger>
                            <PopoverContent className="p-0 w-[250px]" align="end">
                                <Command>
                                    <CommandInput placeholder="코인 검색..." />
                                    <CommandList className="max-h-[200px] overflow-y-auto">
                                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                                        <CommandGroup>
                                            {allCoins.map((coin) => (
                                            <CommandItem
                                                key={coin.value}
                                                value={`${coin.label} ${coin.value}`}
                                                onSelect={() => {
                                                    handleCoinSelect(coin.value);
                                                    setPopoverOpen(false);
                                                }}
                                            >
                                                <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCoin.value === coin.value ? "opacity-100" : "opacity-0"
                                                )}
                                                />
                                                {coin.label} ({coin.value})
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        </div>
                        <div className="flex flex-col items-end mt-1 w-full">
                            <div className="flex items-center justify-end w-full gap-2">
                                <p className="text-xl font-bold text-white whitespace-nowrap leading-none tracking-tight">{formatPrice()}</p>
                                <p className={`text-xs font-bold ${selectedCoin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedCoin.change >= 0 ? '+' : ''}{selectedCoin.change.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2 mt-4">
                    {['24h', '7D', '30D', '90D', '1Y', 'All'].map(tf => (
                        <TimeframeButton 
                            key={tf} 
                            active={activeTimeframe === tf}
                            onClick={() => setActiveTimeframe(tf)}
                        >
                            {tf}
                        </TimeframeButton>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-40 md:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="time" 
                                stroke="#6b7280" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                interval={Math.floor(chartData.length / 5)} 
                            />
                            <YAxis
                                orientation="right"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={yDomain}
                                tickFormatter={yAxisFormat}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                                    borderColor: '#4b5563',
                                    color: '#e5e7eb',
                                }}
                                itemStyle={{ color: '#e5e7eb' }}
                                labelStyle={{ fontWeight: 'bold' }}
                                formatter={(value: number) => {
                                    if (activeChartType === '사토시') return value.toFixed(8);
                                    if (activeChartType === '원화' && value > 1) return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
                                    if (activeChartType === '시가총액') return `${(value / 1000000000000).toFixed(2)}조원`;
                                    return value.toLocaleString();
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex space-x-2 mt-4">
                    {(['원화', '사토시', '시가총액'] as const).map(type => (
                         <ChartTypeButton
                            key={type}
                            active={activeChartType === type}
                            onClick={() => setActiveChartType(type)}
                        >
                            {type}
                        </ChartTypeButton>
                    ))}
                </div>
                 <div className="mt-6 space-y-2">
                    <div className="relative pt-8 pb-8">
                        <RangeBar 
                            vwapPosition={selectedCoin.vwapPosition} 
                            showVwap={activeChartType !== '시가총액'}
                            currentPosition={currentPosition}
                            lowPrice={minPrice}
                            highPrice={maxPrice}
                            activeChartType={activeChartType}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
