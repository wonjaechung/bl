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
    const color = isPositive ? 'text-price-up' : 'text-price-down';

    return (
        <div className={`flex items-center text-[11px] font-code font-semibold whitespace-nowrap ${color}`}>
            <Icon className="h-2.5 w-2.5 mr-0.5 shrink-0" />
            {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
    );
};

export function TopMoverSummaryCard({ type, timeRange }: { type: 'gainer' | 'loser', timeRange?: string }) {
    const isGainer = type === 'gainer';
    
    // Mock data variations based on TimeRange
    const getMockCoin = (type: 'gainer' | 'loser', range: string = '24H'): CoinData => {
        if (type === 'gainer') {
            switch(range) {
                case '7D': return { name: 'Solana', ticker: 'SOL', change: 45.20, logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png' };
                case '30D': return { name: 'Avalanche', ticker: 'AVAX', change: 89.12, logoUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' };
                default: return { name: 'Zcash', ticker: 'ZEC', change: 12.54, logoUrl: 'https://cryptologos.cc/logos/zcash-zec-logo.png' };
            }
        } else {
             switch(range) {
                case '7D': return { name: 'XRP', ticker: 'XRP', change: -12.40, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' };
                case '30D': return { name: 'Cardano', ticker: 'ADA', change: -25.50, logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png' };
                default: return { name: 'TRON', ticker: 'TRX', change: -5.32, logoUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png' };
            }
        }
    };

    const mockCoin = getMockCoin(type, timeRange);
    const coin: CoinData | null = mockCoin;
    const loading = false;

    return (
        <Card className="h-full border-border/50 shadow-none">
            <CardContent className="p-2 flex flex-col justify-between h-full gap-1">
                <div className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                    {isGainer ? '최고 상승 (24H)' : '최고 하락 (24H)'}
                </div>
                {loading ? (
                    <div className="flex items-center justify-center h-5">
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    </div>
                ) : coin ? (
                    <div className="flex items-center justify-between text-xs gap-1">
                        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden flex-1">
                            <img
                                src={coin.logoUrl}
                                alt={`${coin.name} logo`}
                                width={16}
                                height={16}
                                className="rounded-full object-cover w-4 h-4 shrink-0"
                            />
                            <span className="font-bold text-xs truncate block">{coin.ticker}</span>
                        </div>
                        <div className="shrink-0">
                            <ChangeIndicator change={coin.change} />
                        </div>
                    </div>
                ) : (
                    <div className="text-[9px] text-muted-foreground">데이터 없음</div>
                )}
            </CardContent>
        </Card>
    );
}

