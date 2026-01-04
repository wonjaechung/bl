'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

const DefaultIcon = ({ ticker }: { ticker: string }) => (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
        {ticker.charAt(0)}
    </div>
);

const sectorData = [
    { 
        rank: 1, 
        name: '모듈러 블록체인', 
        sub: '스마트 컨트랙트 플랫폼',
        change: 2.20,
        topCoins: [
            { rank: 1, name: '비쓰리', ticker: 'B3', change: 176.04, icon: DefaultIcon },
            { rank: 2, name: '옵티미즘', ticker: 'OP', change: 2.90, icon: DefaultIcon },
            { rank: 3, name: '아비트럼', ticker: 'ARB', change: 2.61, icon: DefaultIcon },
        ]
    },
    { 
        rank: 2, 
        name: '렌딩', 
        sub: '디파이 / 예치',
        change: 2.12,
        topCoins: [
            { rank: 1, name: '에이브', ticker: 'AAVE', change: 2.80, icon: DefaultIcon },
            { rank: 2, name: '월드리버티파이낸셜', ticker: 'WLFI', change: 1.96, icon: DefaultIcon },
            { rank: 3, name: '오일러', ticker: 'EUL', change: 0.52, icon: DefaultIcon },
        ]
    },
    { 
        rank: 3, 
        name: '유동화 스테이킹', 
        sub: '디파이 / 예치',
        change: 1.76,
        topCoins: [
            { rank: 1, name: '이더파이', ticker: 'ETHFI', change: 3.79, icon: DefaultIcon },
            { rank: 2, name: '솔레이어', ticker: 'LAYER', change: 2.15, icon: DefaultIcon },
            { rank: 3, name: '펜들', ticker: 'PENDLE', change: 1.08, icon: DefaultIcon },
        ]
    },
    { 
        rank: 4, 
        name: '오라클', 
        sub: '인프라 / 디앱 인프라',
        change: 1.51,
        topCoins: [
            { rank: 1, name: '피스네트워크', ticker: 'PYTH', change: 1.97, icon: DefaultIcon },
            { rank: 2, name: '체인링크', ticker: 'LINK', change: 1.61, icon: DefaultIcon },
            { rank: 3, name: '에이피아이쓰리', ticker: 'API3', change: 1.32, icon: DefaultIcon },
        ]
    },
    { 
        rank: 5, 
        name: 'DID', 
        sub: '인프라 / 유저 인프라',
        change: 1.51,
        topCoins: [
            { rank: 1, name: '월드코인', ticker: 'WLD', change: 2.02, icon: DefaultIcon },
            { rank: 2, name: '이더리움네임서비스', ticker: 'ENS', change: 0.90, icon: DefaultIcon },
            { rank: 3, name: '시빅', ticker: 'CVC', change: -1.20, icon: DefaultIcon },
        ]
    },
    { 
        rank: 6, 
        name: '소셜/DAO', 
        sub: '문화/엔터테인먼트',
        change: 0.91,
        topCoins: [
            { rank: 1, name: '조라', ticker: 'ZORA', change: 4.72, icon: DefaultIcon },
            { rank: 2, name: '래드웍스', ticker: 'RAD', change: 0.82, icon: DefaultIcon },
            { rank: 3, name: '사이버', ticker: 'CYBER', change: -0.97, icon: DefaultIcon },
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

const SectorCard = ({ data }: { data: typeof sectorData[0] }) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                {data.rank}
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold">{data.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">{data.sub}</p>
                            </div>
                        </div>
                    </div>
                    <ChangeIndicator change={data.change} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 pt-3 border-t">
                    {data.topCoins.map(coin => (
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
            </CardContent>
        </Card>
    )
}

export default function SectorRanking() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {sectorData.map(sector => (
               <SectorCard key={sector.rank} data={sector} />
           ))}
        </div>
    );
}
