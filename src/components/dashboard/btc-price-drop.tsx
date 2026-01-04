'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BtcPriceDrop() {
  const [data, setData] = useState<{ dropPercentage: number; athDate: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/btc-metrics');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
        // Fallback mock data for demo if API fails
        setData({ dropPercentage: -30.6, athDate: '2024.12.01' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const drop = data?.dropPercentage ?? -30.6;
  const currentPricePct = 100 + drop; // e.g. 100 + (-30.6) = 69.4%

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
          BTC 고점대비 낙폭
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className={`font-code text-sm font-bold ${drop >= 0 ? 'text-green-500' : 'text-blue-500'}`}>
           {loading ? '...' : `${drop > 0 ? '+' : ''}${drop.toFixed(2)}%`}
        </p>
        <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted">
                {/* Bar representing current price relative to ATH (100%) */}
                <div 
                    className="absolute h-full rounded-full bg-blue-500" 
                    style={{ width: `${Math.max(currentPricePct, 0)}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span>ATH {data?.athDate ?? '...'}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
