'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function BtcFearGreedIndex() {
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/btc-metrics?type=fgi');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (typeof json.fearAndGreed === 'number') {
          setIndexValue(json.fearAndGreed);
        }
      } catch (error) {
        console.error('Error fetching fear and greed index:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayValue = indexValue ?? 41; // Default fallback

  let statusText = "중립";
  let statusColor = "text-yellow-500";
  
  if (displayValue > 75) {
      statusText = "극도의 탐욕";
      statusColor = "text-destructive";
  } else if (displayValue > 55) {
      statusText = "탐욕";
      statusColor = "text-red-500";
  } else if (displayValue < 25) {
      statusText = "극도의 공포";
      statusColor = "text-blue-500";
  } else if (displayValue < 45) {
      statusText = "공포";
      statusColor = "text-sky-500";
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
            BTC 공포/탐욕 지수
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-center">
        <p className={cn("font-code text-2xl font-bold", statusColor)}>
          {loading ? '...' : displayValue}
        </p>
        <p className={cn("text-base font-semibold mt-1", statusColor)}>
          {loading ? '...' : statusText}
        </p>
      </CardContent>
    </Card>
  );
}
