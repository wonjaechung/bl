'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';

const holdingsData = {
    major: [
        { rank: 1, name: '비트코인', ticker: 'BTC/KRW', percent: 82 },
        { rank: 2, name: '이더리움', ticker: 'ETH/KRW', percent: 79 },
        { rank: 3, name: '엑스알피 [리플]', ticker: 'XRP/KRW', percent: 74 },
        { rank: 4, name: '솔라나', ticker: 'SOL/KRW', percent: 46 },
        { rank: 5, name: '이더리움 클래식', ticker: 'ETC/KRW', percent: 38 },
        { rank: 6, name: '에이다', ticker: 'ADA/KRW', percent: 35 },
        { rank: 7, name: '도지코인', ticker: 'DOGE/KRW', percent: 32 },
        { rank: 8, name: '아발란체', ticker: 'AVAX/KRW', percent: 29 },
        { rank: 9, name: '폴카닷', ticker: 'DOT/KRW', percent: 26 },
        { rank: 10, name: '체인링크', ticker: 'LINK/KRW', percent: 23 },
    ],
    general: [
        { rank: 1, name: '도지코인', ticker: 'DOGE/KRW', percent: 65 },
        { rank: 2, name: '시바이누', ticker: 'SHIB/KRW', percent: 61 },
        { rank: 3, name: '페페', ticker: 'PEPE/KRW', percent: 55 },
        { rank: 4, name: '월드코인', ticker: 'WLD/KRW', percent: 49 },
        { rank: 5, name: '리플', ticker: 'XRP/KRW', percent: 45 },
        { rank: 6, name: '이오스', ticker: 'EOS/KRW', percent: 42 },
        { rank: 7, name: '트론', ticker: 'TRX/KRW', percent: 39 },
        { rank: 8, name: '스텔라루멘', ticker: 'XLM/KRW', percent: 36 },
        { rank: 9, name: '비트코인 캐시', ticker: 'BCH/KRW', percent: 33 },
        { rank: 10, name: '라이트코인', ticker: 'LTC/KRW', percent: 30 },
    ]
};

type ActiveTab = 'major' | 'general';

export default function BithumbWhaleHoldings() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('major');
    const data = holdingsData[activeTab];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Bithumb 고래 상위 보유</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>빗썸에서 선정한 자산 규모 상위 1,000명이 보유하고 있는 가상 자산 순위입니다.</p>
                                    <p className="text-xs text-muted-foreground mt-1">'보유 고래'는 자산 규모 상위 1,000명 중 해당 코인을 보유한 회원의 비율을 의미합니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">어제 기준</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <Button
                        size="sm"
                        variant={activeTab === 'major' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('major')}
                        className="rounded-full px-4"
                    >
                        메이저
                    </Button>
                    <Button
                        size="sm"
                        variant={activeTab === 'general' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('general')}
                        className="rounded-full px-4"
                    >
                        일반
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-4">
                        {data.map(item => (
                            <div key={item.rank} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.ticker}</p>
                                    </div>
                                </div>
                                 <div className="text-right">
                                    <span className="font-code font-bold text-lg text-primary">{item.percent}%</span>
                                    <p className="text-xs text-muted-foreground">보유 고래</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
