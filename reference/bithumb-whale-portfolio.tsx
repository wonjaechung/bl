'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const portfolioData = {
    whale: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 45 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 25 },
        { rank: 3, name: '리플', ticker: 'XRP', value: 15 },
        { rank: 4, name: '스테이블코인', ticker: 'STABLE', value: 10 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 5 },
    ],
    black: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 60 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 20 },
        { rank: 3, name: '리플', ticker: 'XRP', value: 10 },
        { rank: 4, name: '스테이블코인', ticker: 'STABLE', value: 5 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 5 },
    ],
    grayscale: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 277380, percentOfSupply: 1.32, price: 98000000 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 3000000, percentOfSupply: 2.5, price: 4500000 },
        { rank: 3, name: '이더리움 클래식', ticker: 'ETC', value: 10000000, percentOfSupply: 4.78, price: 32000 },
        { rank: 4, name: '비트코인 캐시', ticker: 'BCH', value: 300000, percentOfSupply: 1.5, price: 550000 },
        { rank: 5, name: '라이트코인', ticker: 'LTC', value: 1500000, percentOfSupply: 2.02, price: 110000 },
    ]
};

type PortfolioTab = keyof typeof portfolioData;

const portfolioTabs: { id: PortfolioTab; label: string; }[] = [
    { id: 'whale', label: '고래' },
    { id: 'black', label: '블랙' },
    { id: 'grayscale', label: '그레이스케일' },
];

const membershipColors: Record<PortfolioTab, string> = {
    whale: 'bg-indigo-500 text-white hover:bg-indigo-600',
    black: 'bg-zinc-900 text-white border border-zinc-700 hover:bg-black',
    grayscale: 'bg-zinc-200 text-black hover:bg-zinc-300',
};

export default function BithumbWhalePortfolio() {
    const [activeTab, setActiveTab] = useState<PortfolioTab>('whale');
    const data = portfolioData[activeTab];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">고래 평균 포트폴리오</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>그룹별 평균 자산 분배 현황입니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex items-center gap-2 pt-2">
                        {portfolioTabs.map(tab => (
                            <Button
                                key={tab.id}
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-full px-4 flex-shrink-0 transition-all ${
                                    activeTab === tab.id 
                                        ? membershipColors[tab.id] 
                                        : 'text-muted-foreground hover:bg-zinc-800'
                                }`}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
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
                                    {activeTab === 'grayscale' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="font-code font-bold text-lg text-primary">{item.percentOfSupply}%</span>
                                            <span className="text-xs text-muted-foreground">공급량 대비</span>
                                            {item.price && (
                                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                                    {(() => {
                                                        const valInEok = item.value * item.price / 100000000;
                                                        if (valInEok >= 10000) {
                                                            return `${(valInEok / 10000).toFixed(2)}조원`;
                                                        }
                                                        return `${valInEok.toLocaleString(undefined, { maximumFractionDigits: 0 })}억원`;
                                                    })()}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-code font-bold text-lg text-primary">{item.value}%</span>
                                            <p className="text-xs text-muted-foreground">비중</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
