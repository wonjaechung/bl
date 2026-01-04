'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, BarChartBig, HelpCircle, List } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

type ViewMode = 'chart' | 'list';
type Timeframe = '1W' | '1M' | '1Y' | 'All';

const btcEtfData = [
    { rank: 1, ticker: 'IBIT', name: 'IBIT (BlackRock)', price: 52.1, changeAbsolute: -0.39, changePercent: -0.74, daily: 162.2, aum: 19890.3, premium: 0.02 },
    { rank: 2, ticker: 'FBTC', name: 'FBTC (Fidelity)', price: 48.5, changeAbsolute: -0.21, changePercent: -0.43, daily: -8.1, aum: 11578.4, premium: -0.01 },
    { rank: 3, ticker: 'BITB', name: 'BITB (Bitwise)', price: 39.2, changeAbsolute: 0.1, changePercent: 0.26, daily: 0, aum: 2510.1, premium: 0.05 },
    { rank: 4, ticker: 'ARKB', name: 'ARKB (Ark 21Shares)', price: 55.8, changeAbsolute: -0.55, changePercent: -0.98, daily: -22.6, aum: 3223.5, premium: -0.03 },
    { rank: 5, ticker: 'GBTC', name: 'GBTC (Grayscale)', price: 63.4, changeAbsolute: -0.81, changePercent: -1.26, daily: -154.9, aum: 21750.6, premium: -0.15 },
];

const ethEtfData = [
    { rank: 1, ticker: 'ETHA', name: 'ETHA (iShares)', price: 35.2, changeAbsolute: 0.12, changePercent: 0.34, daily: 35.5, aum: 11840.0, premium: 0.11 },
    { rank: 2, ticker: 'ETHE', name: 'ETHE (Grayscale)', price: 33.1, changeAbsolute: -0.15, changePercent: -0.45, daily: -15.2, aum: 3460.0, premium: -0.25 },
    { rank: 3, ticker: 'FETH', name: 'FETH (Fidelity)', price: 34.5, changeAbsolute: 0.25, changePercent: 0.73, daily: 12.8, aum: 1340.0, premium: 0.08 },
    { rank: 4, ticker: 'ETHW', name: 'ETHW (Bitwise)', price: 32.8, changeAbsolute: 0.05, changePercent: 0.15, daily: 5.1, aum: 400.92, premium: 0.05 },
];

const solEtfData = [
    { rank: 1, ticker: 'BSOL', name: 'BSOL (Bitwise)', price: 150.5, changeAbsolute: 2.5, changePercent: 1.69, daily: 24.66, aum: 400.74, premium: 0.21 },
    { rank: 2, ticker: 'GSOL', name: 'GSOL (Grayscale)', price: 145.2, changeAbsolute: 1.8, changePercent: 1.25, daily: 2.07, aum: 72.05, premium: -0.32 },
    { rank: 3, ticker: 'FSOL', name: 'FSOL (Fidelity)', price: 148.9, changeAbsolute: 2.1, changePercent: 1.43, daily: 3.49, aum: 50.0, premium: 0.15 },
    { rank: 4, ticker: 'VSOL', name: 'VSOL (VanEck)', price: 147.1, changeAbsolute: 1.9, changePercent: 1.31, daily: 1.94, aum: 35.0, premium: 0.12 },
    { rank: 5, ticker: 'TSOL', name: 'TSOL (21Shares)', price: 146.5, changeAbsolute: 2.2, changePercent: 1.52, daily: 0.48, aum: 20.0, premium: 0.18 },
];

const xrpEtfData = [
    { rank: 1, ticker: 'BXRP', name: 'Bitwise XRP ETF', price: 0.52, changeAbsolute: 0.01, changePercent: 1.96, daily: 8.76, aum: 250.0, premium: 0.35 },
    { rank: 2, ticker: 'CXRP', name: 'Canary XRP ETF', price: 0.51, changeAbsolute: -0.005, changePercent: -0.97, daily: -4.84, aum: 862.80, premium: -0.12 },
    { rank: 3, ticker: 'FXRP', name: 'Franklin XRP ETF', price: 0.53, changeAbsolute: 0.015, changePercent: 2.91, daily: 9.04, aum: 200.0, premium: 0.41 },
    { rank: 4, ticker: 'XRPT', name: 'Grayscale XRP Trust ETF', price: 0.5, changeAbsolute: -0.01, changePercent: -1.96, daily: -2.25, aum: 150.0, premium: -0.55 },
]

const totalBtcAUM = btcEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalEthAUM = ethEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalSolAUM = solEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalXrpAUM = xrpEtfData.reduce((sum, etf) => sum + etf.aum, 0);

const allAssets = [
  { id: 'btc', label: 'BTC', totalAUM: totalBtcAUM },
  { id: 'eth', label: 'ETH', totalAUM: totalEthAUM },
  { id: 'sol', label: 'SOL', totalAUM: totalSolAUM },
  { id: 'xrp', label: 'XRP', totalAUM: totalXrpAUM },
];

const assetColors: { [key: string]: string } = {
  btc: 'hsl(var(--chart-1))',
  eth: 'hsl(var(--chart-2))',
  sol: 'hsl(var(--chart-3))',
  xrp: 'hsl(var(--chart-4))',
  BTC: 'hsl(var(--chart-1))',
  ETH: 'hsl(var(--chart-2))',
  XRP: 'hsl(var(--chart-4))',
  SOL: 'hsl(var(--chart-5))',
  BTC_Price: 'hsl(var(--chart-3))',
};


const formatMillion = (value: number) => {
    if (Math.abs(value) >= 1000) {
        return `${(value / 1000).toFixed(2)}B`;
    }
    return `${value.toFixed(1)}M`;
}

const formatKoreanNumber = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 10000) {
      return `${(value / 10000).toFixed(2)}조`;
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}억`;
}

const FlowCell = ({ value, unit = 'M' }: { value: number; unit?: string }) => {
    const isPositive = value >= 0;
    const colorClass = isPositive ? 'text-bullish' : 'text-destructive';
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
        <div className={`flex items-center justify-end font-code text-sm ${colorClass}`}>
            <Icon className="h-3 w-3 mr-1" />
            {isPositive ? '+' : ''}{value.toLocaleString()}{unit}
        </div>
    );
};

const PriceChangeCell = ({ absolute, percent }: { absolute: number; percent: number }) => {
    const isPositive = percent >= 0;
    const colorClass = isPositive ? 'text-bullish' : 'text-bearish';

    return (
        <div className={`flex flex-col items-end font-code text-sm ${colorClass}`}>
            <span>{isPositive ? '+' : ''}{absolute.toFixed(2)}</span>
            <span className='text-xs opacity-80'>{isPositive ? '+' : ''}{percent.toFixed(2)}%</span>
        </div>
    );
};

const PremiumCell = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const colorClass = isPositive ? 'text-bullish' : 'text-destructive';
    return (
        <div className={`font-code text-sm ${colorClass}`}>
            {isPositive ? '+' : ''}{value.toFixed(2)}%
        </div>
    );
};

const EtfTable = ({ data, totalAUM, assetName }: { data: {rank: number, ticker: string, name: string, price: number, changeAbsolute: number, changePercent: number, daily: number, aum: number, premium: number}[], totalAUM: number, assetName: string }) => (
    <div className="h-full overflow-auto">
        <div className="min-w-[800px]">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead className="w-[100px]">티커</TableHead>
                <TableHead>ETF 이름</TableHead>
                <TableHead className="text-right">가격</TableHead>
                <TableHead className="text-right">가격 변동</TableHead>
                <TableHead className="text-right">일간 순유입</TableHead>
                <TableHead className="text-right">운용자산(AUM)</TableHead>
                <TableHead className="text-right">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='flex items-center justify-end gap-1 cursor-help'>
                                    P/D
                                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <div className="p-2">
                                    <h4 className="font-bold">프리미엄/할인(P/D) 활용법</h4>
                                    <div className="mt-2 space-y-2 text-xs">
                                        <div>
                                            <p className="font-semibold text-bullish">프리미엄 (+): 고평가</p>
                                            <p className="text-muted-foreground">
                                                ETF가 내재가치(NAV)보다 비싸게 거래되는 상태. 강한 매수세나 시장 과열을 의미하며, <span className='font-bold text-foreground'>매도 시점</span>을 고려해볼 수 있습니다.
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-destructive">할인 (-): 저평가</p>
                                            <p className="text-muted-foreground">
                                                ETF가 내재가치(NAV)보다 싸게 거래되는 상태. 약한 매수세나 비관적 시장을 의미하며, <span className='font-bold text-foreground'>매수 기회</span>로 볼 수 있습니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableHead>
                <TableHead className="w-[120px]">시장점유율</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((etf) => (
                <TableRow key={etf.name}>
                    <TableCell className="font-medium text-muted-foreground">{etf.rank}</TableCell>
                    <TableCell>
                        <div className="font-bold">{etf.ticker}</div>
                        <div className="text-xs text-muted-foreground">{assetName}</div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{etf.name}</TableCell>
                    <TableCell className="text-right font-code text-sm">${etf.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <PriceChangeCell absolute={etf.changeAbsolute} percent={etf.changePercent} />
                    </TableCell>
                    <TableCell className="text-right">
                        <FlowCell value={etf.daily} />
                    </TableCell>
                    <TableCell className="text-right font-code text-sm">
                        {formatMillion(etf.aum)}
                    </TableCell>
                    <TableCell className="text-right">
                        <PremiumCell value={etf.premium} />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={(etf.aum / totalAUM) * 100} className="h-2"/>
                            <span className="font-code text-xs w-10 text-right">{((etf.aum / totalAUM) * 100).toFixed(1)}%</span>
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    </div>
);

const generateChartData = (timeframe: Timeframe) => {
  let days = 30;
  if (timeframe === '1W') days = 7;
  if (timeframe === '1M') days = 30;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  let btcPrice = 65000;
  let accumulatedAUM = { BTC: 50000, ETH: 25000, XRP: 10000, SOL: 8000 };

  for (let i = days -1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Price trend
    btcPrice += (Math.random() - 0.5) * 2000;

    // AUM/Flow fluctuations
    const btcFlow = (Math.random() - 0.48) * 800; // Slight positive bias
    const ethFlow = (Math.random() - 0.49) * 400;
    const xrpFlow = (Math.random() - 0.5) * 300;
    const solFlow = (Math.random() - 0.48) * 360;

    accumulatedAUM.BTC += btcFlow;
    accumulatedAUM.ETH += ethFlow;
    accumulatedAUM.XRP += xrpFlow;
    accumulatedAUM.SOL += solFlow;

    if (timeframe === '1W' || timeframe === '1M') {
        // For 1W and 1M, show Net Flow
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(btcFlow),
            ETH: Math.floor(ethFlow),
            XRP: Math.floor(xrpFlow),
            SOL: Math.floor(solFlow),
            BTC_Price: btcPrice,
        });
    } else {
        // For other timeframes, show Total AUM
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(accumulatedAUM.BTC),
            ETH: Math.floor(accumulatedAUM.ETH),
            XRP: Math.floor(accumulatedAUM.XRP),
            SOL: Math.floor(accumulatedAUM.SOL),
            BTC_Price: btcPrice,
        });
    }
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const flowPayload = payload.filter(p => p.dataKey !== 'BTC_Price');
    const pricePayload = payload.find(p => p.dataKey === 'BTC_Price');
    const total = flowPayload.reduce((sum: number, p: any) => sum + p.value, 0);

    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
        <p className="font-bold">{label}</p>
        <hr className="my-1 border-border" />
        {flowPayload.map((p: any) => (
            <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
                {`${p.dataKey}: ${p.value >= 0 ? '+' : ''}${formatKoreanNumber(p.value)}`}
            </p>
        ))}
         <p className="text-sm font-semibold">{`총합: ${total >= 0 ? '+' : ''}${formatKoreanNumber(total)}`}</p>
         {pricePayload && (
            <p className="text-sm" style={{ color: pricePayload.color }}>
                {`BTC 가격: $${pricePayload.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}
            </p>
         )}
      </div>
    );
  }
  return null;
};

const chartAssets = ['BTC', 'ETH', 'XRP', 'SOL'];

const ChartView = ({timeframe, activeAssets, toggleChartAsset}: {timeframe: Timeframe, activeAssets: string[], toggleChartAsset: (asset: string) => void}) => {
    const chartData = useMemo(() => generateChartData(timeframe), [timeframe]);
    const isFlowView = timeframe === '1W' || timeframe === '1M';
    
    return (
        <div className='h-full'>
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(val) => {
                            if (val === 0) return '0';
                            if (Math.abs(val) >= 1000) return `${val / 1000}조`;
                            return `${val}억`;
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 1000', 'dataMax + 1000']}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                    <Legend
                        verticalAlign="top"
                        content={({ payload }) => {
                        const btcPricePayload = payload?.find(p => p.dataKey === 'BTC_Price');
                        return (
                            <div className="flex justify-between items-center w-full px-2 text-sm -mt-2 mb-2">
                                <div className="font-bold text-muted-foreground">
                                    {isFlowView ? '순유입' : 'AUM'}
                                </div>
                                {btcPricePayload && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-0.5" style={{ backgroundColor: btcPricePayload.color }}/>
                                        <span>BTC 가격</span>
                                    </div>
                                )}
                            </div>
                        );
                        }}
                    />
                    {activeAssets.map((asset, index) => (
                        isFlowView ? (
                             <Bar 
                                key={asset} 
                                yAxisId="left"
                                dataKey={asset} 
                                stackId="a" // Keep stack for flow? Or side-by-side? Usually flow is better stacked if multiple
                                fill={assetColors[asset]} 
                                radius={activeAssets.length === 1 || index === activeAssets.length -1 ? [4,4,0,0] : [0,0,0,0]}
                            />
                        ) : (
                            <Line
                                key={asset}
                                yAxisId="left"
                                type="monotone"
                                dataKey={asset}
                                stroke={assetColors[asset]}
                                strokeWidth={2}
                                dot={false}
                                fill={`url(#gradient-${asset})`}
                            />
                        )
                    ))}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="BTC_Price"
                        stroke={assetColors['BTC_Price']}
                        strokeWidth={2}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

const ListView = ({activeAsset}: {activeAsset: string}) => {
    const renderTable = () => {
        switch(activeAsset) {
        case 'btc':
            return <EtfTable data={btcEtfData} totalAUM={totalBtcAUM} assetName="BTC" />;
        case 'eth':
            return <EtfTable data={ethEtfData} totalAUM={totalEthAUM} assetName="ETH" />;
        case 'sol':
            return <EtfTable data={solEtfData} totalAUM={totalSolAUM} assetName="SOL" />;
        case 'xrp':
            return <EtfTable data={xrpEtfData} totalAUM={totalXrpAUM} assetName="XRP" />;
        default:
            return null;
        }
    }
    return (
        <div className="h-full">
            {renderTable()}
        </div>
    );
}

export default function EtfFlowTracker({ initialViewMode = 'chart', onToggleView }: { initialViewMode?: ViewMode, onToggleView?: (mode: ViewMode) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeListAsset, setActiveListAsset] = useState('btc');
  const [activeChartAssets, setActiveChartAssets] = useState<string[]>(['BTC']);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    onToggleView?.(mode);
  }

  const toggleChartAsset = (asset: string) => {
    setActiveChartAssets(prev => 
      prev.includes(asset) 
      ? (prev.length > 1 ? prev.filter(a => a !== asset) : prev)
      : [...prev, asset]
    );
  };

  const renderAssetSelector = () => {
    if (viewMode === 'chart') {
      const chartData = generateChartData(timeframe);
      const isFlowView = timeframe === '1W' || timeframe === '1M';

      const totalFlows = chartAssets.reduce((acc, asset) => {
          if (isFlowView) {
             acc[asset] = chartData.reduce((sum, item) => sum + (item[asset as keyof typeof item] as number), 0);
          } else {
             // For AUM view, take the last value
             const lastItem = chartData[chartData.length - 1];
             acc[asset] = lastItem ? (lastItem[asset as keyof typeof lastItem] as number) : 0;
          }
          return acc;
      }, {} as {[key: string]: number});

      return (
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          {chartAssets.map(asset => {
            const total = totalFlows[asset];
            const isActive = activeChartAssets.includes(asset);
            return (
              <button
                key={asset}
                onClick={() => toggleChartAsset(asset)}
                className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${!isActive && 'opacity-50 hover:opacity-100'}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: assetColors[asset] }} />
                <span className={`font-semibold text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{asset}</span>
                <span className={`font-code text-xs ${
                    total > 0 ? 'text-bullish' : 'text-destructive'
                  }`
                }>
                    {total > 0 ? '+' : ''}{formatKoreanNumber(total)}
                </span>
              </button>
            )
          })}
        </div>
      )
    }

    return (
       <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            {allAssets.map(asset => {
            const isActive = activeListAsset === asset.id;
            return (
                <button
                key={asset.id}
                onClick={() => setActiveListAsset(asset.id)}
                className={`flex items-center gap-2 cursor-pointer transition-opacity ${!isActive && 'opacity-50 hover:opacity-100'}`}
                >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isActive ? assetColors[asset.id] : 'hsl(var(--muted-foreground))' }} />
                <span className={`font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{asset.label}</span>
                <span className={`font-code text-sm text-muted-foreground`}>
                    {formatMillion(asset.totalAUM)}
                </span>
                </button>
            )
            })}
        </div>
    )
  }

  return (
    <Card>
    <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-2">
            <CardTitle>ETF 순유입</CardTitle>
            <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {viewMode === 'chart' && (
                    <div className="flex gap-1 rounded-md bg-muted p-1 self-start flex-shrink-0">
                    {(['1W', '1M', '1Y', 'All'] as Timeframe[]).map((tf) => (
                        <Button
                        key={tf}
                        size="sm"
                        variant={timeframe === tf ? 'default' : 'ghost'}
                        onClick={() => setTimeframe(tf)}
                        className="px-3"
                        >
                        {tf}
                        </Button>
                    ))}
                    </div>
                )}
                <div className="flex gap-1 rounded-md bg-muted p-1 self-start flex-shrink-0">
                    <Button size="sm" variant={viewMode === 'chart' ? 'default' : 'ghost'} className="px-3" onClick={() => handleViewChange('chart')}>
                        <BarChartBig className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} className="px-3" onClick={() => handleViewChange('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
        <div className="pt-2 overflow-x-auto pb-2 scrollbar-hide">
          {renderAssetSelector()}
        </div>
    </CardHeader>
    
    <CardContent className="pt-0 h-64">
      {viewMode === 'chart' ? <ChartView timeframe={timeframe} activeAssets={activeChartAssets} toggleChartAsset={toggleChartAsset} /> : <ListView activeAsset={activeListAsset} />}
    </CardContent>
    
    </Card>
  );
}
