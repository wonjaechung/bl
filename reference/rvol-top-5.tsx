'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  { name: '온도 파이낸스', ticker: 'ONDO', rvol: 3.5, price: 1500, isPositive: true },
  { name: '폴리매쉬', ticker: 'POLYX', rvol: 3.2, price: 450, isPositive: true },
  { name: '미나', ticker: 'MINA', rvol: 2.8, price: 800, isPositive: false },
  { name: '니어프로토콜', ticker: 'NEAR', rvol: 2.5, price: 7500, isPositive: true },
  { name: '수이', ticker: 'SUI', rvol: 2.2, price: 1200, isPositive: false },
];

export default function RvolTop5() {
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
                        <h4 className="font-bold mb-2 text-white">거래량 폭발 (RVOL &gt; 1.0)</h4>
                        <p className="text-sm mb-2">평소보다 거래가 얼마나 활발한지 보여주는 지표입니다. 2.0 이상이면 시장의 관심이 폭발적으로 집중된 상태를 의미합니다.</p>
                        <div className="pt-2 border-t border-zinc-700">
                            <span className="text-xs font-bold text-zinc-400">계산 기준:</span>
                            <p className="text-xs mt-1">최근 24시간 거래량 / 20일 이동평균 거래량</p>
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
              <TableHead className="text-right text-zinc-400">RVOL</TableHead>
              <TableHead className="text-right text-zinc-400">평균 대비</TableHead>
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
                <TableCell className="text-right font-code px-2">{item.rvol.toFixed(1)}</TableCell>
                <TableCell className="text-right px-2">
                  <Badge variant="bullish" className="whitespace-nowrap text-xs">+{((item.rvol - 1) * 100).toFixed(0)}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
