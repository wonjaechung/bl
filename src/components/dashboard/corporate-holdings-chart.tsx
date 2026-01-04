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
import { BarChartBig, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Timeframe = '1W' | '1M' | '1Y' | 'All';

// Mock Data for Corporate Holdings
const btcHoldingsData = [
    { rank: 1, ticker: 'MSTR', name: 'MicroStrategy', holdings: 214400, supplyPercent: 1.02, weeklyBuy: 1500, totalValue: 214400 * 65000 },
    { rank: 2, ticker: 'MARA', name: 'Marathon Digital', holdings: 16930, supplyPercent: 0.08, weeklyBuy: 0, totalValue: 16930 * 65000 },
    { rank: 3, ticker: 'TSLA', name: 'Tesla', holdings: 9720, supplyPercent: 0.046, weeklyBuy: 0, totalValue: 9720 * 65000 },
    { rank: 4, ticker: 'COIN', name: 'Coinbase', holdings: 9000, supplyPercent: 0.043, weeklyBuy: 120, totalValue: 9000 * 65000 },
    { rank: 5, ticker: 'SQ', name: 'Block (Square)', holdings: 8027, supplyPercent: 0.038, weeklyBuy: 0, totalValue: 8027 * 65000 },
];

const ethHoldingsData = [
    { rank: 1, ticker: 'COIN', name: 'Coinbase', holdings: 150000, supplyPercent: 0.12, weeklyBuy: 500, totalValue: 150000 * 3500 },
    { rank: 2, ticker: '1357.HK', name: 'Meitu', holdings: 31000, supplyPercent: 0.026, weeklyBuy: 0, totalValue: 31000 * 3500 },
    { rank: 3, ticker: 'ETHC', name: 'Ether Capital', holdings: 45000, supplyPercent: 0.038, weeklyBuy: 0, totalValue: 45000 * 3500 },
    { rank: 4, ticker: 'NEXO', name: 'Nexo', holdings: 10000, supplyPercent: 0.008, weeklyBuy: 100, totalValue: 10000 * 3500 },
];

const chartAssets = ['BTC', 'ETH'];

const assetColors: { [key: string]: string } = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  BTC_Price: '#22C55E',
};

const formatKoreanNumber = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 10000) {
      return `${(value / 10000).toFixed(2)}조`;
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}억`;
}

// Exchange rate assumption: 1 USD = 1400 KRW
const KRW_MULTIPLIER = 1400; // For Chart (USD Value -> KRW)
// For Table: Holdings are in Coins. Weekly Buy in Coins.
// But chart usually shows Value in KRW.

const HoldingsTable = ({ data, assetName }: { data: {rank: number, ticker: string, name: string, holdings: number, supplyPercent: number, weeklyBuy: number, totalValue: number}[], assetName: string }) => {
    return (
    <div className="h-full overflow-hidden">
        <div className="overflow-x-auto">
        <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] h-8 w-10 text-center whitespace-nowrap">순위</TableHead>
                <TableHead className="text-[10px] h-8 whitespace-nowrap">티커</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">보유량 ({assetName})</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">공급량 %</TableHead>
                <TableHead className="text-right text-[10px] h-8 whitespace-nowrap">주간순매수</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((company) => {
                    const supplyPercent = company.supplyPercent;
                    
                    return (
                    <TableRow key={company.name} className="h-9 hover:bg-muted/30">
                        <TableCell className="text-center py-1 text-[10px]">
                            {company.rank}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="font-bold text-[11px]">{company.ticker}</div>
                        </TableCell>
                        <TableCell className="text-right font-code text-[10px] py-1 text-muted-foreground whitespace-nowrap">
                            {company.holdings.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="flex items-center justify-end gap-1.5">
                                <div className="h-1.5 w-8 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: `${Math.min(supplyPercent * 20, 100)}%`, // Scale for visibility
                                            backgroundColor: assetColors[assetName] || '#F7931A'
                                        }} 
                                    />
                                </div>
                                <span className="font-code text-[10px] text-muted-foreground w-8 text-right">{supplyPercent.toFixed(3)}%</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-1 whitespace-nowrap">
                            <div className={`font-code text-[10px] ${company.weeklyBuy >= 0 ? 'text-price-up' : 'text-price-down'}`}>
                                {company.weeklyBuy >= 0 ? '+' : ''}{company.weeklyBuy.toLocaleString()}
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
  // Initial holdings values in Million KRW (approx)
  // Total Holdings Value: BTC ~200k * 65k = 13B USD.
  // 13B USD * 1400 = 18.2 Trillion KRW = 182,000 Eok.
  let accumulatedValue = { BTC: 180000, ETH: 50000 }; 

  for (let i = days -1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Price trend
    btcPrice += (Math.random() - 0.5) * 2000;

    // Daily Net Buy (In Value KRW Eok)
    const btcBuy = (Math.random() - 0.45) * 500; // Positive bias
    const ethBuy = (Math.random() - 0.48) * 200;

    accumulatedValue.BTC += btcBuy;
    accumulatedValue.ETH += ethBuy;

    if (timeframe === '1W' || timeframe === '1M') {
        // Show Net Buy (Flow)
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(btcBuy),
            ETH: Math.floor(ethBuy),
            BTC_Price: btcPrice,
        });
    } else {
        // Show Total Holdings Value
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(accumulatedValue.BTC),
            ETH: Math.floor(accumulatedValue.ETH),
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

const ChartView = ({timeframe, activeAssets, chartData}: {timeframe: Timeframe, activeAssets: string[], chartData: any[]}) => {
    return (
        <div className='h-full w-full font-sans text-xs relative select-none px-2'>
            {/* Axis Titles */}
            <div className="absolute top-0 left-2 text-muted-foreground font-semibold z-10 text-[10px]">순매수</div>
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
                            if (Math.abs(val) >= 10000) return `${(val / 10000).toFixed(0)}조`;
                            if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}조`; // Fallback
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
            return <HoldingsTable data={btcHoldingsData} assetName="BTC" />;
        case 'eth':
            return <HoldingsTable data={ethHoldingsData} assetName="ETH" />;
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

export default function CorporateHoldingsChart({ initialViewMode = 'chart' }: { initialViewMode?: ViewMode }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAsset, setActiveAsset] = useState<string>('BTC');

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
                            상장기업 순매수 현황
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
