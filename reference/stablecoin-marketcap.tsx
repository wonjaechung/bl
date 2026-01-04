'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const marketCap = data?.marketCapKRW ? data.marketCapKRW : 0;
  const monthlyChange = data?.changePercent ? data.changePercent : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          스테이블 시총
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-center">
        <p className="font-code text-2xl font-bold whitespace-nowrap">
          {loading ? '...' : `${marketCap.toFixed(1)}조`}
        </p>
        <p className={`text-sm mt-1 ${monthlyChange >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
          저번달 대비: {loading ? '...' : `${monthlyChange > 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`}
        </p>
      </CardContent>
    </Card>
  );
}
