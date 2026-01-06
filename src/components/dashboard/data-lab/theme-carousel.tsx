import { useRef, useState, MouseEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, Coins, Globe2, ShieldCheck, Zap, Gamepad2, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const THEMES = [
  { 
    id: 'ai', 
    name: 'AI & 빅데이터', 
    growth: '+12.4%', 
    icon: Bot, 
    leader: { name: 'WLD', change: '+15.2%' },
    laggard: { name: 'GRT', change: '+2.1%' },
    color: 'bg-indigo-100 text-indigo-600' 
  },
  { 
    id: 'rwa', 
    name: 'RWA (실물자산)', 
    growth: '+8.2%', 
    icon: Globe2, 
    leader: { name: 'ONDO', change: '+10.5%' },
    laggard: { name: 'POLYX', change: '+1.8%' },
    color: 'bg-emerald-100 text-emerald-600' 
  },
  { 
    id: 'meme', 
    name: '밈(Meme)', 
    growth: '-3.5%', 
    icon: Zap, 
    leader: { name: 'PEPE', change: '-1.2%' },
    laggard: { name: 'DOGE', change: '-4.5%' },
    color: 'bg-yellow-100 text-yellow-700' 
  },
  { 
    id: 'defi', 
    name: '디파이 2.0', 
    growth: '+1.2%', 
    icon: Coins, 
    leader: { name: 'UNI', change: '+3.4%' },
    laggard: { name: 'AAVE', change: '-0.5%' },
    color: 'bg-purple-100 text-purple-600' 
  },
  { 
    id: 'security', 
    name: '보안/DID', 
    growth: '+0.8%', 
    icon: ShieldCheck, 
    leader: { name: 'WLD', change: '+5.2%' },
    laggard: { name: 'CVC', change: '+0.1%' },
    color: 'bg-slate-100 text-slate-600' 
  },
  { 
    id: 'game', 
    name: 'P2E/게이밍', 
    growth: '+4.5%', 
    icon: Gamepad2, 
    leader: { name: 'IMX', change: '+7.8%' },
    laggard: { name: 'GALA', change: '+1.2%' },
    color: 'bg-pink-100 text-pink-600' 
  },
];

interface ThemeCarouselProps {
  onSelectTheme: (themeId: string) => void;
}

export function ThemeCarousel({ onSelectTheme }: ThemeCarouselProps) {
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

  const handleThemeClick = (themeId: string) => {
    if (isDragging) return;
    onSelectTheme(themeId);
  };

  return (
    <div className="pt-2 pb-0">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-base font-bold flex items-center gap-1">
          지금 뜨는 테마
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
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></span>
                    <div>
                      <span className="font-bold text-foreground">대장</span>
                      <p className="text-muted-foreground leading-snug mt-0.5">테마 내에서 가장 높은 상승률을 기록 중인 종목입니다.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                    <div>
                      <span className="font-bold text-foreground">기회</span>
                      <p className="text-muted-foreground leading-snug mt-0.5">테마 상승세에 비해 아직 덜 올라, 추가 상승 여력이 있는 저평가 종목입니다.</p>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <button className="text-[11px] text-muted-foreground flex items-center hover:text-foreground transition-colors">
          전체보기 <ArrowRight className="w-3 h-3 ml-0.5" />
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
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isPositive = theme.growth.startsWith('+');

          return (
            <button
              key={theme.id}
              onClick={() => handleThemeClick(theme.id)}
              className="group relative flex flex-col w-[calc((100%-24px)/3)] min-w-[125px] p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:-translate-y-1 hover:shadow-lg text-left flex-shrink-0 select-none"
            >
                {/* Theme Header */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-6 h-6 rounded-full ${theme.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[10px] text-foreground/90 truncate leading-tight tracking-tight">
                      {theme.name}
                    </h4>
                    <span className={`text-[9px] font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                      {theme.growth}
                    </span>
                  </div>
                </div>

                {/* Leader vs Laggard Comparison */}
                <div className="space-y-1 w-full bg-muted/30 rounded-lg p-1.5">
                  {/* Leader */}
                  <div className="flex justify-between items-center text-[9px]">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-muted-foreground whitespace-nowrap flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                        대장
                      </span>
                      <span className="font-medium truncate max-w-[40px]">{theme.leader.name}</span>
                    </div>
                    <span className="text-red-500 font-medium whitespace-nowrap ml-0.5">{theme.leader.change}</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-[1px] w-full bg-border/50"></div>

                  {/* Laggard (Opportunity) */}
                  <div className="flex justify-between items-center text-[9px]">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-muted-foreground whitespace-nowrap flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-blue-400 inline-block"></span>
                        기회
                      </span>
                      <span className="font-medium truncate max-w-[40px]">{theme.laggard.name}</span>
                    </div>
                    <span className="text-blue-500 font-semibold whitespace-nowrap ml-0.5">{theme.laggard.change}</span>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

