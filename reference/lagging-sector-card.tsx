'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, TrendingDown, TrendingUp, ChevronLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const DefaultIcon = ({ ticker }: { ticker: string }) => (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
        {ticker.charAt(0)}
    </div>
);

const laggingSectorsData = [
    { 
        rank: 1, 
        name: 'GameFi', 
        change: -4.8, 
        sub: '게이밍',
        topCoins: [
            {rank: 1, name: '엑시인피니티', ticker: 'AXS', change: -5.1, icon: DefaultIcon}, 
            {rank: 2, name: '갈라', ticker: 'GALA', change: -4.9, icon: DefaultIcon}, 
            {rank: 3, name: '위믹스', ticker: 'WEMIX', change: -4.5, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 2, 
        name: 'Meme', 
        change: -6.2, 
        sub: '밈',
        topCoins: [
            {rank: 1, name: '도지코인', ticker: 'DOGE', change: -5.8, icon: DefaultIcon}, 
            {rank: 2, name: '시바이누', ticker: 'SHIB', change: -7.1, icon: DefaultIcon}, 
            {rank: 3, name: '페페', ticker: 'PEPE', change: -6.5, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 3, 
        name: 'Layer 1', 
        change: -3.1, 
        sub: '메인넷',
        topCoins: [
            {rank: 1, name: '이더리움', ticker: 'ETH', change: -2.9, icon: DefaultIcon}, 
            {rank: 2, name: '솔라나', ticker: 'SOL', change: -3.5, icon: DefaultIcon}, 
            {rank: 3, name: '아발란체', ticker: 'AVAX', change: -3.2, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 4, 
        name: 'DEX', 
        change: -2.5, 
        sub: '탈중앙화 거래소',
        topCoins: [
            {rank: 1, name: 'dYdX', ticker: 'DYDX', change: -2.8, icon: DefaultIcon}, 
            {rank: 2, name: '커브', ticker: 'CRV', change: -2.2, icon: DefaultIcon}, 
            {rank: 3, name: '스시스왑', ticker: 'SUSHI', change: -2.6, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 5, 
        name: 'Oracles', 
        change: -1.9, 
        sub: '오라클',
        topCoins: [
            {rank: 1, name: '체인링크', ticker: 'LINK', change: -1.8, icon: DefaultIcon}, 
            {rank: 2, name: '밴드 프로토콜', ticker: 'BAND', change: -2.1, icon: DefaultIcon}, 
            {rank: 3, name: '우마', ticker: 'UMA', change: -1.5, icon: DefaultIcon}
        ] 
    },
];

const ChangeIndicator = ({ change }: { change: number }) => {
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-bullish' : 'text-bearish';

    return (
        <div className={`flex items-center text-sm font-code font-semibold ${color}`}>
            <Icon className="h-4 w-4 mr-1" />
            {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
    );
};

export default function LaggingSectorCard() {
    const [selectedSector, setSelectedSector] = useState<number | null>(null);

    const handleSectorClick = (rank: number) => {
        setSelectedSector(rank);
    };

    const handleBackClick = () => {
        setSelectedSector(null);
    };

    const sectorToShow = selectedSector !== null ? laggingSectorsData.find(s => s.rank === selectedSector) : null;
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {selectedSector !== null ? (
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleBackClick}>
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        ) : null}
                        <CardTitle className="font-headline text-lg">
                            {sectorToShow ? sectorToShow.name : '약세 섹터'}
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>24시간 기준 가장 높은 하락률을 기록한 섹터입니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    {sectorToShow ? <ChangeIndicator change={sectorToShow.change} /> : <span className="text-sm text-muted-foreground">24H 기준</span>}
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    {sectorToShow ? (
                        <div className="space-y-3 pt-1">
                            {sectorToShow.topCoins.map(coin => (
                                <div key={coin.rank} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-5 text-center text-sm font-semibold text-muted-foreground">{coin.rank}</span>
                                        <coin.icon ticker={coin.ticker} />
                                        <div>
                                            <p className="font-semibold text-sm">{coin.name}</p>
                                            <p className="text-xs text-muted-foreground">{coin.ticker}</p>
                                        </div>
                                    </div>
                                    <ChangeIndicator change={coin.change} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full space-y-2">
                            {laggingSectorsData.map(item => (
                                <div key={item.rank} onClick={() => handleSectorClick(item.rank)} className="p-2 -mx-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <div className="flex items-center flex-1">
                                        <span className="font-bold text-muted-foreground w-6 text-left">{item.rank}</span>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="bearish" className="text-sm w-20 justify-center">{item.name}</Badge>
                                                <div className="flex items-center">
                                                    {item.topCoins.slice(0, 3).map((coin, index) => (
                                                        <TooltipProvider key={coin.name}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center font-bold text-xs border-2 border-background relative ${index > 0 ? '-ml-2' : ''}`}
                                                                    >
                                                                        <Image
                                                                            src={`https://picsum.photos/seed/${coin.ticker}/24/24`}
                                                                            alt={`${coin.name} logo`}
                                                                            width={24}
                                                                            height={24}
                                                                            className="rounded-full object-cover"
                                                                        />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{coin.name}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="font-code font-bold text-lg text-bearish flex items-center gap-1">
                                                <TrendingDown className="h-5 w-5" />
                                                {item.change.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
