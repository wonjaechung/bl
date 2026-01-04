'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Landmark } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function M2Supply() {
  const m2Supply = 4100.2; // in Trillion KRW

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          M2 통화량
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-code text-2xl font-bold whitespace-nowrap">{m2Supply.toFixed(1)}조</p>
        <p className="text-sm text-muted-foreground mt-1">글로벌</p>
      </CardContent>
    </Card>
  );
}
