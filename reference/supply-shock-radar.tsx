'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, Zap, Siren } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const SolIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="20" cy="20" r="20" fill="black"/>
        <path d="M10 15H30V12L10 15Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M10 21H30V18L10 21Z" fill="url(#paint1_linear_1_2)"/>
        <path d="M10 27H30V24L10 27Z" fill="url(#paint2_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="10" y1="12" x2="30" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#51FFD3"/>
                <stop offset="1" stopColor="#A455FF"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="10" y1="18" x2="30" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#51FFD3"/>
                <stop offset="1" stopColor="#A455FF"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1_2" x1="10" y1="24" x2="30" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#51FFD3"/>
                <stop offset="1" stopColor="#A455FF"/>
            </linearGradient>
        </defs>
    </svg>
);

const PriceTrend = ({ label, change }: { label: string; change: number }) => {
    const isPositive = change > 0;
    return (
        <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className={`flex items-center font-code text-sm font-semibold ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {isPositive ? '+' : ''}{change.toFixed(1)}%
            </div>
        </div>
    );
};

const QuickOrderBar = ({ onOrder, isSell = false }: { onOrder: (amount: string) => void, isSell?: boolean }) => {
  const [selectedAmount, setSelectedAmount] = useState<string>('25%');

  const buyAmounts = ['10%', '25%', '50%', '100%'];
  const sellAmounts = ['10%', '25%', '50%', '100%'];
  
  const amounts = isSell ? sellAmounts : buyAmounts;
  const actionText = isSell ? '시장가 매도' : '시장가 매수';
  const ActionIcon = isSell ? Siren : Zap;
  const actionVariant = isSell ? 'destructive' : 'default';

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-2 p-2 bg-muted/50 rounded-lg flex items-center gap-2">
        <span className="text-sm font-medium">{isSell ? '긴급 매도:' : '퀵주문:'}</span>
        {amounts.map(amount => (
          <Button
            key={amount}
            size="sm"
            variant={selectedAmount === amount ? (isSell ? 'destructive' : 'default') : 'outline'}
            onClick={() => setSelectedAmount(amount)}
          >
            {amount}
          </Button>
        ))}
        <Button 
            size="sm" 
            variant={actionVariant}
            className="flex-1" 
            onClick={() => onOrder(selectedAmount)}
        >
            <ActionIcon className="mr-2 h-4 w-4" /> {actionText}
        </Button>
      </div>
    </motion.div>
  );
};

const LimitOrderBar = ({ onOrder, currentPrice }: { onOrder: (drop: number, amount: string | number) => void, currentPrice: number }) => {
  const [selectedDrop, setSelectedDrop] = useState<number>(-5);
  const [customDrop, setCustomDrop] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<string>('25%');
  const [customAmount, setCustomAmount] = useState<string>('');


  const dropOptions = [-3, -5, -10];
  const amountOptions = ['10%', '25%', '50%', '100%'];

  const handleOrderClick = () => {
    const finalDrop = customDrop ? parseFloat(customDrop) * -1 : selectedDrop;
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    onOrder(finalDrop, finalAmount);
  };
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-2 p-3 bg-muted/50 rounded-lg flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium shrink-0">지정가 예약:</span>
            {dropOptions.map(drop => (
            <Button
                key={drop}
                size="sm"
                variant={selectedDrop === drop && !customDrop ? 'default' : 'outline'}
                onClick={() => { setSelectedDrop(drop); setCustomDrop(''); }}
            >
                {drop}%
            </Button>
            ))}
            <div className="relative flex-grow">
              <Input
                type="number"
                placeholder="직접입력"
                className="h-9 pr-7"
                value={customDrop}
                onChange={(e) => {
                  setCustomDrop(e.target.value);
                  setSelectedDrop(0);
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium shrink-0">주문 수량:</span>
             {amountOptions.map(amount => (
            <Button
                key={amount}
                size="sm"
                variant={selectedAmount === amount && !customAmount ? 'default' : 'outline'}
                onClick={() => { setSelectedAmount(amount); setCustomAmount('')}}
            >
                {amount}
            </Button>
            ))}
            <div className="relative flex-grow">
              <Input
                type="number"
                placeholder="직접입력"
                className="h-9 pr-7"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount('');
                }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">원</span>
            </div>
        </div>
        <Button 
            size="sm" 
            variant='default'
            className="w-full" 
            onClick={handleOrderClick}
        >
            <Zap className="mr-2 h-4 w-4" /> 지정가 매수
        </Button>
      </div>
    </motion.div>
  );
};


export default function SupplyShockRadar() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [activeOrder, setActiveOrder] = useState<'buy' | 'sell' | 'limit' | null>(null);
  const [currentPrice, setCurrentPrice] = useState(241860);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    
    const priceTimer = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 1000);
    }, 2000);

    return () => {
        clearInterval(timer);
        clearInterval(priceTimer);
    }
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  const unlockedPercent = 88.2;

  const handleMarketOrder = (amount: string) => {
    toast({
        title: "🚨 공급 쇼크 매도!",
        description: `보유 물량 ${amount} 시장가 매도 주문이 제출되었습니다.`
    })
    setActiveOrder(null);
  }

  const handleLimitOrder = (drop: number, amount: string | number) => {
    const targetPrice = currentPrice * (1 + drop / 100);
    const amountString = typeof amount === 'string' ? `가용자산 ${amount}` : `${amount.toLocaleString()}원`;

    toast({
        title: "⚡️ 저가 매수 예약!",
        description: `현재가의 ${drop}% 하락한 ${Math.round(targetPrice).toLocaleString()}원에 ${amountString} 매수 주문이 제출되었습니다.`
    })
    setActiveOrder(null);
  }

  const handleButtonClick = (actionType: 'buy' | 'sell' | 'limit') => {
    if (activeOrder === actionType) {
      setActiveOrder(null);
    } else {
      setActiveOrder(actionType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">락업해제 알림</CardTitle>
        <CardDescription>토큰 락업 해제로 시장 움직임을 예측하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <SolIcon />
                <div>
                    <h3 className="font-bold text-lg">SOL 락업 해제 이벤트</h3>
                    <div className="flex items-baseline gap-4">
                        <p className="font-code text-primary text-xl font-semibold">
                            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </p>
                        <p className="font-code text-foreground text-lg font-semibold">
                            {Math.round(currentPrice).toLocaleString()}원
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Button variant="destructive" className='bg-bearish hover:bg-bearish/90 flex-1 md:flex-initial' onClick={() => handleButtonClick('sell')}>지금 매도</Button>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground flex-1 md:flex-initial" onClick={() => handleButtonClick('limit')}>
                    저가 매수 예약
                </Button>
            </div>
        </div>
        <AnimatePresence>
          {activeOrder === 'sell' && (
            <QuickOrderBar 
              onOrder={handleMarketOrder} 
              isSell={true}
            />
          )}
          {activeOrder === 'limit' && (
            <LimitOrderBar 
              onOrder={handleLimitOrder}
              currentPrice={currentPrice}
            />
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="col-span-1 md:col-span-2 space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">락업해제</span>
                        <span className="text-muted-foreground">락업</span>
                    </div>
                    <Progress value={unlockedPercent} className="h-4" />
                    <div className="flex justify-between mt-1">
                        <span className="font-code font-medium">{unlockedPercent}%</span>
                        <span className="font-code font-medium">{ (100-unlockedPercent).toFixed(1) }%</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <PriceTrend label="24시간" change={-2.5} />
                    <PriceTrend label="1주일" change={8.1} />
                    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                        <span className="text-xs text-muted-foreground">다음 언락</span>
                         <p className="font-code font-semibold text-sm">34.2M SOL</p>
                        <p className="text-xs text-muted-foreground mt-1">시총의 0.5% (약 65억원)</p>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
