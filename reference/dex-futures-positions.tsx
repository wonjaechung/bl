'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';

const positionsData = [
    { ticker: 'ETH', long: 897.44, short: 830.53, total: 1730 },
    { ticker: 'BTC', long: 362.86, short: 369.66, total: 732.52 },
    { ticker: 'HYPE', long: 172.10, short: 263.62, total: 435.73 },
    { ticker: 'SOL', long: 97.92, short: 98.53, total: 196.45 },
    { ticker: 'XRP', long: 84.42, short: 61.69, total: 146.11 },
    { ticker: 'ZEC', long: 21.65, short: 46.31, total: 67.96 },
    { ticker: 'FARTCOIN', long: 4.58, short: 26.81, total: 31.39 },
    { ticker: 'ASTER', long: 6.66, short: 16.67, total: 23.33 },
    { ticker: 'ENA', long: 4.15, short: 16.90, total: 21.05 },
    { ticker: 'PUMP', long: 4.31, short: 15.31, total: 19.62 },
];

const PositionBar = ({ long, short }: { long: number, short: number }) => {
    const total = long + short;
    const longPercent = (long / total) * 100;
    const shortPercent = (short / total) * 100;
    
    return (
        <div className="w-full bg-bearish/20 rounded-full h-5 flex overflow-hidden relative border">
            <div className="bg-bullish/50 h-full transition-all duration-500" style={{ width: `${longPercent}%` }}></div>
             <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                <span className="text-bullish font-semibold">{longPercent.toFixed(1)}%</span>
                <span className="text-bearish font-semibold">{shortPercent.toFixed(1)}%</span>
            </div>
        </div>
    );
};

export default function DexFuturesPositions() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Hyperliquid 롱/숏 비율</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Hyperliquid DEX 자산기준 500억원 이상 고래 상위 포지션 롱/숏비율입니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-3">
                        {positionsData.map(item => (
                            <div key={item.ticker} className="grid grid-cols-4 items-center gap-4 text-sm">
                                <span className="col-span-1 font-bold">{item.ticker}</span>
                                <div className="col-span-3">
                                    <PositionBar long={item.long} short={item.short} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
