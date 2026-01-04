'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function BithumbVolume() {
    const totalVolume = 2.13;
    const lastMonthAverage = 1.98;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
                빗썸 거래대금
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
         <p className="font-code text-xl font-bold whitespace-nowrap">{totalVolume}조</p>
         <p className="text-sm text-muted-foreground mt-1">저번달 평균: {lastMonthAverage}조</p>
      </CardContent>
    </Card>
  );
}
