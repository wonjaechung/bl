'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const membershipBuysData = {
    whale: [
        { rank: 1, name: '비앤비', ticker: 'BNB/KRW', percent: 25 },
        { rank: 2, name: '유니스왑', ticker: 'UNI/KRW', percent: 21 },
        { rank: 3, name: '비트코인 캐시', ticker: 'BCH/KRW', percent: 18 },
        { rank: 4, name: '솔라나', ticker: 'SOL/KRW', percent: 15 },
        { rank: 5, name: '페페', ticker: 'PEPE/KRW', percent: 14 },
    ],
    black: [
        { rank: 1, name: '비트코인', ticker: 'BTC/KRW', percent: 35 },
        { rank: 2, name: '이더리움', ticker: 'ETH/KRW', percent: 28 },
        { rank: 3, name: '솔라나', ticker: 'SOL/KRW', percent: 22 },
        { rank: 4, name: '리플', ticker: 'XRP/KRW', percent: 18 },
        { rank: 5, name: '에이다', ticker: 'ADA/KRW', percent: 15 },
    ],
};

const membershipLevels: { id: Membership; label: string; }[] = [
    { id: 'whale', label: '고래' },
    { id: 'black', label: '블랙' },
];

type Membership = keyof typeof membershipBuysData;

const membershipColors: Record<Membership, string> = {
    whale: 'bg-indigo-500 text-white hover:bg-indigo-600',
    black: 'bg-zinc-900 text-white border border-zinc-700 hover:bg-black',
};

import { Lock } from 'lucide-react';

export default function BithumbMembershipBuys() {
    const [activeTab, setActiveTab] = useState<Membership>('whale');
    const data = membershipBuysData[activeTab];

    return (
        <Card className="relative overflow-hidden">
            <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-background/50 flex flex-col items-center justify-center gap-2">
                <div className="bg-zinc-900/90 p-4 rounded-full border border-zinc-800 shadow-xl">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-foreground">빗썸 플러스 멤버십 전용</p>
                    <p className="text-xs text-muted-foreground">멤버십 구독 후 확인하실 수 있습니다</p>
                </div>
                <Button variant="default" size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white border-none">
                    멤버십 구독하기
                </Button>
            </div>
            
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Bithumb 상위 매수</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <div className="p-1">
                                        <p className="font-semibold">어제 그룹별 순매수 금액(매수금액 - 매도금액) 기준 상위 코인 순위입니다.</p>
                                        <p className="text-xs text-muted-foreground mt-1">'매수 비중'은 해당 그룹의 총 순매수 금액에서 해당 코인이 차지하는 비중을 의미합니다.</p>
                                        <hr className="my-2" />
                                        <p className="text-xs text-muted-foreground"><span className="font-bold">그룹 기준:</span><br/>
                                        - 고래: 자산 상위 1,000명<br/>
                                        - 블랙: 1000억원 이상<br/>
                                        - 오렌지: 100억원 이상<br/>
                                        - 퍼플: 10억원 이상<br/>
                                        - 그린: 1억원 이상<br/>
                                        - 블루: 1000만원 이상<br/>
                                        - 화이트: 1000만원 미만</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">어제 기준</span>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex items-center gap-2 pt-2">
                        {membershipLevels.map(level => (
                            <Button
                                key={level.id}
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveTab(level.id)}
                                className={`rounded-full px-4 flex-shrink-0 transition-all ${
                                    activeTab === level.id 
                                        ? membershipColors[level.id] 
                                        : 'text-muted-foreground hover:bg-zinc-800'
                                }`}
                            >
                                {level.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </CardHeader>
            <CardContent>
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
                                <p className="text-xs text-muted-foreground">매수 비중</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
