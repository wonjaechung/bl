'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';

const data = [
  { rank: 1, name: 'BTC', ticker: 'BTC', price: 66000, shortPain: { price: 75000, amount: '12억' }, longPain: { price: 65000, amount: '8억' } },
  { rank: 2, name: 'ETH', ticker: 'ETH', price: 3300, shortPain: { price: 3800, amount: '5억' }, longPain: { price: 3200, amount: '3.5억' } },
  { rank: 3, name: 'SOL', ticker: 'SOL', price: 145, shortPain: { price: 180, amount: '2억' }, longPain: { price: 140, amount: '2억' } },
  { rank: 4, name: 'XRP', ticker: 'XRP', price: 0.46, shortPain: { price: 0.52, amount: '2.5억' }, longPain: { price: 0.45, amount: '1.8억' } },
  { rank: 5, name: 'DOGE', ticker: 'DOGE', price: 0.11, shortPain: { price: 0.14, amount: '1.5억' }, longPain: { price: 0.10, amount: '1억' } },
];

const PainBar = ({ current, high, low }: { current: number, high: number, low: number }) => {
    const totalRange = high - low;
    if (totalRange <= 0) return null;

    const currentPosition = ((current - low) / totalRange) * 100;
    const clampedPosition = Math.max(5, Math.min(95, currentPosition));

    return (
        <div className="relative w-full py-6 px-4 select-none">
            {/* Main Track */}
            <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-secondary rounded-full -translate-y-1/2" />

            {/* Left Label (Long Liq) */}
            <div className="absolute left-4 top-[calc(50%+10px)] text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                ${low.toLocaleString()}
            </div>

            {/* Right Label (Short Liq) */}
            <div className="absolute right-4 top-[calc(50%+10px)] text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                ${high.toLocaleString()}
            </div>

            {/* Current Price Marker */}
            <div 
                className="absolute top-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                style={{ left: `calc(${clampedPosition}% + ${clampedPosition < 50 ? '0px' : '0px'})`, transform: 'translate(-50%, -50%)' }}
            >
                {/* Tooltip-style Label */}
                <div className="mb-3 px-2.5 py-1 bg-[#F7931A] text-white text-[11px] font-bold rounded shadow-sm whitespace-nowrap relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#F7931A]">
                    현재가 ${current.toLocaleString()}
                </div>
                {/* Dot */}
                <div className="w-4 h-4 bg-background border-[3px] border-[#F7931A] rounded-full shadow-md" />
            </div>
        </div>
    );
}

export default function MaxPainChart() {
  const [selectedTicker, setSelectedTicker] = useState('BTC');
  const item = data.find(d => d.ticker === selectedTicker) || data[0];
  
  const longPainPercent = ((item.longPain.price - item.price) / item.price) * 100;
  const shortPainPercent = ((item.shortPain.price - item.price) / item.price) * 100;

  return (
    <Card>
      <CardHeader className="pb-4 pt-4">
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-base flex items-center gap-2">
                온체인 고래 청산 맵
            </CardTitle>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue placeholder="Coin" />
                </SelectTrigger>
                <SelectContent>
                    {data.map((coin) => (
                        <SelectItem key={coin.ticker} value={coin.ticker}>
                            {coin.ticker}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="w-full space-y-6">
            
            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-3">
                {/* Long Liquidation Side */}
                <div className="bg-background rounded-lg p-3 border border-border shadow-sm flex flex-col justify-center items-center text-center h-[100px]">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1">
                        롱 위험구간
                    </div>
                    <div className="text-lg font-bold text-foreground font-code mb-1.5">
                        ${item.longPain.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                         <span className="text-xs font-bold text-red-600 dark:text-red-400 font-code">
                            {longPainPercent.toFixed(2)}%
                        </span>
                        <span className="text-[9px] text-muted-foreground">현재가로부터</span>
                    </div>
                </div>

                {/* Short Liquidation Side */}
                <div className="bg-background rounded-lg p-3 border border-border shadow-sm flex flex-col justify-center items-center text-center h-[100px]">
                    <div className="text-[10px] text-muted-foreground font-medium mb-1">
                        숏 위험구간
                    </div>
                    <div className="text-lg font-bold text-foreground font-code mb-1.5">
                        ${item.shortPain.price.toLocaleString()}
                    </div>
                     <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                         <span className="text-xs font-bold text-green-600 dark:text-green-400 font-code">
                            +{shortPainPercent.toFixed(2)}%
                        </span>
                        <span className="text-[9px] text-muted-foreground">현재가로부터</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-2">
                <Button 
                    className="w-full bg-[#F7931A] hover:bg-[#F7931A]/90 text-white font-bold h-9 text-xs shadow-sm"
                    onClick={() => window.open('https://www.bithumb.com/', '_blank')}
                >
                    BTC 대여하기
                </Button>
                <Button 
                    className="w-full bg-[#26A17B] hover:bg-[#26A17B]/90 text-white font-bold h-9 text-xs shadow-sm"
                    onClick={() => window.open('https://www.bithumb.com/', '_blank')}
                >
                    USDT 대여하기
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
