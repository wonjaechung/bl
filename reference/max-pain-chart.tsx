'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

    return (
        <div className="w-full h-1.5 my-2 rounded-full bg-muted relative mt-4 mb-6">
            <div 
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-foreground rounded-full shadow-sm z-10"
                style={{ left: `${currentPosition}%` }}
            />
            <div 
                className="absolute top-4 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap"
                style={{ left: `${currentPosition}%` }}
            >
                현재가
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
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-lg">Hyperliquid 최대 청산</CardTitle>
            <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-[100px] h-8">
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
      <CardContent className="pt-4 pb-6">
        <div className="w-full">
            <div className="relative flex flex-col">
                <div className="flex justify-between w-full text-xs mb-1">
                    <div className="text-left space-y-0.5">
                        <p className="font-code text-bullish font-semibold">${item.longPain.price.toLocaleString()}</p>
                        <p className="font-code text-bullish/80">{longPainPercent.toFixed(2)}%</p>
                    </div>
                        <div className="text-center absolute left-1/2 -translate-x-1/2 top-0 opacity-0">
                            <p className="font-code font-bold text-foreground text-sm">${item.price.toLocaleString()}</p>
                            <p className="text-muted-foreground text-[10px]">현재가</p>
                        </div>
                    <div className="text-right space-y-0.5">
                        <p className="font-code text-destructive font-semibold">${item.shortPain.price.toLocaleString()}</p>
                        <p className="font-code text-destructive/80">+{shortPainPercent.toFixed(2)}%</p>
                    </div>
                </div>
                    <PainBar current={item.price} high={item.shortPain.price} low={item.longPain.price} />
                    <div className="flex justify-between w-full text-xs text-muted-foreground font-medium mt-2">
                    <div className="flex flex-col items-start gap-1">
                        <span>{item.longPain.amount} 청산</span>
                        <Button className="h-7 text-xs px-3 bg-[#F7931A] hover:bg-[#F7931A]/90 text-black font-bold border-none shadow-md transition-all hover:scale-105">BTC 대여하기</Button>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span>{item.shortPain.amount} 청산</span>
                        <Button className="h-7 text-xs px-3 bg-[#26A17B] hover:bg-[#26A17B]/90 text-white font-bold border-none shadow-md transition-all hover:scale-105">USDT 대여하기</Button>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
