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

const leadingSectorsData = [
    { 
        rank: 1, 
        name: 'AI', 
        change: 25.5, 
        sub: '인공지능',
        topCoins: [
            {rank: 1, name: '월드코인', ticker: 'WLD', change: 28.1, icon: DefaultIcon}, 
            {rank: 2, name: '싱귤래리티넷', ticker: 'AGIX', change: 26.3, icon: DefaultIcon}, 
            {rank: 3, name: '페치', ticker: 'FET', change: 24.9, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 2, 
        name: 'RWA', 
        change: 18.2, 
        sub: '실물자산',
        topCoins: [
            {rank: 1, name: '폴리매쉬', ticker: 'POLYX', change: 20.5, icon: DefaultIcon}, 
            {rank: 2, name: '온도 파이낸스', ticker: 'ONDO', change: 19.1, icon: DefaultIcon}, 
            {rank: 3, name: '체인링크', ticker: 'LINK', change: 17.8, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 3, 
        name: 'DeFi', 
        change: 12.1, 
        sub: '탈중앙화 금융',
        topCoins: [
            {rank: 1, name: '유니스왑', ticker: 'UNI', change: 13.5, icon: DefaultIcon}, 
            {rank: 2, name: '에이브', ticker: 'AAVE', change: 12.8, icon: DefaultIcon}, 
            {rank: 3, name: '메이커', ticker: 'MKR', change: 11.9, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 4, 
        name: 'Layer 2', 
        change: 9.8, 
        sub: '레이어 2',
        topCoins: [
            {rank: 1, name: '폴리곤', ticker: 'MATIC', change: 10.2, icon: DefaultIcon}, 
            {rank: 2, name: '아비트럼', ticker: 'ARB', change: 9.9, icon: DefaultIcon}, 
            {rank: 3, name: '옵티미즘', ticker: 'OP', change: 9.5, icon: DefaultIcon}
        ] 
    },
    { 
        rank: 5, 
        name: 'NFT', 
        change: 7.5, 
        sub: 'NFT & 메타버스',
        topCoins: [
            {rank: 1, name: '블러', ticker: 'BLUR', change: 8.1, icon: DefaultIcon}, 
            {rank: 2, name: '에이프코인', ticker: 'APE', change: 7.8, icon: DefaultIcon}, 
            {rank: 3, name: '샌드박스', ticker: 'SAND', change: 7.2, icon: DefaultIcon}
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

export default function LeadingSectorCard() {
    const [selectedSector, setSelectedSector] = useState<number | null>(null);

    const handleSectorClick = (rank: number) => {
        setSelectedSector(rank);
    };

    const handleBackClick = () => {
        setSelectedSector(null);
    };

    const sectorToShow = selectedSector !== null ? leadingSectorsData.find(s => s.rank === selectedSector) : null;

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
                            {sectorToShow ? sectorToShow.name : '주도 섹터'}
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>24시간 기준 가장 높은 상승률을 기록한 섹터입니다.</p>
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
                            {leadingSectorsData.map(item => (
                                <div key={item.rank} onClick={() => handleSectorClick(item.rank)} className="p-2 -mx-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <div className="flex items-center flex-1">
                                        <span className="font-bold text-muted-foreground w-6 text-left">{item.rank}</span>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="bullish" className="text-sm w-20 justify-center">{item.name}</Badge>
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
                                            <div className="font-code font-bold text-lg text-bullish flex items-center gap-1">
                                                <TrendingUp className="h-5 w-5" />
                                                +{item.change.toFixed(2)}%
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
