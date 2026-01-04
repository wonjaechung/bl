'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sparkline = ({ isPositive, type }: { isPositive: boolean, type: 'golden' | 'dead' }) => (
  <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-70">
    <path
      d={isPositive ? "M0 25 C 10 20, 20 10, 30 15, 40 5, 50 10, 60 20, 70 15, 80 5" : "M0 5 C 10 10, 20 20, 30 15, 40 25, 50 20, 60 10, 70 15, 80 25"}
      stroke={isPositive ? 'hsl(var(--bullish))' : 'hsl(var(--bearish))'}
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {type === 'golden' && <path d="M5 20 L 25 10 L 45 15 L 65 10" stroke="yellow" strokeWidth="1" fill="none" />}
    {type === 'dead' && <path d="M5 10 L 25 20 L 45 15 L 65 20" stroke="yellow" strokeWidth="1" fill="none" />}
  </svg>
);

const crossData = [
    { name: 'BONK', ticker: 'BONK', time: '2일전', type: 'golden' as const, price: 0.034, isPositive: true },
    { name: 'SIX', ticker: 'SIX', time: '4일전', type: 'golden' as const, price: 50.1, isPositive: true },
    { name: 'ROA', ticker: 'ROA', time: '4일전', type: 'dead' as const, price: 87.5, isPositive: false },
    { name: 'BNB', ticker: 'BNB', time: '7일전', type: 'golden' as const, price: 815000, isPositive: true },
    { name: 'PEPE', ticker: 'PEPE', time: '7일전', type: 'dead' as const, price: 0.015, isPositive: false },
    { name: 'AVAX', ticker: 'AVAX', time: '8일전', type: 'golden' as const, price: 48000, isPositive: true },
    { name: 'LINK', ticker: 'LINK', time: '10일전', type: 'dead' as const, price: 25000, isPositive: false },
    { name: 'MATIC', ticker: 'MATIC', time: '11일전', type: 'golden' as const, price: 950, isPositive: true },
    { name: 'TRX', ticker: 'TRX', time: '12일전', type: 'dead' as const, price: 160, isPositive: false },
    { name: 'DOT', ticker: 'DOT', time: '14일전', type: 'golden' as const, price: 10000, isPositive: true },
];

export default function TechnicalAnalysis() {
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
                        <h4 className="font-bold mb-2 text-white">추세 전환 신호란?</h4>
                        <p className="text-sm mb-2">이동평균선 교차로 추세 반전 신호를 포착합니다.</p>
                        <ul className="text-xs space-y-1 mb-2">
                            <li><span className="font-bold text-bullish">골든크로스:</span> 상승 추세 전환 신호</li>
                            <li><span className="font-bold text-destructive">데드크로스:</span> 하락 추세 전환 신호</li>
                        </ul>
                        <div className="pt-2 border-t border-zinc-700">
                            <span className="text-xs font-bold text-zinc-400">계산 기준:</span>
                            <p className="text-xs mt-1">일봉 기준 5일 이동평균선(단기)과 20일 이동평균선(장기)의 교차</p>
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
                      <TableHead className="text-center text-zinc-400">신호</TableHead>
                      <TableHead className="text-right text-zinc-400 whitespace-nowrap">포착 시기</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crossData.map((item, index) => {
                        return (
                            <TableRow key={index} className="border-zinc-700">
                                <TableCell className="whitespace-nowrap px-2">
                                <div className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] md:max-w-none">{item.name}</div>
                                <div className="text-xs text-zinc-400">{item.ticker}</div>
                                </TableCell>
                                <TableCell className="text-right font-code whitespace-nowrap px-2 text-sm">{item.price.toLocaleString('ko-KR', { maximumFractionDigits: item.price < 1 ? 4 : 0 })}원</TableCell>
                                <TableCell className="justify-end min-w-[100px] hidden md:flex">
                                    <Sparkline isPositive={item.isPositive} type={item.type} />
                                </TableCell>
                                <TableCell className="text-center px-2">
                                    <div className="flex flex-col items-center">
                                        <Badge variant={item.type === 'golden' ? 'bullish' : 'destructive'} className="mb-1 whitespace-nowrap text-xs">
                                            {item.type === 'golden' ? '골든크로스' : '데드크로스'}
                                        </Badge>
                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap hidden sm:inline">
                                            {item.type === 'golden' ? '5일선 > 20일선' : '5일선 < 20일선'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-code whitespace-nowrap align-middle px-2 text-sm">{item.time}</TableCell>
                            </TableRow>
                        )
                    })}
                  </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
