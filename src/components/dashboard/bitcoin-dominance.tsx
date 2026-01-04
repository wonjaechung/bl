'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function BitcoinDominance() {
  const [data, setData] = useState<{ dominance: number; dominanceLastMonthAvg: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/btc-metrics?type=fgi');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching dominance data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const dominance = data?.dominance ? data.dominance.toFixed(2) : '54.2';
  const lastMonthAverage = data?.dominanceLastMonthAvg ? data.dominanceLastMonthAvg.toFixed(2) : '52.5';
  
  // Convert string to number for progress bar
  const domValue = parseFloat(dominance as string);

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 text-muted-foreground">
          BTC 도미넌스
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="font-code text-sm font-bold">{loading ? '...' : dominance}%</p>
        <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted">
                <div 
                    className="absolute h-full rounded-full bg-orange-500" 
                    style={{ width: `${Math.min(domValue, 100)}%`}}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span>알트강세</span>
                <span>비트강세</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
