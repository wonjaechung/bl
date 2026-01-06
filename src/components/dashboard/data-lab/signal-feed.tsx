import { ArrowUpRight, ArrowDownRight, Crosshair, Fish, Activity, Info, Zap, ChevronRight, Siren, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, MouseEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// 시그널 타입 정의
type SignalType = "buy_dip" | "whale_buy" | "breakout" | "issue";

interface SignalItem {
  id: string;
  type: SignalType;
  tokenSymbol: string;
  tokenName: string;
  price: string;
  change: string; // "+5.2%"
  description: string;
  tag: string;
  confidence?: number; // 0-100
  timeAgo?: string;
  amount?: string;
}

const MOCK_SIGNALS: SignalItem[] = [
  {
    id: "1",
    type: "buy_dip",
    tokenSymbol: "XRP",
    tokenName: "리플",
    price: "923",
    change: "+0.8%",
    description: "4.8억 원 매수 체결",
    tag: "고래매수",
    confidence: 85,
    timeAgo: "방금 전"
  },
  {
    id: "2",
    type: "whale_buy",
    tokenSymbol: "DOGE",
    tokenName: "도지코인",
    price: "206",
    change: "-1.5%",
    description: "3.1억 원 매도 체결",
    tag: "고래매도",
    confidence: 90,
    timeAgo: "12분 전"
  },
  {
    id: "3",
    type: "breakout",
    tokenSymbol: "BTC",
    tokenName: "비트코인",
    price: "134.2M",
    change: "+0.5%",
    description: "12.5억 원 매수 체결",
    tag: "고래매수",
    confidence: 70,
    timeAgo: "30분 전"
  }
];

// Mock Data for Full View
const WHALE_ALERTS = [
    { id: '1', type: 'buy', coin: 'BTC', amount: '12.5억 원', price: '134,250,000원', time: '12분 전', change: '+0.5%' },
    { id: '2', type: 'sell', coin: 'ETH', amount: '7.4억 원', price: '4,321,760원', time: '15분 전', change: '-0.2%' },
    { id: '3', type: 'buy', coin: 'SOL', amount: '5.2억 원', price: '241,860원', time: '18분 전', change: '+1.2%' },
    { id: '4', type: 'sell', coin: 'DOGE', amount: '3.1억 원', price: '206원', time: '22분 전', change: '-1.5%' },
    { id: '5', type: 'buy', coin: 'XRP', amount: '4.8억 원', price: '923원', time: '25분 전', change: '+0.8%' },
    { id: '6', type: 'sell', coin: 'AVAX', amount: '6.1억 원', price: '40,000원', time: '28분 전', change: '-2.1%' },
    { id: '7', type: 'buy', coin: 'LINK', amount: '3.9억 원', price: '20,000원', time: '31분 전', change: '+3.4%' },
];

interface SignalFeedProps {
  onBuyClick: (symbol: string, type?: 'buy' | 'sell') => void;
}

export function SignalFeed({ onBuyClick }: SignalFeedProps) {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = (e: MouseEvent) => {
    setIsDown(true);
    setIsDragging(false);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDown(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 0);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollRef.current.scrollLeft = scrollLeft - walk;
      
      if (Math.abs(walk) > 5) {
        setIsDragging(true);
      }
    }
  };
  
  const getIconAndColor = (type: SignalType) => {
    switch (type) {
      case "buy_dip":
        return { icon: Fish, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "whale_buy":
        return { icon: Fish, color: "text-red-500", bg: "bg-red-500/10" };
      case "breakout":
        return { icon: Fish, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      default:
        return { icon: Info, color: "text-gray-500", bg: "bg-gray-500/10" };
    }
  };

  return (
    <>
    <div className="pt-0 pb-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-base font-bold flex items-center gap-1">
            실시간 알림
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors ml-0.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-[11px] p-3 max-w-[220px] bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl">
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 mt-0.5">
                                    <Fish className="w-3 h-3" />
                                </div>
                                <div>
                                    <span className="font-bold text-foreground">고래 매수</span>
                                    <p className="text-muted-foreground leading-snug mt-0.5">대규모 자금이 유입되는 매수 체결을 실시간으로 감지합니다.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="p-1 rounded bg-red-500/10 text-red-500 mt-0.5">
                                    <Fish className="w-3 h-3" />
                                </div>
                                <div>
                                    <span className="font-bold text-foreground">고래 매도</span>
                                    <p className="text-muted-foreground leading-snug mt-0.5">대량 매도 발생 시 경고 신호를 보내, 급락 위험을 알립니다.</p>
                                </div>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </h3>
        <button 
            onClick={() => setIsFullViewOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
        >
            전체보기
            <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex w-full overflow-x-auto pb-2 px-4 space-x-3 cursor-grab active:cursor-grabbing scrollbar-hide"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {MOCK_SIGNALS.map((signal) => {
          const { icon: Icon, color, bg } = getIconAndColor(signal.type);
          const isPositive = signal.change.startsWith("+");

          return (
            <div 
              key={signal.id}
              className="group relative flex flex-col w-[calc((100%-24px)/3)] min-w-[125px] p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:-translate-y-1 hover:shadow-lg text-left flex-shrink-0 select-none cursor-pointer"
              onMouseUp={(e) => {
                  // If it wasn't a drag, trigger the click
                  if (!isDragging) {
                      onBuyClick(signal.tokenSymbol);
                  }
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <Badge 
                    variant="outline" 
                    className={`rounded-md px-1.5 py-0.5 text-[10px] h-auto border-0 ${
                        signal.tag === '고래매수' 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                >
                    {signal.tag}
                </Badge>
                <span className={`text-[9px] font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                    {signal.change}
                </span>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-bold truncate">{signal.tokenName}</span>
                    <span className="text-[9px] text-muted-foreground">{signal.tokenSymbol}</span>
                </div>
                
                <div className="text-[9px] text-muted-foreground font-medium line-clamp-2 leading-snug">
                    {signal.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Full View Drawer */}
    <Drawer open={isFullViewOpen} onOpenChange={setIsFullViewOpen}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="text-left pb-0">
                <DrawerTitle className="text-lg font-bold">실시간 시장 감지</DrawerTitle>
                <DrawerDescription>
                    시장의 특이사항을 실시간으로 알려드립니다.
                </DrawerDescription>
            </DrawerHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col pt-4">
                <Tabs defaultValue="whale" className="w-full flex-1 flex flex-col">
                    <div className="px-4 mb-2">
                        <TabsList className="w-full justify-start h-9 p-0 bg-transparent gap-2 overflow-x-auto no-scrollbar">
                            <TabsTrigger 
                                value="whale" 
                                className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
                            >
                                고래 동향
                            </TabsTrigger>
                            <TabsTrigger 
                                value="price" 
                                className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
                            >
                                시세 변동
                            </TabsTrigger>
                            <TabsTrigger 
                                value="volume" 
                                className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
                            >
                                거래량 변동
                            </TabsTrigger>
                            <TabsTrigger 
                                value="order" 
                                className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
                            >
                                주문량 변동
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="whale" className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
                        {WHALE_ALERTS.map((alert) => (
                                <div 
                                    key={alert.id} 
                                    className="py-2 border-b border-border/40 last:border-0 hover:bg-muted/20 cursor-pointer -mx-2 px-2 rounded-lg transition-colors"
                                    onClick={() => {
                                        onBuyClick(alert.coin, alert.type === 'buy' ? 'buy' : 'sell');
                                        setIsFullViewOpen(false);
                                    }}
                                >
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge 
                                        variant="outline" 
                                        className={`rounded-md px-1.5 py-0.5 text-[10px] h-auto border-0 ${
                                            alert.type === 'buy' 
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                    >
                                        {alert.type === 'buy' ? '고래 매수' : '고래 매도'}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-bold text-sm mb-0.5">
                                            <span className={alert.type === 'buy' ? 'text-emerald-600' : 'text-red-600'}>
                                                {alert.coin}
                                            </span>
                                            <span className="ml-1 text-foreground">{alert.amount} {alert.type === 'buy' ? '매수 체결' : '매도 체결'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <span>체결가: {alert.price.toLocaleString()}</span>
                                            <span className="w-px h-2 bg-border"></span>
                                            <span>현재가: {alert.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBuyClick(alert.coin, alert.type === 'buy' ? 'buy' : 'sell');
                                                setIsFullViewOpen(false);
                                            }}
                                            className="p-1.5 rounded-full hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-600 transition-colors"
                                            title="바로 주문"
                                        >
                                            <Zap className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
                                            title="알림 설정"
                                        >
                                            <Siren className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                    
                    <TabsContent value="price" className="flex-1 p-4 text-center text-sm text-muted-foreground">
                        시세 변동 알림 내역이 없습니다.
                    </TabsContent>
                     <TabsContent value="volume" className="flex-1 p-4 text-center text-sm text-muted-foreground">
                        거래량 변동 알림 내역이 없습니다.
                    </TabsContent>
                     <TabsContent value="order" className="flex-1 p-4 text-center text-sm text-muted-foreground">
                        주문량 변동 알림 내역이 없습니다.
                    </TabsContent>
                </Tabs>
            </div>
            <DrawerFooter className="pt-2 border-t">
                <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Bell className="w-4 h-4" />
                    알림 설정 하러가기
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
    </>
  );
}
