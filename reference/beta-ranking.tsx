'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { name: '솔라나', ticker: 'SOL', beta: 1.45, price: 230000, isPositive: true },
  { name: '아발란체', ticker: 'AVAX', beta: 1.82, price: 48000, isPositive: true },
  { name: '체인링크', ticker: 'LINK', beta: 1.21, price: 25000, isPositive: false },
  { name: '이더리움', ticker: 'ETH', beta: 1.05, price: 4500000, isPositive: true },
  { name: '리플', ticker: 'XRP', beta: 0.88, price: 700, isPositive: false },
  { name: '에이다', ticker: 'ADA', beta: 1.33, price: 650, isPositive: true },
  { name: '도지코인', ticker: 'DOGE', beta: 1.67, price: 210, isPositive: true },
  { name: '폴카닷', ticker: 'DOT', beta: 1.15, price: 10000, isPositive: false },
  { name: '라이트코인', ticker: 'LTC', beta: 0.95, price: 110000, isPositive: true },
  { name: '비트코인캐시', ticker: 'BCH', beta: 1.10, price: 550000, isPositive: false },
];

const getStatusVariant = (beta: number): "destructive" | "secondary" | "bullish" => {
    if (beta > 1.2) return 'destructive';
    if (beta < 0.9) return 'bullish';
    return 'secondary';
};


export default function BetaRanking() {
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
                        <h4 className="font-bold mb-2 text-white">베타(Beta)란?</h4>
                        <p className="text-sm mb-2">비트코인 가격 변동에 대한 민감도를 나타냅니다.</p>
                        <ul className="text-xs space-y-1 mb-2">
                            <li><span className="font-bold text-destructive">베타 &gt; 1:</span> 비트코인보다 더 크게 움직임 (고위험 고수익)</li>
                            <li><span className="font-bold text-zinc-400">베타 = 1:</span> 비트코인과 비슷하게 움직임</li>
                            <li><span className="font-bold text-bullish">0 &lt; 베타 &lt; 1:</span> 비트코인보다 적게 움직임 (안정적)</li>
                            <li><span className="font-bold text-blue-400">베타 &lt; 0:</span> 비트코인과 반대로 움직임 (역상관관계)</li>
                        </ul>
                        <div className="pt-2 border-t border-zinc-700">
                            <span className="text-xs font-bold text-zinc-400">계산 기준:</span>
                            <p className="text-xs mt-1">최근 1년치 일봉 데이터 기준 BTC 수익률과의 공분산 / BTC 분산</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700">
                  <TableHead className="text-zinc-400">코인명</TableHead>
                  <TableHead className="text-right text-zinc-400">현재가</TableHead>
                  <TableHead className="text-right text-zinc-400 hidden md:table-cell">주간차트</TableHead>
                  <TableHead className="text-right text-zinc-400">베타</TableHead>
                  <TableHead className="text-right text-zinc-400 whitespace-nowrap">예상 등락</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => {
                  return (
                  <TableRow key={item.ticker} className="border-zinc-700">
                    <TableCell className="px-2">
                      <div className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] md:max-w-none">{item.name}</div>
                      <div className="text-xs text-zinc-400">{item.ticker}</div>
                    </TableCell>
                    <TableCell className="text-right font-code px-2 whitespace-nowrap text-sm">{item.price.toLocaleString()}원</TableCell>
                    <TableCell className="justify-end hidden md:flex">
                        <Sparkline isPositive={item.isPositive} />
                    </TableCell>
                    <TableCell className="text-right font-code px-2">{item.beta.toFixed(2)}</TableCell>
                    <TableCell className="text-right px-2">
                      <Badge variant={getStatusVariant(item.beta)} className="text-xs whitespace-nowrap">
                        {item.beta.toFixed(2)}배
                      </Badge>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
