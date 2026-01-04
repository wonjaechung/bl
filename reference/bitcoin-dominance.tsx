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

  const dominance = data?.dominance ? data.dominance.toFixed(2) : '63.23';
  const lastMonthAverage = data?.dominanceLastMonthAvg ? data.dominanceLastMonthAvg.toFixed(2) : '62.5';

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          BTC 도미넌스
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <p className="font-code text-2xl font-bold">{loading ? '...' : dominance}%</p>
        <p className="text-sm text-muted-foreground mt-1">
          저번달 평균: {loading ? '...' : lastMonthAverage}%
        </p>
      </CardContent>
    </Card>
  );
}
