'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function KimchiPremium() {
  const premium = 1.38;
  const lastMonthAverage = 1.12;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          김치 프리미엄
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <p className="font-code text-2xl font-bold">{premium}%</p>
        <p className="text-sm text-muted-foreground mt-1">저번달 평균: {lastMonthAverage}%</p>
      </CardContent>
    </Card>
  );
}
