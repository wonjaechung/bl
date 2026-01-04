'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';

const takerBuysData = [
    { ticker: 'BTC', buy: 180.5, sell: 60.0, total: 240.5 },
    { ticker: 'ETH', buy: 150.2, sell: 62.0, total: 212.2 },
    { ticker: 'XRP', buy: 110.1, sell: 45.0, total: 155.1 },
    { ticker: 'SOL', buy: 90.8, sell: 48.0, total: 138.8 },
    { ticker: 'DOGE', buy: 70.4, sell: 39.0, total: 109.4 },
    { ticker: 'AVAX', buy: 65.2, sell: 33.1, total: 98.3 },
    { ticker: 'ADA', buy: 55.9, sell: 28.5, total: 84.4 },
    { ticker: 'LINK', buy: 48.1, sell: 22.9, total: 71.0 },
    { ticker: 'MATIC', buy: 42.7, sell: 25.4, total: 68.1 },
    { ticker: 'DOT', buy: 38.3, sell: 19.8, total: 58.1 },
];

const PositionBar = ({ buy, sell }: { buy: number, sell: number }) => {
    const total = buy + sell;
    const buyPercent = total > 0 ? (buy / total) * 100 : 50;
    
    return (
        <div className="w-full bg-bearish/20 rounded-full h-5 flex overflow-hidden relative border">
            <div className="bg-bullish/50 h-full" style={{ width: `${buyPercent}%` }}></div>
             <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                <span className="text-bullish font-semibold">{buy.toFixed(1)}억</span>
                <span className="text-bearish font-semibold">{sell.toFixed(1)}억</span>
            </div>
        </div>
    );
};

export default function BithumbTakerBuys() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Bithumb 시장가 매수/매도 현황</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>시장가 매수(Taker Buy)와 시장가 매도(Taker Sell) 거래대금을 비교하여 적극적인 매수/매도세를 파악하는 데 사용됩니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">24H 기준</span>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-3">
                        {takerBuysData.map(item => (
                            <div key={item.ticker} className="grid grid-cols-5 items-center gap-4 text-sm">
                                <span className="col-span-1 font-bold">{item.ticker}</span>
                                <div className="col-span-3">
                                    <PositionBar buy={item.buy} sell={item.sell} />
                                </div>
                                <span className="col-span-1 text-right font-code text-muted-foreground">{item.total.toFixed(1)}억</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
