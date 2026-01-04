'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function StablecoinMarketCap() {
  const [data, setData] = useState<{ marketCapKRW: number; changePercent: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/btc-metrics?type=stable');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching stablecoin data:', error);
        // Fallback mock
        setData({ marketCapKRW: 178.5, changePercent: 1.2 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const marketCap = data?.marketCapKRW ?? 0;
  const monthlyChange = data?.changePercent ?? 0;
  
  // Bar visualization for monthly change
  // Center at 50%, range -5% to +5%
  const barWidth = Math.min(Math.abs(monthlyChange) * 10, 50); // Scale factor 10
  const isPositive = monthlyChange >= 0;

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
          스테이블 시총
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="font-code text-sm font-bold whitespace-nowrap">
          {loading ? '...' : `${marketCap.toFixed(1)}조`}
        </p>
         <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted flex items-center justify-center">
                 {/* Center Marker */}
                 <div className="absolute w-0.5 h-2 bg-foreground/20"></div>
                 {/* Change Bar */}
                <div 
                    className={`absolute h-full rounded-full ${isPositive ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ 
                        width: `${barWidth}%`,
                        left: isPositive ? '50%' : undefined,
                        right: isPositive ? undefined : '50%'
                    }}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="whitespace-nowrap">저번달 대비</span>
                <span className={`whitespace-nowrap ${isPositive ? 'text-green-500' : 'text-blue-500'}`}>
                    {loading ? '...' : `${isPositive ? '+' : ''}${monthlyChange.toFixed(1)}%`}
                </span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
