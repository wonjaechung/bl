'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MarketMoversCard() {
  const rising = 26;
  const falling = 202;
  const total = rising + falling;
  const risingPercentage = (rising / total) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            상승 비중
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-code text-xl font-bold">{risingPercentage.toFixed(2)}%</p>
        <div className="w-full mt-2 pt-1">
            <div className="relative h-1.5 w-full rounded-full bg-bearish/80">
                <div 
                    className="absolute h-full rounded-full bg-bullish"
                    style={{ width: `${risingPercentage}%`}}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span className="font-medium text-bullish">{rising}</span>
                <span className="font-medium text-bearish">{falling}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
