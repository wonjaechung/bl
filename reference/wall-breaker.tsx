'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function WallBreaker() {
  const [sellVolume, setSellVolume] = useState(750000);
  const totalWall = 1000000;
  const wallPercentage = (sellVolume / totalWall) * 100;
  const wallHeight = 100 - wallPercentage;
  const isBreakable = wallHeight < 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setSellVolume((prev) => (prev > 950000 ? 100000 : prev + 50000 * Math.random()));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const handleBreakWall = () => {
    toast({
        title: '🔨 매도벽 돌파!',
        description: '돌파 시점에 매수 주문이 체결되었습니다.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">매도벽 돌파</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-full h-24 bg-muted rounded-md flex items-end relative overflow-hidden">
          <div
            className="w-full bg-bearish/30 border-t-4 border-bearish transition-all duration-500 ease-out"
            style={{ height: `${wallHeight}%` }}
          >
             <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                <span className="font-bold text-lg font-headline">매도벽</span>
                <span className="font-code text-sm">{(totalWall - sellVolume).toLocaleString()} BTC</span>
            </div>
          </div>
        </div>
        <Button
          size="lg"
          variant="destructive"
          className={`w-full bg-primary hover:bg-primary/90 ${isBreakable ? 'pulse-red' : ''}`}
          disabled={!isBreakable}
          onClick={handleBreakWall}
        >
          <ShieldOff className="mr-2 h-5 w-5" /> 🔨 매도벽 돌파 (매수)
        </Button>
      </CardContent>
    </Card>
  );
}
