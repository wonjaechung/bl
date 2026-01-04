'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';

const krwData = [
  { rank: 1, name: '비트코인', ticker: 'BTC', price: 98000000, highPrice: 100000000, highDate: '24.03.14', drop: -2.00 },
  { rank: 2, name: '이더리움', ticker: 'ETH', price: 4500000, highPrice: 5000000, highDate: '24.03.12', drop: -10.00 },
  { rank: 3, name: '리플', ticker: 'XRP', price: 700, highPrice: 850, highDate: '24.04.11', drop: -17.65 },
  { rank: 4, name: '솔라나', ticker: 'SOL', price: 230000, highPrice: 280000, highDate: '24.03.18', drop: -17.86 },
  { rank: 5, name: '도지코인', ticker: 'DOGE', price: 210, highPrice: 280, highDate: '24.04.01', drop: -25.00 },
];

const btcData = [
  { rank: 1, name: '이더리움', ticker: 'ETH', price: 0.045918, highPrice: 0.051000, highDate: '24.03.12', drop: -10.00 },
  { rank: 2, name: '리플', ticker: 'XRP', price: 0.00000714, highPrice: 0.00000867, highDate: '24.04.11', drop: -17.65 },
  { rank: 3, name: '솔라나', ticker: 'SOL', price: 0.00234693, highPrice: 0.00285714, highDate: '24.03.18', drop: -17.86 },
  { rank: 4, name: '도지코인', ticker: 'DOGE', price: 0.00000214, highPrice: 0.00000285, highDate: '24.04.01', drop: -25.00 },
  { rank: 5, name: '에이다', ticker: 'ADA', price: 0.00000653, highPrice: 0.00000880, highDate: '24.03.14', drop: -25.80 },
];

type RankingType = 'KRW' | 'BTC';

export default function FallRanking() {
  const [rankingType, setRankingType] = useState<RankingType>('KRW');
  const data = rankingType === 'KRW' ? krwData : btcData;
  const description = rankingType === 'KRW' ? '코인별 원화고점 대비 하락폭 순위' : '코인별 사토시고점 대비 하락폭 순위';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{description}</CardDescription>
          <div className="flex gap-1 rounded-md bg-muted p-1">
            <Button
              size="sm"
              variant={rankingType === 'KRW' ? 'default' : 'ghost'}
              onClick={() => setRankingType('KRW')}
              className="px-3"
            >
              KRW
            </Button>
            <Button
              size="sm"
              variant={rankingType === 'BTC' ? 'default' : 'ghost'}
              onClick={() => setRankingType('BTC')}
              className="px-3"
            >
              BTC
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-4">
            {data.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">{item.rank}</span>
                  <div className="flex items-center gap-3">
                    <Image
                        src={`https://picsum.photos/seed/${item.ticker}/40/40`}
                        alt={`${item.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint={`${item.ticker} logo`}
                    />
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.ticker}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 font-code text-base">
                      <span className="text-muted-foreground line-through decoration-muted-foreground/50">
                        {rankingType === 'KRW' ? item.highPrice.toLocaleString() + '원' : item.highPrice.toPrecision(4)}
                      </span>
                      <span>→</span>
                      <span className="font-bold text-foreground">
                        {rankingType === 'KRW' ? item.price.toLocaleString() + '원' : item.price.toPrecision(4)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      고점 달성일: {item.highDate}
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {item.drop.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
