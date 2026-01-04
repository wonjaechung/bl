'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function M2Supply() {
  const m2Supply = 4100.2; // in Trillion KRW
  const lastMonth = 4050.0;
  const change = ((m2Supply - lastMonth) / lastMonth) * 100;
  const isPositive = change >= 0;

  // Bar visualization for monthly change (Center at 50%)
  const barWidth = Math.min(Math.abs(change) * 10, 50); // Scale factor
  
  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
          M2 통화량
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="font-code text-sm font-bold whitespace-nowrap">{m2Supply.toFixed(1)}조</p>
         <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted flex items-center justify-center">
                 {/* Center Marker */}
                 <div className="absolute w-0.5 h-2 bg-foreground/20"></div>
                 {/* Change Bar */}
                <div 
                    className={`absolute h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{ 
                        width: `${barWidth}%`,
                        left: isPositive ? '50%' : undefined,
                        right: isPositive ? undefined : '50%'
                    }}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="whitespace-nowrap">저번달 대비</span>
                <span className={`whitespace-nowrap ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(1)}%
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
