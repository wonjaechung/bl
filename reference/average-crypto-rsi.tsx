'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AverageCryptoRsi() {
  const rsi = 44.99;
  
  let statusText = "중립";
  let colorClass = "bg-yellow-500";
  if (rsi > 70) {
    statusText = "과매수";
    colorClass = "bg-destructive";
  } else if (rsi < 30) {
    statusText = "과매도";
    colorClass = "bg-bullish";
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
            평균 RSI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <p className="font-code text-xl font-bold">{rsi.toFixed(2)}</p>
        <div className="w-full mt-2 pt-1">
            <div className="relative h-1.5 w-full rounded-full bg-muted">
                <div className={cn("absolute h-full rounded-full", colorClass)} style={{ width: `${rsi}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>과매도</span>
                <span>과매수</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
