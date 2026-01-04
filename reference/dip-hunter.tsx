import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Magnet, TrendingUp } from 'lucide-react';

export default function DipHunter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">눌림목 캐처</CardTitle>
        <CardDescription>급등 중인 자산의 조정을 포착하세요.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className='flex items-center gap-2 text-lg'>
            <TrendingUp className="h-6 w-6 text-bullish"/>
            <span className="font-bold">도지코인 급등</span>
            <span className="font-code text-bullish font-semibold">(+15%)</span>
        </div>
        <div className="text-center">
            <p className="text-sm font-bold text-bearish">"지금 사면 물리나?"</p>
            <p className="text-xs text-muted-foreground">변동성이 큰 자산, 신중하게 거래하세요.</p>
        </div>
        <Button size="lg" className="w-full">
            <Magnet className="mr-2 h-5 w-5"/> 현재가 -3% 감시 주문
        </Button>
      </CardContent>
    </Card>
  );
}
