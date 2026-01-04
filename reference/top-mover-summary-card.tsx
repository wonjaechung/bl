'use client';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react';

type CoinData = {
    name: string;
    ticker: string;
    change: number;
    logoUrl: string;
};

const ChangeIndicator = ({ change }: { change: number }) => {
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-red-500' : 'text-blue-500'; // Korean market style: Red is Up

    return (
        <div className={`flex items-center text-xs font-code font-semibold ${color}`}>
            <Icon className="h-3 w-3 mr-1" />
            {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
    );
};

export function TopMoverSummaryCard({ type }: { type: 'gainer' | 'loser' }) {
    const isGainer = type === 'gainer';
    
    // Mock data for ZEC (Gainer) and TRON (Loser)
    const mockCoin: CoinData = isGainer 
        ? {
            name: 'Zcash',
            ticker: 'ZEC',
            change: 12.54,
            logoUrl: 'https://cryptologos.cc/logos/zcash-zec-logo.png' // Public domain logo or placeholder
        }
        : {
            name: 'TRON',
            ticker: 'TRX',
            change: -5.32,
            logoUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png' // Public domain logo or placeholder
        };

    const coin: CoinData | null = mockCoin;
    const loading = false;

    return (
        <Card className="h-full">
            <CardContent className="p-3 flex flex-col justify-between h-full">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                    {isGainer ? '최고 상승 (24h)' : '최고 하락 (24h)'}
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : coin ? (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={coin.logoUrl}
                                alt={`${coin.name} logo`}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                            />
                            <span className="font-bold">{coin.ticker}</span>
                        </div>
                        <ChangeIndicator change={coin.change} />
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground">데이터 없음</div>
                )}
            </CardContent>
        </Card>
    );
}
