'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const topGainersData = [
    { rank: 1, name: 'LONG', price: '$0.00443', change: 26.09, icon: 'LONG' },
    { rank: 2, name: 'FHE', price: '$0.04736', change: 15.98, icon: 'FHE' },
    { rank: 3, name: 'SPSC', price: '$0.00581', change: 13.48, icon: 'SPSC' },
    { rank: 4, name: 'AERGO', price: '$0.06083', change: 12.79, icon: 'AERGO' },
    { rank: 5, name: 'LIGHT', price: '$0.9402', change: 12.38, icon: 'LIGHT' },
];

const topLosersData = [
    { rank: 1, name: 'FRANKLIN', price: '$0.007487', change: -14.02, icon: 'X' },
    { rank: 2, name: 'WHITEWHALI', price: '$0.002164', change: -12.67, icon: 'X' },
    { rank: 3, name: 'CORL', price: '$0.00249', change: -11.40, icon: 'C' },
    { rank: 4, name: 'JELLYJELLY', price: '$0.0905', change: -9.41, icon: 'J' },
    { rank: 5, name: 'IKA', price: '$0.0083', change: -8.19, icon: 'I' },
];

const MoversList = ({ title, data, timeframe, setTimeframe }: { title: string, data: any[], timeframe: string, setTimeframe: (tf: string) => void }) => {
    const isLoser = title.includes('Losers');
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                <Tabs value={timeframe} onValueChange={setTimeframe}>
                    <TabsList className="h-7">
                        <TabsTrigger value="5m" className="text-xs px-2 h-6">5m</TabsTrigger>
                        <TabsTrigger value="30m" className="text-xs px-2 h-6">30m</TabsTrigger>
                        <TabsTrigger value="4h" className="text-xs px-2 h-6">4h</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map(item => (
                        <div key={item.rank} className="flex items-center">
                            <div className="w-8 text-sm text-muted-foreground">{item.rank}</div>
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm mr-3">{item.icon}</div>
                            <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="font-code text-sm text-muted-foreground">{item.price}</p>
                            </div>
                            <Button variant={isLoser ? 'destructive' : 'default'} className={`w-24 font-code text-base ${isLoser ? 'bg-bearish/80' : 'bg-bullish/80'}`}>
                                {isLoser ? '' : '+'}{item.change.toFixed(2)}%
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default function TopMovers() {
    const [timeframe, setTimeframe] = useState('4h');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoversList title="Top Gainers" data={topGainersData} timeframe={timeframe} setTimeframe={setTimeframe} />
            <MoversList title="Top Losers" data={topLosersData} timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>
    );
}
