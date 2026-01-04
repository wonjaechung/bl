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
  let progressColor = "bg-yellow-500";
  
  if (displayValue > 75) {
      statusText = "극도의 탐욕";
      statusColor = "text-destructive"; // Red for Greed usually in crypto FGI? Actually Greed is usually Green in crypto, Fear is Red. 
      // Wait, standard FGI: 0(Fear/Red) -> 100(Greed/Green).
      // Let's check the previous code logic.
      // Previous code: >75 text-destructive (Red?). >55 text-red-500. <25 text-blue-500.
      // Usually Fear is Low (Red/Orange), Greed is High (Green).
      // Let's stick to typical crypto colors: High(Greed) = Green, Low(Fear) = Red.
      // But the previous code used "destructive" for greed. I will switch to Green for Greed as it's more standard.
      // Or I'll stick to the user's color scheme if I can infer it. 
      // TopMover: Gainer is Green (price-up), Loser is Red (price-down).
      // So Greed (High Price) -> Green. Fear (Low Price) -> Red.
      statusColor = "text-[#22c55e]";
      progressColor = "bg-[#22c55e]";
  } else if (displayValue > 55) {
      statusText = "탐욕";
      statusColor = "text-[#22c55e]";
      progressColor = "bg-[#22c55e]";
  } else if (displayValue < 25) {
      statusText = "극도의 공포";
      statusColor = "text-[#ef4444]";
      progressColor = "bg-[#ef4444]";
  } else if (displayValue < 45) {
      statusText = "공포";
      statusColor = "text-[#ef4444]";
      progressColor = "bg-[#ef4444]";
  } else {
      // Neutral
      statusColor = "text-yellow-500";
      progressColor = "bg-yellow-500";
  }

  return (
    <Card className="h-full border-border/50 shadow-none">
      <CardHeader className="pb-1 p-2">
        <CardTitle className="text-[10px] font-medium flex items-center gap-1 whitespace-nowrap tracking-tight text-muted-foreground">
            BTC 공포/탐욕
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="flex items-baseline gap-1.5">
            <p className={cn("font-code text-sm font-bold", statusColor)}>
            {loading ? '...' : displayValue}
            </p>
            <p className={cn("text-[10px] font-medium", statusColor)}>
            {loading ? '...' : statusText}
            </p>
        </div>
        <div className="w-full mt-1">
            <div className="relative h-1 w-full rounded-full bg-muted overflow-hidden">
                {/* Gradient Background for context */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                {/* Indicator */}
                <div 
                    className="absolute h-full w-1 bg-foreground transform -translate-x-1/2" 
                    style={{ left: `${displayValue}%`}}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5 w-full">
                <span className="text-[#ef4444]">공포</span>
                <span className="text-[#22c55e]">탐욕</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
