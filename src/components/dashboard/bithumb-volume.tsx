'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BithumbVolume() {
    const totalVolume = 2.13;
    const lastMonthAverage = 1.98;
    const diff = totalVolume - lastMonthAverage;
    const isHigher = diff > 0;

    // Logic: Average marker is always at 50% (center)
    // Scale is set so that Average * 2 = 100% width
    const maxScale = lastMonthAverage === 0 ? Math.max(totalVolume, 1) * 2 : lastMonthAverage * 2;
    const currentPercent = Math.min((totalVolume / maxScale) * 100, 100);
    const avgPercent = 50; // Fixed at center

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
                빗썸 거래대금
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
         <p className="font-code text-sm font-bold whitespace-nowrap text-foreground">{totalVolume}조</p>
         <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted">
                <div 
                    className="absolute h-full rounded-full bg-orange-500" 
                    style={{ width: `${currentPercent}%` }}
                ></div>
                {/* Comparison Marker (Center) */}
                <div 
                    className="absolute h-2 w-0.5 bg-foreground/50 top-1/2 -translate-y-1/2" 
                    style={{ left: `${avgPercent}%` }}
                ></div>
            </div>
             <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="whitespace-nowrap">저번주 대비</span>
                <span className={`whitespace-nowrap ${isHigher ? 'text-price-up' : 'text-price-down'}`}>
                    {isHigher ? '+' : ''}{diff.toFixed(2)}조
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
