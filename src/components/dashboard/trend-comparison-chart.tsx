'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Globe, Coins, TrendingUp, TrendingDown, Check, HelpCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Types & Config ---

interface AssetConfig {
  id: string;
  name: string;
  ticker: string;
  type: 'crypto' | 'index';
  basePrice: number;
}

const ASSET_CONFIG: Record<string, AssetConfig> = {
  BTC: { id: 'BTC', name: '비트코인', ticker: 'BTC', type: 'crypto', basePrice: 98000000 },
  ETH: { id: 'ETH', name: '이더리움', ticker: 'ETH', type: 'crypto', basePrice: 3500000 },
  NASDAQ: { id: 'NASDAQ', name: '나스닥', ticker: 'NDX', type: 'index', basePrice: 17800 },
  KOSPI: { id: 'KOSPI', name: '코스피', ticker: 'KS11', type: 'index', basePrice: 2650 },
  SOL: { id: 'SOL', name: '솔라나', ticker: 'SOL', type: 'crypto', basePrice: 245000 },
  XRP: { id: 'XRP', name: '리플', ticker: 'XRP', type: 'crypto', basePrice: 850 },
  DOGE: { id: 'DOGE', name: '도지코인', ticker: 'DOGE', type: 'crypto', basePrice: 150 },
  AVAX: { id: 'AVAX', name: '아발란체', ticker: 'AVAX', type: 'crypto', basePrice: 55000 },
  S_P500: { id: 'S_P500', name: 'S&P 500', ticker: 'SPX', type: 'index', basePrice: 5100 },
};

const initialAssets = ['BTC', 'ETH', 'NASDAQ', 'KOSPI'];

const assetColors: { [key: string]: string } = {
    BTC: '#F7931A',    // Bitcoin Orange
    ETH: '#627EEA',    // Ethereum Blue
    NASDAQ: '#00599C', // Nasdaq Blue (using a distinct blue)
    KOSPI: '#E84142',  // Kospi Red (often associated with KR market up color, but let's use a distinct color)
    SOL: '#9945FF',
    XRP: '#23292F',
    DOGE: '#C2A633',
    AVAX: '#E84142',
    S_P500: '#111111',
};

// Fallback color generator
const getAssetColor = (asset: string) => {
  if (assetColors[asset]) return assetColors[asset];
  // Hash string to color or random if not found
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
};

// --- Time Range Types ---
type TimeRange = '24H' | '7D' | '30D';

// --- Data Generation ---

const generateChartData = (assets: string[], timeRange: TimeRange) => {
  const data = [];
  let points = 24 * 6; // Default 24H: 10 minute intervals
  let intervalMinutes = 10;
  
  if (timeRange === '7D') {
      points = 7 * 24; // Hourly
      intervalMinutes = 60;
  } else if (timeRange === '30D') {
      points = 30 * 6; // 4-hour intervals
      intervalMinutes = 240;
  }
  
  // Initialize current values
  const currentValues: Record<string, number> = {};
  assets.forEach(a => currentValues[a] = 0);

  for (let i = points; i >= 0; i--) {
    const date = new Date();
    // Subtract interval * i
    date.setMinutes(date.getMinutes() - (i * intervalMinutes));
    
    // Format label based on TimeRange
    let timeLabel = '';
    const hour = date.getHours();
    const minute = date.getMinutes();
    const day = date.getDate();
    
    if (timeRange === '24H') {
        if (minute === 0 && hour % 4 === 0) {
            const ampm = hour >= 12 ? '오후' : '오전';
            const hour12 = hour % 12 || 12;
            timeLabel = `${ampm} ${hour12}시`;
        }
    } else if (timeRange === '7D') {
        if (hour === 0) { // Midnight
             timeLabel = `${date.getMonth() + 1}/${day}`;
        }
    } else if (timeRange === '30D') {
        if (hour === 0 && day % 5 === 0) { // Every 5 days roughly
             timeLabel = `${date.getMonth() + 1}/${day}`;
        }
    }

    const entry: { [key: string]: string | number } = {
      date: timeLabel, 
      displayTime: timeRange === '24H' 
        ? date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit' }),
      fullDate: date.toISOString(),
    };

    assets.forEach(asset => {
      // Random walk with volatility adjusted by TimeRange
      let volatility = 0.08; 
      if (timeRange === '7D') volatility = 0.2;
      if (timeRange === '30D') volatility = 0.5;

      const change = (Math.random() - 0.5) * volatility;
      currentValues[asset] += change;
      entry[asset] = currentValues[asset];
    });
    
    data.push(entry);
  }
  
  // Normalize
  const firstEntry = data[0];
  const normalizedData = data.map(entry => {
    const normalizedEntry: any = { ...entry };
    assets.forEach(asset => {
        normalizedEntry[asset] = (entry[asset] as number) - (firstEntry[asset] as number);
    });
    return normalizedEntry;
  });

  return normalizedData;
};

// --- Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Try to get displayTime from payload if available
    const timeLabel = payload[0]?.payload?.displayTime || label;

    return (
      <div className="rounded border border-border/50 bg-background/95 backdrop-blur-md px-3 py-2 shadow-2xl ring-1 ring-black/5">
        <p className="text-[10px] font-mono text-muted-foreground mb-2 pb-1 border-b border-border/50">{timeLabel}</p>
        <div className="space-y-1.5">
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center justify-between gap-6 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-0.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: pld.color, boxShadow: `0 0 5px ${pld.color}` }} />
                <span className='font-medium text-foreground'>{ASSET_CONFIG[pld.dataKey]?.name || pld.dataKey}</span>
              </div>
              <span className={`font-mono font-medium ${pld.value >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                {pld.value > 0 ? '+' : ''}{pld.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function TrendComparisonChart() {
  const [assets, setAssets] = useState<string[]>(initialAssets);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');

  const chartData = useMemo(() => generateChartData(assets, timeRange), [assets, timeRange]);

  // Calculate current stats from the last data point
  const currentStats = useMemo(() => {
    if (chartData.length === 0) return {};
    const lastPoint = chartData[chartData.length - 1];
    const stats: Record<string, { change: number, price: number }> = {};
    
    assets.forEach(asset => {
      const change = lastPoint[asset] as number;
      const config = ASSET_CONFIG[asset];
      const price = config ? config.basePrice * (1 + change / 100) : 100 * (1 + change / 100);
      stats[asset] = { change, price };
    });
    return stats;
  }, [chartData, assets]);
  
  const removeAsset = (assetToRemove: string) => {
    if (assets.length > 1) {
        setAssets(assets.filter(asset => asset !== assetToRemove));
    }
  };

  const toggleAsset = (assetId: string) => {
      setAssets(prev => {
          if (prev.includes(assetId)) {
              if (prev.length <= 1) return prev;
              return prev.filter(id => id !== assetId);
          } else {
              return [...prev, assetId];
          }
      });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold flex items-center gap-1.5">
                동향 비교
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-[11px] p-3 max-w-[240px] bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl">
                            <div className="space-y-3">
                                <div>
                                    <span className="font-bold text-foreground block mb-1">수익률 추세 비교</span>
                                    <p className="text-muted-foreground leading-snug">
                                        선택한 기간 동안 주요 자산들의 상대적인 수익률 변화를 비교합니다.
                                    </p>
                                </div>
                                <div className="space-y-2 border-t border-border/50 pt-2">
                                    <div className="flex items-start gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                        <div className="leading-snug">
                                            <span className="text-foreground font-semibold">0% 위:</span>
                                            <span className="text-muted-foreground ml-1">시작 시점 대비 상승</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <TrendingDown className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                        <div className="leading-snug">
                                            <span className="text-foreground font-semibold">0% 아래:</span>
                                            <span className="text-muted-foreground ml-1">시작 시점 대비 하락</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </h3>

            <div className="flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs font-medium bg-background border-border/60 shadow-sm">
                            {timeRange}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[80px]">
                        <DropdownMenuItem onClick={() => setTimeRange('24H')}>
                            <span className={timeRange === '24H' ? 'font-bold text-primary' : ''}>24H</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeRange('7D')}>
                            <span className={timeRange === '7D' ? 'font-bold text-primary' : ''}>7D</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeRange('30D')}>
                            <span className={timeRange === '30D' ? 'font-bold text-primary' : ''}>30D</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-7 w-7 bg-background border-border/60 shadow-sm">
                            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[240px]" align="end">
                        <Command>
                            <CommandInput placeholder="종목 검색..." className="h-8 text-xs" />
                            <CommandList>
                                <CommandEmpty className="text-xs">결과 없음</CommandEmpty>
                                <CommandGroup heading="자산 선택" className="[&_[cmdk-group-heading]]:text-xs">
                                    {Object.values(ASSET_CONFIG).map((asset) => {
                                        const isSelected = assets.includes(asset.id);
                                        return (
                                            <CommandItem
                                                key={asset.id}
                                                value={`${asset.name} ${asset.ticker} ${asset.id}`}
                                                onSelect={() => toggleAsset(asset.id)}
                                                className="flex items-center justify-between py-1.5"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs">{asset.name}</span>
                                                    <span className="text-[9px] text-muted-foreground">{asset.ticker}</span>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        <Card className="bg-background border-border mb-4 overflow-hidden shadow-sm">
            <CardContent className="p-0">
                <div className="h-[200px] w-full pt-4 pr-0 bg-gradient-to-b from-muted/20 to-background">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                {assets.map(asset => (
                                    <filter key={asset} id={`glow-${asset}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                ))}
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="1 3" 
                                stroke="hsl(var(--muted-foreground))" 
                                vertical={false} 
                                horizontal={true}
                                opacity={0.1} 
                            />
                            <ReferenceLine 
                                y={0} 
                                stroke="hsl(var(--muted-foreground))" 
                                strokeOpacity={0.3}
                                strokeDasharray="4 4" 
                            />
                            <XAxis 
                                dataKey="date" 
                                tick={false}
                                axisLine={false} 
                                tickLine={false}
                                height={10}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => value === 0 ? '0%' : ''} 
                                width={35}
                                domain={['auto', 'auto']}
                                allowDataOverflow={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', opacity: 0.7 }}
                            />
                            <ChartTooltip 
                                content={<CustomTooltip />} 
                                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
                                isAnimationActive={false}
                            />
                            {assets.map(asset => (
                                <Line
                                    key={asset}
                                    type="monotone"
                                    dataKey={asset}
                                    stroke={getAssetColor(asset)}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))', fill: getAssetColor(asset) }}
                                    animationDuration={1500}
                                    style={{ filter: `drop-shadow(0 0 4px ${getAssetColor(asset)}40)` }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="px-4 py-2 space-y-0 bg-background border-t border-border/40">
                    {assets.map(asset => {
                        const stats = currentStats[asset];
                        const config = ASSET_CONFIG[asset];
                        const color = getAssetColor(asset);
                        const isPositive = stats?.change >= 0;

                        return (
                            <div key={asset} className="group flex items-center justify-between py-1 px-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                    {/* Color Bar */}
                                    <div className="w-0.5 h-4 rounded-full shrink-0" style={{ backgroundColor: color }} />

                                    <div className="flex flex-col min-w-0 justify-center">
                                        <span className="font-bold text-xs truncate leading-tight">{config?.name || asset}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 justify-end shrink-0">
                                        <span className="font-mono text-xs font-medium leading-tight">
                                            {config?.type === 'index' ? '' : (asset === 'BTC' || asset === 'ETH' || asset === 'SOL' || asset === 'XRP' ? '₩' : '$')}
                                            {stats?.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                        <div className={`flex items-center gap-0.5 text-[10px] font-medium px-1 py-0 rounded ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                                            {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                            {isPositive ? '+' : ''}{stats?.change.toFixed(2)}%
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground ml-1" 
                                            onClick={() => removeAsset(asset)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
