'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import FearGreedIndex from './btc-fear-greed-index';
import BitcoinDominance from './bitcoin-dominance';
import KimchiPremium from './kimchi-premium';
import BithumbVolume from './bithumb-volume';
import MarketMovers from './market-movers';
import AverageCryptoRsi from './average-crypto-rsi';

type Timeframe = '1D' | '1W' | '1M' | '6M' | '1Y';

const generateChartData = (assets: string[], timeframe: Timeframe) => {
  let days = 7;
  if (timeframe === '1D') days = 1;
  if (timeframe === '1M') days = 30;
  if (timeframe === '6M') days = 180;
  if (timeframe === '1Y') days = 365;

  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const entry: { [key: string]: string | number } = {
      date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    };
    assets.forEach(asset => {
      // Simulate percentage change. Start at 0.
      const volatility = 0.03;
      let value = 0;
      if (i < days) {
         const prevEntry = data[days - i - 1];
         const prevValue = prevEntry ? (prevEntry[asset] as number) : 0;
         value = prevValue + (Math.random() - 0.5) * volatility * 200;
      }
      entry[asset] = value;
    });
    data.push(entry);
  }
   // Normalize to start at 0
  const firstEntry = data[0];
  return data.map(entry => {
    const normalizedEntry = { ...entry };
    assets.forEach(asset => {
        normalizedEntry[asset] = (entry[asset] as number) - (firstEntry[asset] as number);
    });
    return normalizedEntry;
  });
};


const initialAssets = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'];
const assetColors: { [key: string]: string } = {
    BTC: 'hsl(var(--primary))',
    ETH: '#627EEA',
    SOL: '#9945FF',
    XRP: 'hsl(var(--chart-4))',
    DOGE: '#C2A633',
    ADA: '#0033AD',
    AVAX: '#E84142',
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-bold">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }} className="flex items-center gap-2 text-sm">
            <span className='font-bold'>{pld.dataKey}:</span>
            <span>{pld.value.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};


export default function TrendComparison() {
  const [assets, setAssets] = useState<string[]>(initialAssets);
  const [newAsset, setNewAsset] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>('1W');

  const chartData = useMemo(() => generateChartData(assets, timeframe), [assets, timeframe]);

  const addAsset = () => {
    const assetUpper = newAsset.toUpperCase();
    if (assetUpper && !assets.includes(assetUpper)) {
      if (!assetColors[assetUpper]) {
        // Assign a random color if not predefined
        assetColors[assetUpper] = `hsl(${Math.random() * 360}, 70%, 50%)`;
      }
      setAssets([...assets, assetUpper]);
      setNewAsset('');
    }
  };
  
  const removeAsset = (assetToRemove: string) => {
    if (assets.length > 1) {
        setAssets(assets.filter(asset => asset !== assetToRemove));
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">동향 비교</CardTitle>
        <div className="flex gap-1 rounded-md bg-muted p-1">
          {(['1D', '1W', '1M', '6M', '1Y'] as Timeframe[]).map((tf) => (
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    {assets.map(asset => (
                        <Line
                        key={asset}
                        type="monotone"
                        dataKey={asset}
                        stroke={assetColors[asset] || '#8884d8'}
                        strokeWidth={2.5}
                        dot={false}
                        />
                    ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="md:col-span-1 space-y-2">
                {assets.map(asset => {
                    const lastDataPoint = chartData[chartData.length - 1];
                    // Ensure we have a valid number, default to 0
                    const val = lastDataPoint && lastDataPoint[asset] !== undefined 
                        ? Number(lastDataPoint[asset]) 
                        : 0;
                    
                    const isPositive = val >= 0;
                    
                    return (
                        <div key={asset} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 rounded-full" style={{backgroundColor: assetColors[asset]}}></div>
                                <span className="font-bold">{asset}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Force re-render with unique key if needed, or check if this container is hidden on small screens */}
                                <span className={`text-sm font-mono font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
                                    {isPositive ? '+' : ''}{val.toFixed(2)}%
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAsset(asset)}>
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
                <div className="flex items-center gap-2 pt-2">
                    <Input 
                        value={newAsset}
                        onChange={(e) => setNewAsset(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addAsset()}
                        placeholder="종목 추가..."
                        className="h-9 uppercase"
                    />
                    <Button size="icon" className="h-9 w-9" onClick={addAsset}><PlusCircle className="h-5 w-5"/></Button>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <FearGreedIndex />
            <BitcoinDominance />
            <KimchiPremium />
            <BithumbVolume />
            <MarketMovers />
            <AverageCryptoRsi />
        </div>
      </CardContent>
    </Card>
  );
}
