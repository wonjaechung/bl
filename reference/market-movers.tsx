'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export default function MarketMovers() {
  const rising = 26;
  const falling = 202;
  const total = rising + falling;
  const risingPercentage = (rising / total) * 100;
  const risingRatio = (rising / total) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            상승 자산 비중
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </CardTitle>
          <span className="text-xs text-muted-foreground">오늘 03:11 기준</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-code text-3xl font-bold">{risingPercentage.toFixed(2)}%</p>
        <div className="w-full mt-4 pt-2">
            <div className="relative h-2 w-full rounded-full bg-bearish/80">
                <div 
                    className="absolute h-full rounded-full bg-bullish"
                    style={{ width: `${risingRatio}%`}}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span className="font-medium text-bullish">상승 {rising}</span>
                <span className="font-medium text-bearish">하락 {falling}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
