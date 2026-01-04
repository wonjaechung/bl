'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CoinDeathmatch() {
  const [dogePercent, setDogePercent] = useState(55);

  useEffect(() => {
    const interval = setInterval(() => {
        setDogePercent(Math.random() * 80 + 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const shibPercent = 100 - dogePercent;

  return (
    <Card className="flex flex-col">
      <CardHeader className='text-center'>
        <CardTitle className="font-headline text-lg">코인 데스매치</CardTitle>
        <CardDescription>"도지 vs 시바이누, 1시간 뒤 승자는?"</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="relative w-full h-4 rounded-full overflow-hidden bg-muted">
            <div 
                className="absolute left-0 top-0 h-full bg-yellow-500 transition-all duration-500" 
                style={{ width: `${dogePercent}%` }}
            ></div>
            <div 
                className="absolute right-0 top-0 h-full bg-red-500 transition-all duration-500" 
                style={{ width: `${shibPercent}%` }}
            ></div>
             <div className="absolute inset-0 flex justify-center items-center font-bold text-lg text-background z-10">VS</div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center">
                <span className="font-bold text-lg">도지코인</span>
                <span className="font-code text-yellow-600 text-xl">{dogePercent.toFixed(1)}%</span>
            </div>
             <div className="flex flex-col items-center">
                <span className="font-bold text-lg">시바이누</span>
                <span className="font-code text-red-600 text-xl">{shibPercent.toFixed(1)}%</span>
            </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white h-16 text-lg">🐶 도지 베팅</Button>
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white h-16 text-lg">🦊 시바 베팅</Button>
        </div>
      </CardContent>
    </Card>
  );
}
