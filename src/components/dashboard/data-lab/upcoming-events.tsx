import { useState, useRef, useEffect } from "react";
import { CalendarClock, AlertTriangle, TrendingUp, Info, ChevronRight, X, ChevronLeft, Calendar as CalendarIcon, ArrowLeft, Gift, ExternalLink, BarChart3, Wallet, BrainCircuit, History, Zap, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, isToday, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventItem {
  id: string;
  dDay: string; // e.g., "D-2", "D-5", "Today"
  date: string; // Display string like "01.08 (수)"
  dateIso: string; // ISO date string for calendar logic e.g., "2024-01-08"
  title: string;
  type: 'unlock' | 'upgrade' | 'macro' | 'listing' | 'bithumb';
  impact: 'high' | 'medium' | 'low';
  description: string;
  
  // Detailed Data
  time?: string;
  previous?: string;
  forecast?: string;
  actual?: string;
  insight?: string;
  relatedCoins?: { symbol: string, name: string, change?: string }[];
  history?: { date: string, value: string }[];
  tags?: string[];
  
  // New Fields
  scenarios?: { condition: string, sentiment: 'bullish' | 'bearish' | 'neutral', description: string }[];
  pastImpacts?: { date: string, event: string, change: string }[];
}

// Helper to calculate dateIso relative to today for demo purposes
const today = new Date();
const getFutureDateIso = (days: number) => format(addDays(today, days), 'yyyy-MM-dd');

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    dDay: 'D-2',
    date: '01.08 (수)',
    dateIso: getFutureDateIso(2),
    title: '스택스(STX) 나카모토 업그레이드',
    type: 'upgrade',
    impact: 'high',
    description: '비트코인 레이어2 대장주의 대규모 업데이트 (호재)',
    time: '21:00',
    insight: '이번 업그레이드로 sBTC 도입과 비트코인 완결성이 강화됩니다. 스택스 생태계의 가장 중요한 마일스톤 중 하나로, 완료 시 TVL 증가가 기대됩니다.',
    relatedCoins: [{ symbol: 'STX', name: 'Stacks', change: '+5.2%' }, { symbol: 'ALEX', name: 'ALEX', change: '+12.4%' }],
    tags: ['메인넷', '하드포크', '호재']
  },
  {
    id: '2',
    dDay: 'D-4',
    date: '01.10 (금)',
    dateIso: getFutureDateIso(4),
    title: '미국 CPI (소비자물가지수) 발표',
    type: 'macro',
    impact: 'high',
    description: '예상치 상회 시 금리 인하 기대감 하락 주의',
    time: '22:30',
    previous: '3.1%',
    forecast: '3.2%',
    actual: '발표전',
    insight: '시장 예상치(3.2%)를 상회할 경우 연준의 금리 인하 시점이 지연될 수 있어 위험자산(코인)에 단기 악재로 작용할 수 있습니다. 반면 3.0% 이하로 발표 시 강한 반등이 예상됩니다.',
    history: [
        { date: '12월', value: '3.1%' },
        { date: '11월', value: '3.2%' },
        { date: '10월', value: '3.7%' }
    ],
    tags: ['인플레이션', '연준', '변동성확대'],
    scenarios: [
        { condition: '3.3% 이상 (쇼크)', sentiment: 'bearish', description: '금리 인하 기대감 소멸로 비트코인 급락 가능성' },
        { condition: '3.2% (부합)', sentiment: 'neutral', description: '불확실성 해소로 소폭 반등 혹은 횡보' },
        { condition: '3.1% 이하 (서프라이즈)', sentiment: 'bullish', description: '조기 금리 인하 기대감으로 강한 상승 랠리' }
    ],
    pastImpacts: [
        { date: '23.12.12', event: '예상치 부합', change: '+1.2%' },
        { date: '23.11.14', event: '예상치 하회', change: '+3.5%' },
        { date: '23.10.12', event: '예상치 상회', change: '-2.1%' }
    ]
  },
  {
    id: '3',
    dDay: 'D-7',
    date: '01.13 (월)',
    dateIso: getFutureDateIso(7),
    title: '앱토스(APT) 대규모 락업 해제',
    type: 'unlock',
    impact: 'medium',
    description: '약 3,000억원 규모 물량 풀림 (매도 주의)',
    time: '09:00',
    insight: '전체 유통량의 2.5%에 해당하는 물량이 해제됩니다. 과거 패턴상 락업 해제 2-3일 전부터 가격 약세를 보이다가, 해제 직후 불확실성 해소로 반등하는 경향이 있었습니다.',
    previous: '24.8M APT',
    forecast: '24.8M APT',
    relatedCoins: [{ symbol: 'APT', name: 'Aptos', change: '-2.1%' }],
    tags: ['공급과잉', 'VC물량', '단기악재']
  },
  {
    id: '4',
    dDay: 'D-12',
    date: '01.18 (토)',
    dateIso: getFutureDateIso(12),
    title: '이더리움 덴쿤 업그레이드 (테스트넷)',
    type: 'upgrade',
    impact: 'medium',
    description: '가스비 절감을 위한 핵심 업데이트 테스트',
    insight: '레이어2 가스비를 획기적으로 낮추는 EIP-4844가 포함된 핵심 업그레이드입니다. 성공 시 L2 코인(OP, ARB)들의 수혜가 예상됩니다.',
    relatedCoins: [{ symbol: 'ETH', name: 'Ethereum' }, { symbol: 'OP', name: 'Optimism' }, { symbol: 'ARB', name: 'Arbitrum' }],
    tags: ['L2', '가스비절감', 'EIP-4844']
  },
  {
    id: '5',
    dDay: 'D-15',
    date: '01.21 (화)',
    dateIso: getFutureDateIso(15),
    title: 'FOMC 의사록 공개',
    type: 'macro',
    impact: 'high',
    description: '연준 위원들의 향후 금리 방향성 확인',
    time: '04:00',
    insight: '지난 회의에서의 위원들 간 구체적인 발언 내용이 공개됩니다. 매파적(긴축 선호) 발언이 많았을 경우 시장 분위기가 냉각될 수 있습니다.',
    tags: ['금리', '파월', '매크로']
  },
  {
    id: '6',
    dDay: 'D-1',
    date: '01.09 (목)',
    dateIso: getFutureDateIso(1),
    title: '빗썸 10주년 이벤트',
    type: 'bithumb',
    impact: 'low',
    description: '수수료 무료 이벤트 종료 임박',
    insight: '빗썸 창립 10주년 기념 대규모 이벤트가 곧 종료됩니다. 포인트 적립 및 경품 응모 마감을 확인하세요.',
    tags: ['이벤트', '에어드랍', '수수료']
  }
];

interface UpcomingEventsProps {
  isDialogOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideList?: boolean;
}

export function UpcomingEvents({ isDialogOpen: externalOpen, onOpenChange, hideList = false }: UpcomingEventsProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isDialogOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsDialogOpen = onOpenChange || setInternalOpen;

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState("all");
  
  // Detail Drawer State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  // Refs for scrolling logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getTypeLabel = (type: EventItem['type']) => {
    switch (type) {
      case 'unlock': return '공급 폭탄';
      case 'upgrade': return '호재 이슈';
      case 'macro': return '경제 지표';
      case 'listing': return '신규 상장';
      case 'bithumb': return '빗썸 이벤트';
    }
  };

  const getTypeColor = (type: EventItem['type']) => {
    switch (type) {
      case 'unlock': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'upgrade': return 'bg-red-100 text-red-700 border-red-200';
      case 'macro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bithumb': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  
  const getImpactColor = (impact: EventItem['impact']) => {
      switch (impact) {
          case 'high': return 'text-red-500 font-bold';
          case 'medium': return 'text-orange-500 font-medium';
          case 'low': return 'text-slate-500';
      }
  };

  // Filter events based on active tab
  const filteredEventsList = UPCOMING_EVENTS.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'macro') return event.type === 'macro';
    if (activeTab === 'unlock') return event.type === 'unlock';
    if (activeTab === 'bithumb') return event.type === 'bithumb';
    return true;
  });

  // Group events by date for the full view
  const groupedEvents = filteredEventsList.reduce((acc, event) => {
    if (!acc[event.dateIso]) {
      acc[event.dateIso] = [];
    }
    acc[event.dateIso].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  // Handle scroll to sync calendar strip (simplified since strip is gone, but still good to track date)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const scrollPosition = scrollRef.current.scrollTop;
      const headers = Object.keys(eventRefs.current).map(dateIso => ({
        dateIso,
        element: eventRefs.current[dateIso]
      }));

      // Find the header that is currently closest to the top
      let currentVisibleDate = headers[0]?.dateIso;

      for (const { dateIso, element } of headers) {
        if (element && element.offsetTop <= scrollPosition + 100) { 
           currentVisibleDate = dateIso;
        }
      }

      if (currentVisibleDate) {
        const newDate = parseISO(currentVisibleDate);
        if (!isSameDay(newDate, selectedDate)) {
            setSelectedDate(newDate);
        }
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
        scrollElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
        if (scrollElement) {
            scrollElement.removeEventListener('scroll', handleScroll);
        }
    };
  }, [selectedDate]); 

  // Function to scroll to specific date
  const scrollToDate = (date: Date) => {
    setSelectedDate(date);
    const dateIso = format(date, 'yyyy-MM-dd');
    const element = eventRefs.current[dateIso];
    if (element && scrollRef.current) {
        scrollRef.current.scrollTo({
            top: element.offsetTop - 150, // Adjust for padding + header
            behavior: 'smooth'
        });
    }
  };

  return (
    <>
      {!hideList && (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold flex items-center gap-1.5">
            주요 일정
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-[11px] p-3 max-w-[220px] bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5"></span>
                        <div>
                            <span className="font-bold text-foreground">호재 이슈</span>
                            <p className="text-muted-foreground leading-snug mt-0.5">시장 가격 상승에 긍정적인 영향을 줄 수 있는 재료입니다.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                        <div>
                            <span className="font-bold text-foreground">경제 지표</span>
                            <p className="text-muted-foreground leading-snug mt-0.5">금리, 인플레이션 등 거시 경제 흐름을 보여주는 지표입니다.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></span>
                        <div>
                            <span className="font-bold text-foreground">공급 폭탄</span>
                            <p className="text-muted-foreground leading-snug mt-0.5">대규모 락업 해제 등 매도 압력이 커질 수 있는 일정입니다.</p>
                        </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
          >
            전체보기
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {UPCOMING_EVENTS.slice(0, 3).map((event) => (
            <div 
              key={event.id}
              className="flex items-center gap-2.5 p-2 bg-card border border-border rounded-lg shadow-sm hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
              }}
            >
              {/* D-Day Box */}
              <div className={`flex flex-col items-center justify-center w-8 h-8 rounded-md border shrink-0 ${
                event.dDay === 'Today' ? 'bg-red-500 border-red-600 text-white' : 'bg-secondary border-border'
              }`}>
                <span className={`text-[10px] font-bold ${event.dDay === 'Today' ? 'text-white' : 'text-foreground'}`}>
                  {event.dDay}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[9px] font-bold px-1 py-px rounded border ${getTypeColor(event.type)}`}>
                    {getTypeLabel(event.type)}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {event.date}
                  </span>
                </div>
                
                <h4 className="text-[12px] font-bold truncate leading-tight mb-0.5">
                  {event.title}
                </h4>
                {/* Description removed for compact view */}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Main Fullscreen Calendar Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full h-full max-w-full rounded-none border-none flex flex-col p-0 gap-0 overflow-hidden bg-background">
          <DialogHeader className="px-4 py-3 border-b shrink-0 bg-background z-20 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsDialogOpen(false)} className="p-1 -ml-1 hover:bg-muted rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <DialogTitle className="text-lg font-bold">
                        주요 일정 캘린더
                    </DialogTitle>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="p-2 hover:bg-muted rounded-full">
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if(date) {
                                    scrollToDate(date);
                                    // Close popover handled by default behavior or outside click
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start h-9 p-0 bg-transparent gap-2 overflow-x-auto no-scrollbar">
                     <TabsTrigger 
                        value="all" 
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
                     >
                        전체
                     </TabsTrigger>
                     <TabsTrigger 
                        value="macro" 
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-transparent"
                     >
                        경제지표
                     </TabsTrigger>
                     <TabsTrigger 
                        value="unlock" 
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-transparent"
                     >
                        락업해제
                     </TabsTrigger>
                     <TabsTrigger 
                        value="bithumb" 
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:border-transparent"
                     >
                        빗썸이벤트
                     </TabsTrigger>
                </TabsList>
            </Tabs>
          </DialogHeader>
          
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth"
          >
            {/* Render all dates that have events, or just a placeholder if empty */}
            {Object.keys(groupedEvents).sort().map((dateIso) => {
                const date = parseISO(dateIso);
                const dayEvents = groupedEvents[dateIso];
                
                return (
                    <div 
                        key={dateIso} 
                        ref={(el) => (eventRefs.current[dateIso] = el)}
                        className="scroll-mt-[130px]" // Adjusted scroll margin for header height
                    >
                        <h4 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-0">
                            {format(date, 'M월 d일 EEEE', { locale: ko })}
                            <span className="text-xs font-normal text-muted-foreground">일정 {dayEvents.length}개</span>
                        </h4>
                        
                        <div className="space-y-3">
                            {dayEvents.map((event) => (
                                <div 
                                key={event.id}
                                className="flex items-start gap-3 p-3 bg-card border border-border rounded-xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                                onClick={() => setSelectedEvent(event)}
                                >
                                <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg border shrink-0 ${getTypeColor(event.type)} bg-opacity-10 border-opacity-20`}>
                                    {event.type === 'upgrade' && <TrendingUp className="w-5 h-5" />}
                                    {event.type === 'macro' && <CalendarClock className="w-5 h-5" />}
                                    {event.type === 'unlock' && <AlertTriangle className="w-5 h-5" />}
                                    {event.type === 'listing' && <Info className="w-5 h-5" />}
                                    {event.type === 'bithumb' && <Gift className="w-5 h-5" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(event.type)}`}>
                                            {getTypeLabel(event.type)}
                                            </span>
                                            {event.time && <span className="text-[11px] text-muted-foreground">{event.time}</span>}
                                        </div>
                                    </div>
                                    <h4 className="text-[13px] font-bold leading-tight mb-1">
                                    {event.title}
                                    </h4>
                                    <p className="text-[12px] text-muted-foreground leading-snug">
                                    {event.description}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 self-center" />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            
            {Object.keys(groupedEvents).length === 0 && (
                 <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/60 mt-8">
                  <CalendarClock className="w-10 h-10 mb-3 opacity-50" />
                  <p className="text-sm font-medium">해당하는 일정이 없습니다.</p>
                </div>
            )}
            
            {/* Bottom Padding for scroll */}
            <div className="h-20" />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Detail Drawer */}
      <Drawer open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DrawerContent className="max-h-[90vh]">
            {selectedEvent && (
                <>
                <DrawerHeader className="text-left space-y-3 pb-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(selectedEvent.type)}`}>
                                    {getTypeLabel(selectedEvent.type)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {selectedEvent.date} {selectedEvent.time}
                                </span>
                             </div>
                             <DrawerTitle className="text-xl leading-snug">{selectedEvent.title}</DrawerTitle>
                             <DrawerDescription className="text-sm">{selectedEvent.description}</DrawerDescription>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="p-4 space-y-6 overflow-y-auto">
                    {/* Key Metrics Grid - Only for Macro or Unlock */}
                    {(selectedEvent.previous || selectedEvent.forecast) && (
                        <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/30 rounded-xl border border-border/50">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-muted-foreground">이전</span>
                                <span className="text-sm font-semibold">{selectedEvent.previous || '-'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 border-l border-r border-border/50">
                                <span className="text-xs text-muted-foreground">예상</span>
                                <span className="text-sm font-semibold">{selectedEvent.forecast || '-'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-primary font-bold">실제</span>
                                <span className="text-sm font-bold text-primary">{selectedEvent.actual || '대기'}</span>
                            </div>
                        </div>
                    )}

                    {/* AI Insight Section */}
                    {selectedEvent.insight && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-purple-500" />
                                AI 요약
                            </h4>
                            <div className="p-3.5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl">
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    {selectedEvent.insight}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Market Response Scenarios */}
                    {selectedEvent.scenarios && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                시장 대응 시나리오
                            </h4>
                            <div className="space-y-2">
                                {selectedEvent.scenarios.map((scenario, idx) => (
                                    <div key={idx} className="flex gap-3 p-3 bg-secondary/20 rounded-lg border border-border/50">
                                        <div className={`shrink-0 w-1.5 rounded-full ${
                                            scenario.sentiment === 'bullish' ? 'bg-red-500' : 
                                            scenario.sentiment === 'bearish' ? 'bg-blue-500' : 'bg-slate-400'
                                        }`} />
                                        <div className="space-y-1">
                                            <div className="text-xs font-bold flex items-center gap-2">
                                                {scenario.condition}
                                                <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${
                                                    scenario.sentiment === 'bullish' ? 'text-red-600 bg-red-50 border-red-200' : 
                                                    scenario.sentiment === 'bearish' ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-600'
                                                }`}>
                                                    {scenario.sentiment === 'bullish' ? '호재' : scenario.sentiment === 'bearish' ? '악재' : '중립'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-snug">
                                                {scenario.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Market Impact */}
                    {selectedEvent.pastImpacts && (
                        <div className="space-y-2">
                             <h4 className="text-sm font-bold flex items-center gap-2">
                                <History className="w-4 h-4 text-blue-500" />
                                과거 시장 임팩트
                            </h4>
                            <div className="border border-border rounded-xl overflow-hidden text-xs">
                                <div className="grid grid-cols-3 bg-muted/50 p-2 font-medium text-center border-b border-border">
                                    <div>발표일</div>
                                    <div>결과</div>
                                    <div>가격변동</div>
                                </div>
                                {selectedEvent.pastImpacts.map((impact, idx) => (
                                    <div key={idx} className="grid grid-cols-3 p-2 text-center border-b border-border/50 last:border-0">
                                        <div className="text-muted-foreground">{impact.date}</div>
                                        <div>{impact.event}</div>
                                        <div className={impact.change.startsWith('+') ? 'text-red-500 font-bold' : 'text-blue-500 font-bold'}>
                                            {impact.change}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Assets - Hide for Macro events as requested */}
                    {selectedEvent.relatedCoins && selectedEvent.type !== 'macro' && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-muted-foreground" />
                                관련 코인
                            </h4>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {selectedEvent.relatedCoins.map(coin => (
                                    <div key={coin.symbol} className="flex items-center gap-2 p-2.5 bg-card border rounded-lg min-w-[120px]">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                            {coin.symbol[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold">{coin.symbol}</span>
                                            {coin.change && (
                                                <span className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {coin.change}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Tags */}
                    {selectedEvent.tags && (
                         <div className="flex flex-wrap gap-2 pt-2">
                            {selectedEvent.tags.map(tag => (
                                <span key={tag} className="text-[11px] text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                    #{tag}
                                </span>
                            ))}
                         </div>
                    )}

                </div>

                <DrawerFooter className="pt-2 border-t">
                    <Button className="w-full gap-2" variant="default">
                        <ExternalLink className="w-4 h-4" />
                        상세 뉴스/공시 보러가기
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">닫기</Button>
                    </DrawerClose>
                </DrawerFooter>
                </>
            )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
