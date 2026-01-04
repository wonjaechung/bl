'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

const marketData = [
  { name: '비트코인', value: '98,000,000', change: -0.5, isCrypto: true },
  { name: '이더리움', value: '4,500,000', change: 0.1, isCrypto: true },
  { name: 'S&P 500', value: '5,477.90', change: -0.16, isCrypto: false },
  { name: '나스닥 100', value: '19,700.43', change: -0.26, isCrypto: false },
  { name: '골드', value: '2,321.70', change: 0.08, isCrypto: false },
  { name: '코스피', value: '2,774.40', change: -0.70, isCrypto: false },
  { name: '코스닥', value: '841.52', change: -1.42, isCrypto: false },
  { name: '원/달러', value: '1,389.00', change: 0.29, isCrypto: false },
];

const Sparkline = ({ isPositive }: { isPositive: boolean }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-50">
    <path
      d={isPositive ? "M0 25 C 10 20, 20 10, 30 15, 40 5, 50 10, 60 20, 70 15, 80 5" : "M0 5 C 10 10, 20 20, 30 15, 40 25, 50 20, 60 10, 70 15, 80 25"}
      stroke={isPositive ? 'hsl(var(--bullish))' : 'hsl(var(--bearish))'}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const ChangeCell = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-bullish' : 'text-bearish';
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <div className={`flex items-center justify-end font-code font-semibold ${colorClass}`}>
        <Icon className="h-4 w-4 mr-1" />
        {isPositive ? '+' : ''}{value.toFixed(2)}%
    </div>
  );
};


export default function MarketOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
            한눈에 보는 시장 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-y-2">
          {marketData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="font-code text-lg">{item.value}{item.isCrypto && '원'}</p>
              </div>
              <div className="flex items-center">
                <Sparkline isPositive={item.change >= 0} />
                <div className="w-24 text-right">
                    <ChangeCell value={item.change} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
