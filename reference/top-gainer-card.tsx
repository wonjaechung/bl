'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const topGainersData = [
    { rank: 1, name: 'MINER', price: 3.2, change: 28.93, ticker: 'MINER' },
    { rank: 2, name: 'SAROS', price: 4.1, change: 21.95, ticker: 'SAROS' },
    { rank: 3, name: 'RAVE', price: 578, change: 19.98, ticker: 'RAVE' },
    { rank: 4, name: 'SWARMS', price: 21.4, change: 12.65, ticker: 'SWARMS' },
    { rank: 5, name: 'BANANAS31', price: 5.2, change: 11.99, ticker: 'BANANAS31' },
];

export default function TopGainerCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="font-headline text-lg">금일 최고 상승</CardTitle>
                <span className="text-sm text-muted-foreground">24H 기준</span>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topGainersData.map(item => (
                        <div key={item.rank} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 text-sm">
                            <span className="font-semibold text-muted-foreground w-4 text-center">{item.rank}</span>
                            <div className="flex items-center gap-3">
                                <Image
                                    src={`https://picsum.photos/seed/${item.ticker}/32/32`}
                                    alt={`${item.name} logo`}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover"
                                />
                                <span className="font-semibold">{item.name}</span>
                            </div>
                            <span className="font-code text-muted-foreground justify-self-end">{item.price.toLocaleString()}원</span>
                            <div className="font-code font-bold text-bullish flex items-center justify-end w-20">
                                +{item.change.toFixed(2)}%
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
