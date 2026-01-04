'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KimchiPremium() {
  const premium = 1.38;
  const lastMonthAverage = 1.12;
  const diff = premium - lastMonthAverage;
  const isPositive = diff > 0;

  // Color logic
  const isHigh = premium > 5;
  const isLow = premium < 0; // Reverse premium
  
  const colorClass = isLow ? "text-green-500" : isHigh ? "text-red-500" : "text-indigo-500";
  const barColor = isLow ? "bg-green-500" : isHigh ? "bg-red-500" : "bg-indigo-500";
  
  // Logic: Average marker is always at 50% (center)
  const avgAbs = Math.abs(lastMonthAverage);
  const currentAbs = Math.abs(premium);
  
  // Avoid division by zero
  const maxScale = avgAbs === 0 ? Math.max(currentAbs, 1) * 2 : avgAbs * 2;
  
  const currentPercent = Math.min((currentAbs / maxScale) * 100, 100);
  const avgPercent = 50; // Fixed at center

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
          김치 프리미엄
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className={`font-code text-sm font-bold ${colorClass}`}>+{premium}%</p>
        <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted">
                {/* Current Value Bar */}
                <div 
                    className={`absolute h-full rounded-full ${barColor}`} 
                    style={{ width: `${currentPercent}%` }}
                ></div>
                {/* Average Marker (Center) */}
                <div 
                    className="absolute h-2 w-0.5 bg-foreground/50 top-1/2 -translate-y-1/2" 
                    style={{ left: `${avgPercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="whitespace-nowrap">저번주 대비</span>
                <span className={`whitespace-nowrap ${isPositive ? 'text-price-up' : 'text-price-down'}`}>
                    {isPositive ? '+' : ''}{diff.toFixed(2)}%
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
