import { useRef, useState, MouseEvent } from "react";
import { BarChart3, Landmark, Wallet, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SmartMoneySectionProps {
  onSelect: (type: 'etf' | 'dat' | 'whale') => void;
}

export function SmartMoneySection({ onSelect }: SmartMoneySectionProps) {
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
    // Add a small delay to allow click event to check isDragging before it resets
    setTimeout(() => setIsDragging(false), 0);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      scrollRef.current.scrollLeft = scrollLeft - walk;
      
      // Determine if it was a drag or a click
      if (Math.abs(walk) > 5) {
        setIsDragging(true);
      }
    }
  };

  const handleClick = (type: 'etf' | 'dat' | 'whale') => {
    if (isDragging) return;
    onSelect(type);
  };

  const items = [
    {
      id: 'etf' as const,
      name: 'ETF (기관)',
      statLabel: '주간 순유입',
      statValue: '+$240M',
      icon: BarChart3,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    {
      id: 'dat' as const,
      name: 'DAT (기업)',
      statLabel: '주간 순매수',
      statValue: '+1,200 BTC',
      icon: Landmark,
      color: 'bg-orange-500/10 text-orange-500'
    },
    {
      id: 'whale' as const,
      name: 'Whale (고래)',
      statLabel: '매수 우위',
      statValue: '62%',
      icon: Wallet,
      color: 'bg-blue-500/10 text-blue-500'
    }
  ];

  return (
    <div className="pt-0 pb-2">
        <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-base font-bold flex items-center gap-1">
                큰손들의 움직임
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
                                    <div className="p-1 rounded bg-indigo-500/10 text-indigo-500 mt-0.5">
                                        <BarChart3 className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground">ETF (기관)</span>
                                        <p className="text-muted-foreground leading-snug mt-0.5">비트코인 현물 ETF의 순유입/유출 현황을 추적하여 기관 투자자의 흐름을 파악합니다.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="p-1 rounded bg-orange-500/10 text-orange-500 mt-0.5">
                                        <Landmark className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground">DAT (기업)</span>
                                        <p className="text-muted-foreground leading-snug mt-0.5">마이크로스트래티지 등 주요 상장 기업들의 비트코인 보유량 변화를 보여줍니다.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="p-1 rounded bg-blue-500/10 text-blue-500 mt-0.5">
                                        <Wallet className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground">Whale (고래)</span>
                                        <p className="text-muted-foreground leading-snug mt-0.5">1,000 BTC 이상 보유한 고래 지갑 수와 거래소 입출금 등 온체인 큰손의 움직임을 분석합니다.</p>
                                    </div>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </h3>
        </div>
        
        <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto pb-2 px-4 space-x-3 cursor-grab active:cursor-grabbing scrollbar-hide"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
        >
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div 
                        key={item.id}
                        className="group relative flex flex-col w-[calc((100%-24px)/3)] min-w-[125px] p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:-translate-y-1 hover:shadow-lg text-left flex-shrink-0 select-none cursor-pointer"
                        onClick={() => handleClick(item.id)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-1.5 rounded-lg ${item.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] font-bold mb-1">{item.name}</div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] text-muted-foreground">{item.statLabel}</span>
                                <span className="text-[10px] font-bold text-red-500 leading-none">{item.statValue}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
