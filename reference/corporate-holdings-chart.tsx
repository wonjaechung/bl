'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, Line, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChartBig, List, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

type Timeframe = '1W' | '1M' | '1Y' | 'All';
type ViewMode = 'chart' | 'list';

const allAssets = ['BTC', 'ETH'];
const assetColors: { [key: string]: string } = {
  BTC: 'hsl(var(--chart-1))', // Orange
  ETH: 'hsl(var(--chart-2))',
  BTC_Price: 'hsl(var(--chart-3))', // Green
};

const corporateHoldings = {
    BTC: { total: 214400, percentOfSupply: 1.02 },
    ETH: { total: 500000, percentOfSupply: 0.42 },
}

const corporateHoldingsData = [
    { rank: 1, companyName: 'Strategy', listingLocation: 'US', ticker: 'MSTR', holdings: 660624, btcSupplyPercent: 3.146, marketCap: '$50.76B', dailyChange: 1500 },
    { rank: 2, companyName: 'MARA Holdings, Inc.', listingLocation: 'US', ticker: 'MARA', holdings: 53250, btcSupplyPercent: 0.254, marketCap: '$4.36B', dailyChange: 0 },
    { rank: 3, companyName: 'Twenty One Capital', listingLocation: 'US', ticker: 'XXI', holdings: 43514, btcSupplyPercent: 0.207, marketCap: '$3.88B', dailyChange: -120 },
    { rank: 4, companyName: 'Metaplanet Inc.', listingLocation: 'JP', ticker: 'MTPLF', holdings: 30823, btcSupplyPercent: 0.147, marketCap: '$3.09B', dailyChange: 500 },
    { rank: 5, companyName: 'Bitcoin Standard Treasury Company', listingLocation: 'US', ticker: 'CEPO', holdings: 30021, btcSupplyPercent: 0.143, marketCap: '$270.30M', dailyChange: 0 },
    { rank: 6, companyName: 'Bullish', listingLocation: 'US', ticker: 'BLSH', holdings: 24300, btcSupplyPercent: 0.116, marketCap: '$6.53B', dailyChange: 0 },
    { rank: 7, companyName: 'Riot Platforms, Inc.', listingLocation: 'US', ticker: 'RIOT', holdings: 19324, btcSupplyPercent: 0.092, marketCap: '$5.69B', dailyChange: -50 },
    { rank: 8, companyName: 'Coinbase Global, Inc.', listingLocation: 'US', ticker: 'COIN', holdings: 14548, btcSupplyPercent: 0.069, marketCap: '$72.03B', dailyChange: 120 },
];

const FlowCell = ({ value }: { value: number }) => {
    if (value === 0) return <span className="text-muted-foreground">-</span>;
    const isPositive = value > 0;
    const colorClass = isPositive ? 'text-bullish' : 'text-destructive';
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
        <div className={`flex items-center justify-end font-code text-sm ${colorClass}`}>
            <Icon className="h-3 w-3 mr-1" />
            {isPositive ? '+' : ''}{value.toLocaleString()}
        </div>
    );
};

const generateChartData = (timeframe: Timeframe) => {
  let days = 30;
  if (timeframe === '1W') days = 7;
  if (timeframe === '1M') days = 30;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  let btcPrice = 65000;
  let accumulatedHoldings = { BTC: 214400, ETH: 500000 };

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Price trend
    btcPrice += (Math.random() - 0.5) * 2000;

    // Daily Flow
    const btcFlow = (Math.random() - 0.48) * 500;
    const ethFlow = (Math.random() - 0.49) * 2000;
    
    // Update accumulated holdings
    accumulatedHoldings.BTC += btcFlow;
    accumulatedHoldings.ETH += ethFlow;

    // Calculate value in KRW (approximate rates: BTC 100M KRW, ETH 4M KRW)
    const btcRate = btcPrice * 1350; // USD to KRW approx
    const ethRate = (btcPrice * 0.05) * 1350; // ETH ratio approx
    
    const btcValue = accumulatedHoldings.BTC * btcRate;
    const ethValue = accumulatedHoldings.ETH * ethRate;

    if (timeframe === '1W' || timeframe === '1M') {
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(btcFlow),
            ETH: Math.floor(ethFlow),
            BTC_Price: btcPrice, // Keep price for consistency but might only show bars
        });
    } else {
        // Show Total Value in 100M KRW (Eok)
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            BTC: Math.floor(btcValue / 100000000), // Convert to Eok
            ETH: Math.floor(ethValue / 100000000), // Convert to Eok
            BTC_Price: btcPrice,
        });
    }
  }
  return data;
};

const formatKoreanNumber = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 10000) {
        return `${(value / 10000).toFixed(2)}조`;
    }
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}억`;
  }

const CustomTooltip = ({ active, payload, label, asset }: any) => {
  if (active && payload && payload.length) {
    const btcPricePayload = payload.find((p: any) => p.dataKey === 'BTC_Price');
    // Filter out BTC_Price to get asset payloads
    const assetPayloads = payload.filter((p: any) => p.dataKey !== 'BTC_Price');
    
    const total = assetPayloads.reduce((sum: number, p: any) => sum + p.value, 0);

    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
        <p className="font-bold">{label}</p>
        <hr className="my-1 border-border" />
        {assetPayloads.map((p: any) => (
            <p key={p.dataKey} className="text-sm" style={{ color: assetColors[p.dataKey] }}>
                {p.dataKey}: {p.value >= 0 ? '+' : ''}{formatKoreanNumber(p.value)}
            </p>
        ))}
        <p className="text-sm font-bold text-foreground">
            총합: {total >= 0 ? '+' : ''}{formatKoreanNumber(total)}
        </p>
        {btcPricePayload && (
             <p className="text-sm" style={{ color: btcPricePayload.color }}>
                BTC 가격: ${btcPricePayload.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
            </p>
        )}
      </div>
    );
  }
  return null;
};

const HoldingsTable = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[40px] text-center">#</TableHead>
                <TableHead className="w-[150px]">회사명</TableHead>
                <TableHead className="hidden md:table-cell">티커</TableHead>
                <TableHead className="text-right whitespace-nowrap">보유량 (BTC)</TableHead>
                <TableHead className="text-right whitespace-nowrap">일간 변동</TableHead>
                <TableHead className="text-right whitespace-nowrap">공급량 %</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {corporateHoldingsData.map((company) => (
                <TableRow key={company.rank}>
                    <TableCell className="font-medium text-muted-foreground py-2 text-center">{company.rank}</TableCell>
                    <TableCell className="font-medium py-2">
                        <div className="flex flex-col">
                            <span className="truncate max-w-[140px] md:max-w-none" title={company.companyName}>{company.companyName}</span>
                            <span className="text-[10px] text-muted-foreground md:hidden">{company.ticker}</span>
                        </div>
                    </TableCell>
                    <TableCell className="font-code text-xs text-muted-foreground py-2 hidden md:table-cell">{company.ticker}</TableCell>
                    <TableCell className="text-right font-code py-2 text-sm">{company.holdings.toLocaleString()}</TableCell>
                    <TableCell className="text-right py-2">
                        <FlowCell value={company.dailyChange} />
                    </TableCell>
                    <TableCell className="text-right font-code py-2 text-xs text-muted-foreground">{company.btcSupplyPercent.toFixed(3)}%</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default function CorporateHoldingsChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAssets, setActiveAssets] = useState<string[]>(['BTC']);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  
  // Memoize chart data generation once per timeframe for all assets
  const chartData = useMemo(() => generateChartData(timeframe), [timeframe]);
  
  const totalFlows = useMemo(() => {
    const isFlowView = timeframe === '1W' || timeframe === '1M';
    return allAssets.reduce((acc, asset) => {
        if (isFlowView) {
            acc[asset] = chartData.reduce((sum, item) => sum + (item[asset] as number), 0);
        } else {
             // For AUM view, take the last value
             const lastItem = chartData[chartData.length - 1];
             acc[asset] = lastItem ? (lastItem[asset] as number) : 0;
        }
        return acc;
    }, {} as Record<string, number>);
  }, [chartData, timeframe]);

  // Handle asset toggle
  const toggleChartAsset = (asset: string) => {
    setActiveAssets(prev => 
      prev.includes(asset) 
      ? (prev.length > 1 ? prev.filter(a => a !== asset) : prev)
      : [...prev, asset]
    );
  };
  
  const holdingData = corporateHoldings[activeAssets[0] as keyof typeof corporateHoldings]; // Not strictly used in render now

    const renderContent = () => {
    if (viewMode === 'list') {
        return (
            <div className="h-full overflow-auto pr-2">
                <HoldingsTable />
            </div>
        );
    }
    
    const isFlowView = timeframe === '1W' || timeframe === '1M';

    return (
        <div className="h-full">
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                    <Legend
                        verticalAlign="top"
                        content={({ payload }) => {
                        const btcPricePayload = payload?.find(p => p.dataKey === 'BTC_Price');
                        return (
                            <div className="flex justify-between items-center w-full px-2 text-sm -mt-2 mb-2">
                                <div className="font-bold text-muted-foreground">
                                    {isFlowView ? '순매수' : '보유량'}
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
                                radius={activeAssets.length === 1 || index === activeAssets.length -1 ? [4,4,0,0] : [0,0,0,0]}
                                stackId="a"
                                fill={assetColors[asset]} // For bar chart use asset color, not green/red per cell if multi-asset
                                // Wait, previous implementation for single asset used Cell fill for green/red
                                // If multi-asset stacked/grouped, we usually use asset color.
                                // If user wants green/red flow for EACH asset, it gets messy in one chart.
                                // Let's use asset colors for multi-selection flow view like ETF tracker does.
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
    );
  };



  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-2">
            <CardTitle>상장사 순매수</CardTitle>
            <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {viewMode === 'chart' && (
                <div className="flex gap-1 rounded-md bg-muted p-1 self-start">
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
                <div className="flex gap-1 rounded-md bg-muted p-1 self-start">
                    <Button size="sm" variant={viewMode === 'chart' ? 'default' : 'ghost'} className="px-3" onClick={() => setViewMode('chart')}>
                        <BarChartBig className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} className="px-3" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
        <div className="pt-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2">
                 {allAssets.map(asset => {
                    const isActive = activeAssets.includes(asset);
                    const flow = totalFlows[asset];
                    
                    return (
                        <button
                            key={asset}
                            onClick={() => toggleChartAsset(asset)}
                            className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${!isActive && 'opacity-50 hover:opacity-100'}`}
                        >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: assetColors[asset] }} />
                            <span className={`font-semibold text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{asset}</span>
                            <span className={`font-code text-xs ${flow > 0 ? 'text-bullish' : 'text-destructive'}`}>
                                {flow > 0 ? '+' : ''}{formatKoreanNumber(flow)}
                            </span>
                        </button>
                    );
                 })}
            </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
          {renderContent()}
      </CardContent>
    </Card>
  );
}
