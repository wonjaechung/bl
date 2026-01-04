import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AverageCryptoRsi({ timeRange }: { timeRange?: string }) {
  let rsi = 44.99;

  // Mock data variation
  if (timeRange === '7D') {
      rsi = 58.20;
  } else if (timeRange === '30D') {
      rsi = 62.15;
  }
  
  let statusText = "중립";
  let colorClass = "bg-yellow-500";
  if (rsi > 70) {
    statusText = "과매수";
    colorClass = "bg-price-up";
  } else if (rsi < 30) {
    statusText = "과매도";
    colorClass = "bg-price-down";
  }

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 text-muted-foreground">
            평균 RSI (24H)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start p-2 pt-0">
        <p className="font-code text-sm font-bold">{rsi.toFixed(2)}</p>
        <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted">
                <div className={cn("absolute h-full rounded-full", colorClass)} style={{ width: `${rsi}%`}}></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span>과매도</span>
                <span>과매수</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

