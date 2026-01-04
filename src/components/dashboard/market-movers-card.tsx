import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MarketMoversCard({ timeRange }: { timeRange?: string }) {
  let rising = 26;
  let falling = 202;

  // Simple mock data variation
  if (timeRange === '7D') {
      rising = 145;
      falling = 89;
  } else if (timeRange === '30D') {
      rising = 180;
      falling = 150;
  }

  const total = rising + falling;
  const risingPercentage = (rising / total) * 100;

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-medium flex items-center gap-1 text-muted-foreground">
            상승 비중 (24H)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="font-code text-sm font-bold">{risingPercentage.toFixed(2)}%</p>
        <div className="w-full mt-1">
            <div className="relative h-1.5 w-full rounded-full bg-[#ef4444]">
                <div 
                    className="absolute h-full rounded-full bg-[#22c55e]"
                    style={{ width: `${risingPercentage}%`}}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="font-medium text-[#22c55e]">{rising}</span>
                <span className="font-medium text-[#ef4444]">{falling}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

