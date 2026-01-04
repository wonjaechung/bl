'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const topLosersData = [
    { rank: 1, name: 'FRANKLIN', price: 10.4, change: -14.02, ticker: 'FRANKLIN' },
    { rank: 2, name: 'WHITEWHALI', price: 3.0, change: -12.67, ticker: 'WHITEWHALI' },
    { rank: 3, name: 'CORL', price: 3.4, change: -11.40, ticker: 'CORL' },
    { rank: 4, name: 'JELLYJELLY', price: 126, change: -9.41, ticker: 'JELLYJELLY' },
    { rank: 5, name: 'IKA', price: 11.5, change: -8.19, ticker: 'IKA' },
];

export default function TopLoserCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="font-headline text-lg">금일 최고 하락</CardTitle>
                <span className="text-sm text-muted-foreground">24H 기준</span>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topLosersData.map(item => (
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
                            <div className="font-code font-bold text-bearish flex items-center justify-end w-20">
                                {item.change.toFixed(2)}%
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
