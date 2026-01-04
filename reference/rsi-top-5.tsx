'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

const Sparkline = ({ isPositive }: { isPositive: boolean }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-70">
    <path
      d={isPositive ? "M0 25 C 10 20, 20 10, 30 15, 40 5, 50 10, 60 20, 70 15, 80 5" : "M0 5 C 10 10, 20 20, 30 15, 40 25, 50 20, 60 10, 70 15, 80 25"}
      stroke={isPositive ? 'hsl(var(--bullish))' : 'hsl(var(--bearish))'}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const data = [
  { rank: 1, name: '월드코인', ticker: 'WLD', rsi: 85.2, status: '과매수', price: 4200, isPositive: true },
  { rank: 2, name: '싱귤래리티넷', ticker: 'AGIX', rsi: 82.1, status: '과매수', price: 450, isPositive: true },
  { rank: 3, name: '페치', ticker: 'FET', rsi: 79.5, status: '과매수', price: 2800, isPositive: false },
];

export default function RsiTop5() {
  return (
    <Card className="bg-card-dark border-zinc-800 text-white">
      <CardHeader className="pb-2">
        <div className="flex justify-end">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-zinc-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-4 bg-zinc-900 border-zinc-700 text-zinc-200">
                        <h4 className="font-bold mb-2 text-white">RSI 과매수 (70 이상)</h4>
                        <p className="text-sm mb-2">단기간에 매수세가 몰려 가격이 과열된 상태입니다. 통계적으로 고점일 확률이 높아, 곧 가격 조정이나 하락이 발생할 가능성이 있습니다.</p>
                        <div className="pt-2 border-t border-zinc-700">
                            <span className="text-xs font-bold text-zinc-400">계산 기준:</span>
                            <p className="text-xs mt-1">최근 14개의 4시간봉(4h) 종가를 기준으로 산출</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-400">코인명</TableHead>
              <TableHead className="text-right text-zinc-400">현재가</TableHead>
              <TableHead className="text-right text-zinc-400 hidden md:table-cell">주간차트</TableHead>
              <TableHead className="text-right text-zinc-400">RSI</TableHead>
              <TableHead className="text-right text-zinc-400">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.ticker} className="border-zinc-700">
                <TableCell className="px-2">
                  <div className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] md:max-w-none">{item.name}</div>
                  <div className="text-xs text-zinc-400">{item.ticker}</div>
                </TableCell>
                <TableCell className="text-right font-code px-2 whitespace-nowrap text-sm">{item.price.toLocaleString()}원</TableCell>
                <TableCell className="justify-end hidden md:flex">
                    <Sparkline isPositive={item.isPositive} />
                </TableCell>
                <TableCell className="text-right font-code px-2">{item.rsi.toFixed(1)}</TableCell>
                <TableCell className="text-right px-2">
                  <Badge variant="destructive" className="whitespace-nowrap text-xs">{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
