'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, Legend, CartesianGrid } from 'recharts';
import { Info } from 'lucide-react';
import { MarketIndicatorsCarousel, type IndicatorId, indicatorData } from './market-indicators-carousel';


const generateData = (days: number, indicator: IndicatorId) => {
    const data = [];
    if (indicator === 'drop') {
        const startDate = new Date('2010-07-13');
        let btcPrice = 0.05;
        let ath = 0.05;

        const phases = [
            { days: 1265, growth: 0.007, volatility: 0.15 },    // to 2013-11-30 (~$1,163)
            { days: 410, growth: -0.002, volatility: 0.04 },   // to 2015-01-14 (~$220)
            { days: 730, growth: 0.009, volatility: 0.12 },    // to 2017-12-17 (~$19,783)
            { days: 365, growth: -0.006, volatility: 0.07 },   // to 2018-12-17 (~$3,122)
            { days: 1095, growth: 0.005, volatility: 0.1 },    // to 2021-11-10 (~$69,000)
            { days: 365, growth: -0.004, volatility: 0.06 },   // to 2022-11-09 (~$15,460)
            { days: 750, growth: 0.003, volatility: 0.08 },    // to 2024-03-14 (~$87,800)
            { days: 292, growth: -0.001, volatility: 0.05 },   // to 2025-01-01
        ];

        let dayCount = 0;
        for (const phase of phases) {
             for (let i = 0; i < phase.days; i++) {
                if (dayCount >= 5475) break;
                
                const date = new Date(startDate);
                date.setDate(date.getDate() + dayCount);

                const randomFactor = (Math.random() - 0.45) * phase.volatility;
                btcPrice *= (1 + phase.growth + randomFactor);
                if (btcPrice < 0.01) btcPrice = 0.01;

                if (btcPrice > ath) {
                    ath = btcPrice;
                }
                const drawdown = ath > 0 ? ((btcPrice - ath) / ath) * 100 : 0;
                
                data.push({
                    date: date.toLocaleDateString('en-CA'),
                    value: drawdown,
                    btcPrice: btcPrice
                });
                dayCount++;
            }
        }
        
        if (timeframeToDays[activeTimeframe] < 5475) {
            return data.slice(Math.max(data.length - days, 0));
        }

        return data;
    }

    // Data generation for other indicators
    let baseValue = 50;
    let volatility = 5;
    
    switch(indicator) {
        case 'dominance': baseValue = 49.08; volatility = 3; break;
        case 'volume': baseValue = 2.13; volatility = 0.5; break; // Trillion KRW
        case 'kimchi': baseValue = 1.38; volatility = 0.5; break;
        case 'fear': baseValue = 41; volatility = 10; break;
        case 'stable': baseValue = 162.7; volatility = 5; break; // Billion USD
        case 'm2': baseValue = 4100; volatility = 50; break; // Trillion
    }

    let currentValue = baseValue;
    let currentBtcPrice = 100000000; // 100M KRW base

    for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
        currentValue += (Math.random() - 0.5) * (volatility / 5);
        if (indicator === 'volume' && currentValue < 0) currentValue = 0;

        // Mock BTC Price movement
        currentBtcPrice = currentBtcPrice * (1 + (Math.random() - 0.5) * 0.02);

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: currentValue,
            btcPrice: currentBtcPrice
        });
    }
    return data;
};

const timeframeToDays: { [key: string]: number } = {
    '24h': 24,
    '7D': 7,
    '30D': 30,
    '90D': 90,
    '1Y': 365,
    'All': 5475, // Approx 15 years
};

const TimeframeButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`h-6 px-3 text-[10px] font-medium rounded-full transition-all duration-200 flex-1 whitespace-nowrap flex items-center justify-center ${
            active 
            ? 'bg-foreground text-background shadow-sm font-bold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-transparent'
        }`}
    >
        {children}
    </button>
);

const CustomTooltip = ({ active, payload, label, indicator }: any) => {
  if (active && payload && payload.length) {
    const btcPricePayload = payload.find(p => p.dataKey === 'btcPrice');
    const valuePayload = payload.find(p => p.dataKey === 'value');
    
    // Format date based on length/content of label if possible, or assume daily
    const dateLabel = new Date(label).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="bg-card/95 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg min-w-[180px]">
        <p className="font-bold text-sm mb-2 text-foreground">{dateLabel}</p>
        <div className="space-y-1">
            {valuePayload && (
                <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: valuePayload.stroke }} />
                        <span className="text-muted-foreground">{indicator.id === 'drop' ? '고점대비낙폭' : indicator.title}</span>
                    </div>
                    <span className="font-mono font-medium" style={{ color: valuePayload.stroke }}>
                        {valuePayload.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}{indicator.unit}
                    </span>
                </div>
            )}
            {btcPricePayload && (
                <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: btcPricePayload.stroke }} />
                        <span className="text-muted-foreground">BTC 가격</span>
                    </div>
                     <span className="font-mono font-medium" style={{ color: btcPricePayload.stroke }}>
                        ${btcPricePayload.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>
            )}
        </div>
      </div>
    );
  }
  return null;
};
let activeTimeframe = 'All';

export default function DominanceChart() {
    const [internalActiveTimeframe, setInternalActiveTimeframe] = useState('7D');
    activeTimeframe = internalActiveTimeframe;
    const [activeIndicator, setActiveIndicator] = useState<IndicatorId>('volume');
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const days = timeframeToDays[internalActiveTimeframe] || 365;
            
            // Handle real data for Dominance, Fear/Greed, and now Stablecoins
            if (activeIndicator === 'dominance' || activeIndicator === 'fear' || activeIndicator === 'stable') {
                try {
                    const endpoint = activeIndicator === 'stable' ? '/api/btc-metrics?type=history_stable' : '/api/btc-metrics?type=history_fgi';
                    
                    const res = await fetch(endpoint);
                    if (res.ok) {
                        const historyData = await res.json();
                        // Filter by date
                        let filtered = historyData;
                        // Limit if not 'All'
                        if (internalActiveTimeframe !== 'All') {
                             filtered = historyData.slice(-days);
                        }

                        // Map to chart format
                        const mappedData = filtered.map((d: any) => ({
                            date: d.date,
                            value: activeIndicator === 'dominance' ? d.dominance : (activeIndicator === 'fear' ? d.fear : d.value),
                            btcPrice: d.btcPrice
                        }));

                        setChartData(mappedData);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to fetch history data", e);
                }
            }

            let btcHistory: any[] = [];
            
            // Always fetch BTC history for other indicators if needed (or if fallback is needed)
            try {
                const res = await fetch('/api/btc-metrics?type=history');
                if (res.ok) {
                    btcHistory = await res.json();
                }
            } catch (e) {
                console.error("Failed to fetch btc history", e);
            }

            if (activeIndicator === 'drop') {
                if (btcHistory.length > 0) {
                    const filteredData = (days < 5475 && days < btcHistory.length)
                        ? btcHistory.slice(btcHistory.length - days)
                        : btcHistory;
                    
                    setChartData(filteredData);
                    return;
                }
            }

            let newData = generateData(days, activeIndicator);
            
            // Merge BTC price for other indicators
            if (btcHistory.length > 0) {
                // Align the end of both arrays
                const sliceStart = btcHistory.length - newData.length;
                newData = newData.map((d, i) => {
                    const btcIndex = sliceStart + i;
                    const price = (btcIndex >= 0 && btcIndex < btcHistory.length) 
                        ? btcHistory[btcIndex].btcPrice 
                        : null;
                    return { ...d, btcPrice: price };
                });
            }

            setChartData(newData);
        };

        fetchData();
    }, [internalActiveTimeframe, activeIndicator]);

    const currentIndicator = indicatorData[activeIndicator];
    const isDrawdownChart = activeIndicator === 'drop';

    const getYAxisTickFormatter = (isLeft: boolean) => {
        if(isDrawdownChart) {
            if(isLeft) {
                return (value: number) => {
                    if (value < 1) return `$${value.toFixed(2)}`;
                    if (value < 1000) return `$${value.toFixed(0)}`;
                    if (value < 1000000) return `$${(value/1000).toFixed(0)}K`;
                    return `$${(value/1000000).toFixed(0)}M`;
                }
            } else {
                 return (value: number) => `${value.toFixed(0)}%`;
            }
        }
        
        // For other charts: Left is Indicator, Right is BTC Price
        if (isLeft) {
            switch(activeIndicator) {
                case 'dominance':
                case 'kimchi':
                    return (value: number) => `${value.toFixed(0)}%`;
                case 'volume':
                    return (value: number) => `${value.toFixed(2)}조`;
                case 'stable':
                    return (value: number) => `${value.toFixed(0)}조`;
                case 'm2':
                     return (value: number) => `${value.toFixed(0)}조`;
                case 'fear':
                    return (value: number) => value.toFixed(0);
                default:
                    return (value: number) => value.toString();
            }
        } else {
            // Right axis for BTC Price
            return (value: number) => {
                if (value >= 1000) return `${(value/1000).toFixed(1)}k`;
                return value.toFixed(0);
            };
        }
    }

    const getYAxisDomain = (isLeft: boolean) => {
        if (isDrawdownChart) {
            return isLeft ? [0.01, 100000] : [-100, 0];
        }
        
        if (isLeft) {
            const values = chartData.map(d => d.value).filter(v => v !== null && v !== undefined && !isNaN(v));
            if (values.length === 0) return [0, 100];
            const min = Math.min(...values);
            const max = Math.max(...values);
            const padding = (max - min) * 0.05;
            // Ensure padding is not zero
            const padVal = padding === 0 ? max * 0.05 : padding;
            return [Math.max(0, min - padVal), max + padVal];
        } else {
            // Right axis for BTC Price
            const prices = chartData.map(d => d.btcPrice).filter(p => p != null && !isNaN(p));
            if (prices.length === 0) return ['auto', 'auto'];
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const padding = (max - min) * 0.05;
            return [min - padding, max + padding];
        }
    }


    const getIndicatorDescription = (indicator: IndicatorId) => {
        switch(indicator) {
            case 'dominance':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">BTC 도미넌스란?</h4>
                        <p className="mb-1 leading-snug">전체 암호화폐 시가총액 중 비트코인 비중입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">상승:</span> 비트코인 강세 (자금 쏠림)</li>
                            <li><span className="text-foreground">하락:</span> 알트코인 강세 (자금 이동)</li>
                        </ul>
                    </div>
                );
            case 'volume':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">빗썸 거래대금이란?</h4>
                        <p className="mb-1 leading-snug">최근 24시간 빗썸 내 총 거래 금액입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">증가:</span> 시장 활성화 (관심 증가)</li>
                            <li><span className="text-foreground">감소:</span> 시장 침체 (관망세)</li>
                        </ul>
                    </div>
                );
            case 'kimchi':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">김치 프리미엄이란?</h4>
                        <p className="mb-1 leading-snug">국내 거래소 가격이 해외보다 높은 정도입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">높음(+):</span> 국내 매수세 강함 (과열)</li>
                            <li><span className="text-foreground">낮음(-):</span> 국내 매도세 강함 (저점)</li>
                        </ul>
                    </div>
                );
            case 'fear':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">공포/탐욕 지수란?</h4>
                        <p className="mb-1 leading-snug">시장 참여자들의 심리를 수치화한 지표입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">공포 (0~20):</span> 과매도 (매수 기회)</li>
                            <li><span className="text-foreground">탐욕 (80~100):</span> 과매수 (조정 주의)</li>
                        </ul>
                    </div>
                );
            case 'drop':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">고점 대비 낙폭(MDD)이란?</h4>
                        <p className="mb-1 leading-snug">비트코인 역대 최고점 대비 하락률입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">낙폭 심화:</span> 저점 매수 기회</li>
                            <li><span className="text-foreground">낙폭 축소:</span> 전고점 돌파 시도</li>
                        </ul>
                    </div>
                );
            case 'stable':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">스테이블코인 시총이란?</h4>
                        <p className="mb-1 leading-snug">주요 스테이블코인의 총 발행량입니다.</p>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">증가:</span> 매수 대기 자금 유입</li>
                            <li><span className="text-foreground">감소:</span> 자금 이탈 (유동성 축소)</li>
                        </ul>
                    </div>
                );
            case 'm2':
                return (
                    <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-foreground mb-1">Global M2 통화량이란?</h4>
                        <p className="mb-1 leading-snug">주요국 중앙은행의 통화 공급량 지표입니다.</p>
                         <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                            <li><span className="text-foreground">증가:</span> 유동성 장세 (상승 유리)</li>
                            <li><span className="text-foreground">감소:</span> 긴축 정책 (하락 압력)</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <Card className="border-none shadow-none bg-transparent w-full overflow-hidden mt-0">
            <CardHeader className="px-0 pt-0 pb-2">
                <div className="flex flex-col gap-2 items-start">
                    <div className="w-full flex justify-end">
                        <div className="text-right">
                            <div className="flex flex-col items-end gap-1">
                                <div className='flex items-center gap-1 text-xs'>
                                    <div className='w-2 h-2 rounded-full' style={{backgroundColor: '#F7931A'}}/>
                                    <span>BTC 가격</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex justify-between items-end mb-2 px-1">
                    <div className="flex w-full bg-muted/30 p-0.5 rounded-full gap-1">
                        {isDrawdownChart ? (
                            null
                        ) : (
                            (['24h', '7D', '30D', '90D', '1Y', 'All'].map(tf => (
                                <TimeframeButton
                                    key={tf}
                                    active={internalActiveTimeframe === tf}
                                    onClick={() => setInternalActiveTimeframe(tf)}
                                >
                                    {tf}
                                </TimeframeButton>
                            )))
                        )}
                    </div>
                </div>
                <div className="h-36 w-full mb-2 relative z-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 20 }}>
                             <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isDrawdownChart ? '#16a34a' : '#10b981'} stopOpacity={isDrawdownChart ? 1 : 0.3}/>
                                    <stop offset="95%" stopColor={isDrawdownChart ? '#16a34a' : '#10b981'} stopOpacity={isDrawdownChart ? 1 : 0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6b7280" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(tick) => {
                                    if(isDrawdownChart) {
                                        return new Date(tick).getFullYear().toString();
                                    }
                                    if(internalActiveTimeframe === '24h') {
                                        return new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }
                                    // Simpler date format for long periods
                                    if (internalActiveTimeframe === 'All' || internalActiveTimeframe === '1Y') {
                                        const date = new Date(tick);
                                        return `${date.getFullYear()}.${date.getMonth() + 1}`;
                                    }
                                    return tick;
                                }}
                                interval="preserveStartEnd"
                                minTickGap={30}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                scale={isDrawdownChart ? "log" : "auto"}
                                domain={getYAxisDomain(true)}
                                tickFormatter={getYAxisTickFormatter(true)}
                                hide={true}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#6b7280"
                                fontSize={9}
                                tickLine={false}
                                axisLine={false}
                                domain={getYAxisDomain(false)}
                                tickFormatter={getYAxisTickFormatter(false)}
                                width={0}
                                hide={true}
                            />
                            <Tooltip
                                content={<CustomTooltip indicator={currentIndicator} />}
                                wrapperStyle={{ outline: 'none' }}
                                cursor={false}
                            />
                            <Area 
                                yAxisId={isDrawdownChart ? 'right' : 'left'} 
                                type="monotone" 
                                dataKey="value" 
                                name={isDrawdownChart ? "고점대비낙폭" : currentIndicator.title} 
                                stroke={isDrawdownChart ? '#16a34a' : '#10b981'}
                                fill="url(#colorValue)"
                                fillOpacity={1}
                            />
                            <Line yAxisId={isDrawdownChart ? "left" : "right"} type="monotone" dataKey="btcPrice" name="BTC 가격" stroke="#F7931A" strokeWidth={2} dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-0 px-2 pb-2">
                    <MarketIndicatorsCarousel selectedIndicator={activeIndicator} onIndicatorSelect={(id) => {
                        setActiveIndicator(id);
                        if (id === 'drop') {
                            setInternalActiveTimeframe('All');
                        } else if(internalActiveTimeframe === 'All') {
                             setInternalActiveTimeframe('1Y');
                        }
                    }} />
                    {getIndicatorDescription(activeIndicator)}
                </div>
            </CardContent>
            </Card>
    );
}

