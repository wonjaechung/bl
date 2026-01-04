'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          BTC 고점대비 낙폭
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="space-y-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : data ? (
          <>
            <p className={`font-code text-2xl font-bold ${data.dropPercentage >= 0 ? 'text-green-500' : 'text-destructive'}`}>
              {data.dropPercentage > 0 ? '+' : ''}{data.dropPercentage.toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">ATH: {data.athDate}</p>
          </>
        ) : (
          <p className="text-destructive">데이터 로드 실패</p>
        )}
      </CardContent>
    </Card>
  );
}
