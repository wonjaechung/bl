'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

const marketData = [
  { name: '비트코인', value: '98,000,000', change: -0.5, isCrypto: true, symbol: '₩' },
  { name: '이더리움', value: '4,500,000', change: 0.1, isCrypto: true, symbol: '₩' },
  { name: 'S&P 500', value: '5,477.90', change: -0.16, isCrypto: false, symbol: '' },
  { name: '나스닥', value: '19,700.43', change: -0.26, isCrypto: false, symbol: '' },
  { name: '코스피', value: '2,774.40', change: -0.70, isCrypto: false, symbol: '' },
  { name: '코스닥', value: '841.52', change: -1.42, isCrypto: false, symbol: '' },
  { name: '김치프리미엄', value: '3.2', change: 0.15, isCrypto: true, symbol: '%' },
  { name: '환율(USD)', value: '1,385.50', change: 0.35, isCrypto: false, symbol: '₩' },
];

// Simple Mini Chart Component
const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 80;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

// Simple seeded random number generator to prevent hydration mismatch
const createSeededRandom = (seedString: string) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash |= 0;
    }
    let seed = Math.abs(hash);
    return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
};

// Generate fake chart data based on change and name (for stable seed)
const getChartData = (change: number, name: string) => {
    const rng = createSeededRandom(name);
    const points = 10;
    const data = [100];
    let current = 100;
    const trend = change > 0 ? 1 : -1;
    const volatility = 2;

    for (let i = 0; i < points - 1; i++) {
        const move = (rng() - 0.4 + (trend * 0.1)) * volatility;
        current += move;
        data.push(current);
    }
    // Force end to match trend roughly
    if (change > 0 && data[data.length-1] < data[0]) data[data.length-1] = data[0] + Math.abs(change)*2;
    if (change < 0 && data[data.length-1] > data[0]) data[data.length-1] = data[0] - Math.abs(change)*2;
    
    return data;
};

export function MarketOverviewCard() {
  return (
    <div className="grid grid-cols-2 gap-2 h-full">
        {marketData.map((item) => {
            const isPositive = item.change >= 0;
            const colorClass = isPositive ? 'text-red-500' : 'text-blue-500';
            const chartColor = isPositive ? '#ef4444' : '#3b82f6';
            const chartData = getChartData(item.change, item.name);

            return (
                <div key={item.name} className="bg-card border border-border/50 rounded-lg p-3 flex flex-col justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                        <div className={`flex items-center text-[10px] font-bold ${colorClass}`}>
                            {isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                            {Math.abs(item.change).toFixed(2)}%
                        </div>
                    </div>
                    
                    <div className="flex items-end justify-between gap-2">
                        <span className="text-sm font-bold tracking-tight">
                            {item.name === '김치프리미엄' ? '' : item.symbol}{item.value}{item.name === '김치프리미엄' ? '%' : ''}
                        </span>
                        <div className="w-12 h-6 opacity-80">
                            <MiniChart data={chartData} color={chartColor} />
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
  );
}
