'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type PortfolioItem = {
    rank: number;
    name: string;
    ticker: string;
    percentage: number;
    color?: string;
};

const whaleData: PortfolioItem[] = [
    { rank: 1, name: '비트코인', ticker: 'BTC', percentage: 45.0 },
    { rank: 2, name: '이더리움', ticker: 'ETH', percentage: 25.0 },
    { rank: 3, name: '리플', ticker: 'XRP', percentage: 15.0 },
    { rank: 4, name: '스테이블코인', ticker: 'STABLE', percentage: 10.0 },
    { rank: 5, name: '기타', ticker: 'OTHERS', percentage: 5.0 },
];

const blackrockData: PortfolioItem[] = [
    { rank: 1, name: '비트코인', ticker: 'BTC', percentage: 45.0 },
    { rank: 2, name: '이더리움', ticker: 'ETH', percentage: 20.0 },
    { rank: 3, name: '리플', ticker: 'XRP', percentage: 15.0 },
    { rank: 4, name: '스테이블코인', ticker: 'STABLE', percentage: 10.0 },
    { rank: 5, name: '기타', ticker: 'OTHERS', percentage: 10.0 },
];

const grayscaleData: PortfolioItem[] = [
    { rank: 1, name: '비트코인', ticker: 'GBTC', percentage: 55.0 },
    { rank: 2, name: '이더리움', ticker: 'ETHE', percentage: 28.0 },
    { rank: 3, name: '솔라나', ticker: 'GSOL', percentage: 8.0 },
    { rank: 4, name: '기타', ticker: 'OTHERS', percentage: 9.0 },
];

const PortfolioList = ({ items }: { items: PortfolioItem[] }) => {
    return (
        <div className="space-y-3">
            {/* Header Row */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground px-4 pb-2 border-b border-border/40">
                <div className="flex items-center gap-6">
                    <span className="w-4 text-center">#</span>
                    <span>자산명</span>
                </div>
                <span>비중</span>
            </div>
            
            <div className="space-y-1">
                {items.map((item) => (
                    <div key={item.ticker} className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-muted/30 transition-colors group">
                        <div className="flex items-center gap-6">
                            <span className={`text-xs font-bold w-4 text-center ${item.rank <= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>{item.rank}</span>
                            <div className="flex items-center gap-3">
                                <img 
                                    src={`https://assets.coincap.io/assets/icons/${item.ticker.toLowerCase().replace('gbtc', 'btc').replace('ethe', 'eth').replace('gsol', 'sol').replace('stable', 'usdt').replace('others', 'usdc')}@2x.png`}
                                    alt={item.ticker}
                                    className="w-6 h-6 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://assets.coincap.io/assets/icons/btc@2x.png'; // Fallback
                                        (e.target as HTMLImageElement).style.opacity = '0.5';
                                    }}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground leading-none mb-0.5">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium leading-none">
                                        {item.ticker}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold font-mono text-foreground">
                                {item.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LockedContent = () => (
    <div className="relative h-[280px] w-full rounded-lg overflow-hidden border border-border/50">
        {/* Blurred Background Content (Mock) */}
        <div className="absolute inset-0 p-4 opacity-30 blur-sm pointer-events-none select-none filter grayscale">
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 mb-2">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-muted rounded-full"/>
                        <div className="w-24 h-4 bg-muted rounded"/>
                    </div>
                    <div className="w-12 h-4 bg-muted rounded"/>
                </div>
            ))}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 z-10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 shadow-inner">
                <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">빗썸 플러스 멤버십 전용</h3>
            <p className="text-xs text-muted-foreground mb-5 max-w-[200px] leading-relaxed">
                블랙 멤버십 회원들의 포트폴리오는 멤버십 구독 후 확인하실 수 있습니다.
            </p>
            <Button size="sm" className="h-8 text-xs px-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-105">
                멤버십 구독하기
            </Button>
        </div>
    </div>
);

export default function BithumbWhalePortfolio() {
    return (
        <Card className="border-border shadow-sm">
            <CardHeader className="pb-4 pt-5 px-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-base">고래 평균 포트폴리오</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground/70" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>주요 고래 지갑 및 기관 투자자들의 추정 포트폴리오 구성 비율입니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-6">
                <Tabs defaultValue="whale" className="w-full">
                    <div className="w-full flex justify-center mb-6">
                        <TabsList className="w-full h-10 p-1 bg-muted/50 rounded-full border border-border/10">
                            <TabsTrigger value="whale" className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all text-muted-foreground">고래</TabsTrigger>
                            <TabsTrigger value="blackrock" className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all text-muted-foreground">블랙</TabsTrigger>
                            <TabsTrigger value="grayscale" className="flex-1 rounded-full text-xs font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all text-muted-foreground">그레이스케일</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="whale" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                        <PortfolioList items={whaleData} />
                    </TabsContent>
                    
                    <TabsContent value="blackrock" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                        <LockedContent />
                    </TabsContent>
                    
                    <TabsContent value="grayscale" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                        <PortfolioList items={grayscaleData} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
