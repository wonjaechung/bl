'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowDown, ArrowUp, BarChartBig } from 'lucide-react';
import { Button } from '../ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

// Use simpler, solid colors for the bars to match the reference
const assetColors: { [key: string]: string } = {
  btc: '#F7931A', // Orange for BTC
  eth: '#627EEA', // Blue for ETH
  sol: '#14F195', // Green for SOL
  xrp: '#23292F', // Dark for XRP
  BTC: '#F7931A',
  ETH: '#627EEA',
  XRP: '#E1E1E1', // Light gray for XRP dark mode visibility? Or keep brand color. Let's use a visible gray/white.
  SOL: '#14F195',
  BTC_Price: '#22C55E', // Green for Price Line
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

const PremiumCell = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const colorClass = isPositive ? 'text-price-up' : 'text-price-down';
    return (
        <div className={`font-code text-sm ${colorClass}`}>
            {isPositive ? '+' : ''}{value.toFixed(2)}%
        </div>
    );
};

const EtfTable = ({ data, totalAUM, assetName }: { data: {rank: number, ticker: string, name: string, price: number, changeAbsolute: number, changePercent: number, daily: number, aum: number, premium: number}[], totalAUM: number, assetName: string }) => {
    // Exchange rate assumption: 1 USD = 1400 KRW
    // Data is in Million USD. 1 Million USD = 14 억 KRW.
    const KRW_MULTIPLIER = 14;

    return (
    <div className="h-full overflow-hidden">
        <div className="overflow-x-auto">
        <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] h-8 w-10 text-center whitespace-nowrap">순위</TableHead>
                <TableHead className="text-[10px] h-8 whitespace-nowrap">티커</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">운용자산</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">시장점유율</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">주간순유입</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((etf) => {
                    const marketShare = (etf.aum / totalAUM) * 100;
                    const aumKRW = etf.aum * KRW_MULTIPLIER;
                    const inflowKRW = etf.daily * KRW_MULTIPLIER;
                    
                    return (
                    <TableRow key={etf.name} className="h-9 hover:bg-muted/30">
                        <TableCell className="text-center py-1 text-[10px]">
                            {etf.rank}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="font-bold text-[11px]">{etf.ticker}</div>
                        </TableCell>
                        <TableCell className="text-right font-code text-[10px] py-1 text-muted-foreground whitespace-nowrap">
                            {formatKoreanNumber(aumKRW)}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="flex items-center justify-end gap-1.5">
                                <div className="h-1.5 w-8 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: `${Math.min(marketShare, 100)}%`,
                                            backgroundColor: assetColors[assetName] || assetColors[assetName.toUpperCase()] || '#F7931A'
                                        }} 
                                    />
                                </div>
                                <span className="font-code text-[10px] text-muted-foreground w-8 text-right">{marketShare.toFixed(1)}%</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-1 whitespace-nowrap">
                            <div className={`font-code text-[10px] ${etf.daily >= 0 ? 'text-price-up' : 'text-price-down'}`}>
                                {etf.daily >= 0 ? '+' : ''}{formatKoreanNumber(inflowKRW)}
                            </div>
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </div>
        </div>
    </div>
)};

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
    const flowPayload = payload.filter((p: any) => p.dataKey !== 'BTC_Price');
    const pricePayload = payload.find((p: any) => p.dataKey === 'BTC_Price');
    const total = flowPayload.reduce((sum: number, p: any) => sum + p.value, 0);

    return (
      <div className="bg-background/90 backdrop-blur-sm p-3 border rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold mb-1">{label}</p>
        {flowPayload.map((p: any) => (
            <p key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
                <span>{p.dataKey}</span>
                <span className="font-mono">{p.value >= 0 ? '+' : ''}{formatKoreanNumber(p.value)}</span>
            </p>
        ))}
         <p className="flex justify-between gap-4 font-semibold mt-1 pt-1 border-t">
            <span>총합</span>
            <span className="font-mono">{total >= 0 ? '+' : ''}{formatKoreanNumber(total)}</span>
        </p>
         {pricePayload && (
            <p className="flex justify-between gap-4 mt-1" style={{ color: pricePayload.color }}>
                <span>BTC 가격</span>
                <span className="font-mono">${pricePayload.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
            </p>
         )}
      </div>
    );
  }
  return null;
};

const chartAssets = ['BTC', 'ETH', 'XRP', 'SOL'];

const ChartView = ({timeframe, activeAssets, toggleChartAsset, chartData}: {timeframe: Timeframe, activeAssets: string[], toggleChartAsset: (asset: string) => void, chartData: any[]}) => {
    return (
        <div className='h-full w-full font-sans text-xs relative select-none px-2'>
            {/* Axis Titles */}
            <div className="absolute top-0 left-2 text-muted-foreground font-semibold z-10 text-[10px]">순유입</div>
            <div className="absolute top-0 right-2 text-foreground font-semibold flex items-center justify-end gap-1.5 z-10 text-[10px]">
                <div className="w-2.5 h-0.5 bg-green-500 rounded-full"></div>
                BTC 가격
            </div>

             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                    <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        minTickGap={30}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        width={35}
                        tickFormatter={(val) => {
                            if (val === 0) return '0';
                            if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}조`;
                            return `${val}억`;
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={45}
                        domain={['dataMin - 1000', 'dataMax + 1000']}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                    
                    {activeAssets.map((asset, index) => (
                         <Bar 
                            key={asset} 
                            yAxisId="left"
                            dataKey={asset} 
                            stackId="a"
                            fill={assetColors[asset]} 
                            radius={activeAssets.length === 1 || index === activeAssets.length -1 ? [2,2,0,0] : [0,0,0,0]}
                            barSize={18}
                        />
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

type ViewMode = 'chart' | 'list';

export default function EtfFlowTracker({ initialViewMode = 'chart', onToggleView }: { initialViewMode?: ViewMode, onToggleView?: (mode: ViewMode) => void }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAsset, setActiveAsset] = useState<string>('BTC'); // Single source of truth

  const chartData = useMemo(() => generateChartData(timeframe), [timeframe]);

  const renderTopLegend = () => {
      // Calculate totals for the current view
      const isFlowView = timeframe === '1W' || timeframe === '1M';
      const totalFlows = chartAssets.reduce((acc, asset) => {
          if (isFlowView) {
             acc[asset] = chartData.reduce((sum, item) => sum + (item[asset as keyof typeof item] as number), 0);
          } else {
             const lastItem = chartData[chartData.length - 1];
             acc[asset] = lastItem ? (lastItem[asset as keyof typeof lastItem] as number) : 0;
          }
          return acc;
      }, {} as {[key: string]: number});

      return (
        <div className="flex items-center gap-4 text-[11px] min-w-max px-1">
          {chartAssets.map(asset => {
            const total = totalFlows[asset];
            const isActive = activeAsset === asset;
            const color = assetColors[asset];
            
            return (
              <button
                key={asset}
                onClick={() => setActiveAsset(asset)}
                className={`flex items-center gap-1.5 cursor-pointer transition-all ${!isActive ? 'opacity-50 hover:opacity-100' : ''}`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className={`font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{asset}</span>
                <span className={`font-mono ${
                    total > 0 ? 'text-green-500' : 'text-red-500'
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
    <Card className="border-none shadow-none bg-transparent w-full max-w-full overflow-hidden mt-2">
        <CardHeader className="px-0 pt-0 pb-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            ETF 순유입 현황
                        </CardTitle>
                    </div>
                     <div className="flex gap-1 rounded-md bg-muted/50 p-0.5">
                        {(['1W', '1M', '1Y', 'All'] as Timeframe[]).map((tf) => (
                            <Button
                            key={tf}
                            size="sm"
                            variant={timeframe === tf ? 'secondary' : 'ghost'}
                            onClick={() => setTimeframe(tf)}
                            className="h-6 px-2.5 text-[10px] rounded-sm"
                            >
                            {tf}
                            </Button>
                        ))}
                    </div>
                </div>
                
                {/* Top Legend Area */}
                <div className="w-full overflow-x-auto scrollbar-hide pb-1">
                    {renderTopLegend()}
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="p-0">
            {/* Chart Area */}
            <div className="h-72 w-full mb-6">
                 <ChartView 
                    timeframe={timeframe} 
                    activeAssets={[activeAsset]} 
                    toggleChartAsset={() => {}} 
                    chartData={chartData}
                />
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-border/50 mb-4"></div>
            
            {/* List Area */}
            <div className="min-h-[200px]">
                <ListView activeAsset={activeAsset.toLowerCase()} />
            </div>
        </CardContent>
    </Card>
  );
}
