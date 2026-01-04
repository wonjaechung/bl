'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Siren } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const allFeedItems = [
  // Whale
  { id: 1, type: 'whale_buy', ticker: 'BTC', description: '12.5억 원 매수 체결', amount: '9.32 BTC', price: 134250000, time: '12분 전', currentPrice: 134500000 },
  { id: 2, type: 'whale_sell', ticker: 'ETH', description: '7.4억 원 매도 체결', amount: '171.85 ETH', price: 4321760, time: '15분 전', currentPrice: 4310000 },
  { id: 3, type: 'whale_buy', ticker: 'SOL', description: '5.2억 원 매수 체결', amount: '2,150 SOL', price: 241860, time: '18분 전', currentPrice: 243000 },
  { id: 4, type: 'whale_sell', ticker: 'DOGE', description: '3.1억 원 매도 체결', amount: '1,500,000 DOGE', price: 206, time: '22분 전', currentPrice: 205 },
  { id: 5, type: 'whale_buy', ticker: 'XRP', description: '4.8억 원 매수 체결', amount: '5,200,000 XRP', price: 923, time: '25분 전', currentPrice: 930 },
  { id: 6, type: 'whale_sell', ticker: 'AVAX', description: '6.1억 원 매도 체결', amount: '15,250 AVAX', price: 40000, time: '28분 전', currentPrice: 39800 },
  { id: 7, type: 'whale_buy', ticker: 'LINK', description: '3.9억 원 매수 체결', amount: '19,500 LINK', price: 20000, time: '31분 전', currentPrice: 20150 },
  { id: 8, type: 'whale_sell', ticker: 'ADA', description: '2.5억 원 매도 체결', amount: '416,666 ADA', price: 600, time: '34분 전', currentPrice: 595 },
  { id: 9, type: 'whale_buy', ticker: 'MATIC', description: '4.1억 원 매수 체결', amount: '455,555 MATIC', price: 900, time: '37분 전', currentPrice: 905 },
  { id: 10, type: 'whale_sell', ticker: 'DOT', description: '3.3억 원 매도 체결', amount: '41,250 DOT', price: 8000, time: '40분 전', currentPrice: 7980 },

  // Price Surge/Dip
  { id: 11, type: 'price_surge', ticker: 'DOGE', description: '최근 5분간 +3.45% 변동', change: 3.45, time: '3초 전', currentPrice: 205 },
  { id: 12, type: 'price_dip', ticker: 'SOL', description: '최근 5분간 -1.82% 변동', change: -1.82, time: '28분 전', currentPrice: 243000},
  { id: 13, type: 'price_surge', ticker: 'AVAX', description: '최근 5분간 +2.11% 변동', change: 2.11, time: '35분 전', currentPrice: 39800 },
  { id: 14, type: 'price_dip', ticker: 'LINK', description: '최근 5분간 -0.98% 변동', change: -0.98, time: '42분 전', currentPrice: 20150},
  { id: 15, type: 'price_surge', ticker: 'SHIB', description: '최근 5분간 +4.01% 변동', change: 4.01, time: '45분 전', currentPrice: 0.025},
  { id: 16, type: 'price_dip', ticker: 'BTC', description: '최근 5분간 -1.23% 변동', change: -1.23, time: '50분 전', currentPrice: 134500000},
  { id: 17, type: 'price_surge', ticker: 'ORDI', description: '최근 5분간 +5.52% 변동', change: 5.52, time: '52분 전', currentPrice: 55000},
  { id: 18, type: 'price_dip', ticker: 'WLD', description: '최근 5분간 -2.75% 변동', change: -2.75, time: '55분 전', currentPrice: 4000},
  { id: 19, type: 'price_surge', ticker: 'PEPE', description: '최근 5분간 +8.15% 변동', change: 8.15, time: '58분 전', currentPrice: 0.015},
  { id: 20, type: 'price_dip', ticker: 'ETH', description: '최근 5분간 -2.05% 변동', change: -2.05, time: '1시간 전', currentPrice: 4310000},

  // Volume Surge/Dip
  { id: 21, type: 'volume_surge', ticker: 'XRP', description: '최근 5분간 +320% 변동', time: '30분 전', currentPrice: 930 },
  { id: 22, type: 'volume_surge', ticker: 'LINK', description: '최근 5분간 +280% 변동', time: '45분 전', currentPrice: 20150 },
  { id: 23, type: 'volume_surge', ticker: 'ETC', description: '최근 5분간 +550% 변동', time: '1시간 전', currentPrice: 32000 },
  { id: 24, type: 'volume_dip', ticker: 'BCH', description: '최근 5분간 -40% 변동', time: '1시간 5분 전', currentPrice: 550000 },
  { id: 25, type: 'volume_surge', ticker: 'TRX', description: '최근 5분간 +210% 변동', time: '1시간 10분 전', currentPrice: 160 },
  { id: 26, type: 'volume_dip', ticker: 'ATOM', description: '최근 5분간 -30% 변동', time: '1시간 15분 전', currentPrice: 9800 },
  { id: 27, type: 'volume_surge', ticker: 'STX', description: '최근 5분간 +400% 변동', time: '1시간 20분 전', currentPrice: 2500 },
  { id: 28, type: 'volume_surge', ticker: 'IMX', description: '최근 5분간 +350% 변동', time: '1시간 25분 전', currentPrice: 2200 },
  { id: 29, type: 'volume_dip', ticker: 'NEAR', description: '최근 5분간 -55% 변동', time: '1시간 30분 전', currentPrice: 7500 },
  { id: 30, type: 'volume_surge', ticker: 'SEI', description: '최근 5분간 +300% 변동', time: '1시간 35분 전', currentPrice: 500 },

  // Order Surge/Dip
  { id: 31, type: 'order_surge', ticker: 'ADA', description: '최근 5분간 +250% 변동', time: '32분 전', currentPrice: 595 },
  { id: 32, type: 'order_surge', ticker: 'MATIC', description: '최근 5분간 +400% 변동', time: '50분 전', currentPrice: 905 },
  { id: 33, type: 'order_dip', ticker: 'SOL', description: '최근 5분간 -60% 변동', time: '1시간 2분 전', currentPrice: 243000},
  { id: 34, type: 'order_surge', ticker: 'BTC', description: '최근 5분간 +300% 변동', time: '1시간 4분 전', currentPrice: 134500000},
  { id: 35, type: 'order_dip', ticker: 'ETH', description: '최근 5분간 -50% 변동', time: '1시간 6분 전', currentPrice: 4310000},
  { id: 36, type: 'order_surge', ticker: 'DOGE', description: '최근 5분간 +500% 변동', time: '1시간 8분 전', currentPrice: 205},
  { id: 37, type: 'order_dip', ticker: 'TUSD', description: '최근 5분간 -70% 변동', time: '1시간 12분 전', currentPrice: 1370},
  { id: 38, type: 'order_surge', ticker: 'ARB', description: '최근 5분간 +180% 변동', time: '1시간 14분 전', currentPrice: 1100},
  { id: 39, type: 'order_surge', ticker: 'SUI', description: '최근 5분간 +220% 변동', time: '1시간 16분 전', currentPrice: 1250},
  { id: 40, type: 'order_dip', ticker: 'BLUR', description: '최근 5분간 -45% 변동', time: '1시간 18분 전', currentPrice: 350},
];


const feedTabs = [
  { value: 'whale', label: '고래 동향' },
  { value: 'price_change', label: '시세 변동' },
  { value: 'volume_change', label: '거래량 변동' },
  { value: 'order_change', label: '주문량 변동' },
];


const QuickOrderBar = ({ onOrder, isSell = false }: { onOrder: (amount: number | string) => void, isSell?: boolean }) => {
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

const FeedItem = ({ item, activeOrder, onSnipeClick, onOrder }: any) => {
    const isWhale = item.type.includes('whale');
    const isPriceChange = item.type.startsWith('price_');
    
    let badgeVariant: "default" | "destructive" | "secondary" | "outline" | "bullish" | "bearish" = "secondary";
    let badgeText = "";
    let signalColor = "";

    if (item.type === 'whale_buy') {
        badgeVariant = "bullish";
        badgeText = "고래 매수";
        signalColor = "text-bullish";
    } else if (item.type === 'whale_sell') {
        badgeVariant = "destructive";
        badgeText = "고래 매도";
        signalColor = "text-destructive";
    } else if (item.type.endsWith('_surge')) {
        badgeVariant = "bullish";
        badgeText = "급등";
        signalColor = "text-bullish";
    } else if (item.type.endsWith('_dip')) {
        badgeVariant = "destructive";
        badgeText = "급락";
        signalColor = "text-destructive";
    } else {
        badgeText = item.type;
    }

    const { id, actionType } = activeOrder || {};
    
    return (
      <div key={item.id}>
        <div className="flex items-center gap-2">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                   <Badge variant={badgeVariant}>
                        {badgeText}
                   </Badge>
                   <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <p className={`font-semibold mt-1`}>
                    <span className={`font-bold mr-2 ${signalColor}`}>{item.ticker}</span>
                    {item.description}
                </p>
                 {isWhale && (
                    <p className="text-sm text-muted-foreground font-code">
                        └ 체결가: {item.price.toLocaleString()}원 | 현재가: {Math.round(item.currentPrice).toLocaleString()}원
                    </p>
                 )}
                 {!isWhale && (
                    <p className="text-sm text-muted-foreground font-code">
                        └ 현재가: {Math.round(item.currentPrice).toLocaleString()}원
                    </p>
                 )}
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => onSnipeClick(item.id, 'buy')}>
                <Zap className={`h-5 w-5 ${id === item.id && actionType === 'buy' ? 'text-primary' : ''}`}/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onSnipeClick(item.id, 'sell')}>
                <Siren className={`h-5 w-5 ${id === item.id && actionType === 'sell' ? 'text-destructive' : ''}`}/>
            </Button>
        </div>
        <AnimatePresence>
            {id === item.id && (
                <QuickOrderBar 
                    onOrder={(amount) => onOrder(amount, actionType === 'sell')} 
                    isSell={actionType === 'sell'} 
                />
            )}
        </AnimatePresence>
      </div>
    );
}

export default function SniperFeed() {
  const [activeOrder, setActiveOrder] = useState<{ id: number; actionType: 'buy' | 'sell' } | null>(null);
  const [feedItems, setFeedItems] = useState(allFeedItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedItems(items => items.map(item => ({
        ...item,
        currentPrice: item.currentPrice * (1 + (Math.random() - 0.5) * 0.005) // Simulate 0.5% price fluctuation
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSnipeClick = (id: number, actionType: 'buy' | 'sell') => {
    if (activeOrder && activeOrder.id === id && activeOrder.actionType === actionType) {
      setActiveOrder(null);
    } else {
      setActiveOrder({ id, actionType });
    }
  };
  
  const handleOrder = (amount: number | string, isSell: boolean = false) => {
    if(isSell) {
        toast({
            title: "🚨 긴급 탈출 실행!",
            description: `보유 물량 ${amount} 시장가 매도 주문이 제출되었습니다.`
        })
    } else {
        toast({
            title: "⚡ 스나이퍼 주문 실행!",
            description: `가용 자산의 ${amount} 시장가 매수 주문이 제출되었습니다.`
        })
    }
    setActiveOrder(null);
  }

  const getFilteredItems = (tabValue: string) => {
    if (tabValue === 'whale') return feedItems.filter(item => item.type.includes('whale'));
    if (tabValue === 'price_change') return feedItems.filter(item => item.type.startsWith('price_'));
    if (tabValue === 'volume_change') return feedItems.filter(item => item.type.startsWith('volume_'));
    if (tabValue === 'order_change') return feedItems.filter(item => item.type.startsWith('order_'));
    return [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">실시간 알림</CardTitle>
        <CardDescription>실시간 시장 동향과 주요 플레이어의 움직임을 포착합니다.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
         <Tabs defaultValue="whale" className="w-full">
          <div className="px-6">
            <TabsList>
              {feedTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {feedTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="space-y-4 p-6 pt-4">
                {getFilteredItems(tab.value).slice(0, 10).map(item => (
                  <FeedItem 
                    key={item.id}
                    item={item} 
                    activeOrder={activeOrder}
                    onSnipeClick={handleSnipeClick}
                    onOrder={handleOrder}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
