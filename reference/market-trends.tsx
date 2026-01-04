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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const DviIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#7C4DFF"/><path d="M12 22V12L20 7V17L12 22Z" fill="url(#paint0_linear_dvi)"/><path d="M12 22L4 17V7L12 12V22Z" fill="url(#paint1_linear_dvi)"/><path d="M4 7L12 2L20 7L12 12L4 7Z" fill="url(#paint2_linear_dvi)"/><defs><linearGradient id="paint0_linear_dvi" x1="16" y1="7" x2="16" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.4"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="paint1_linear_dvi" x1="8" y1="7" x2="8" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.2"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="paint2_linear_dvi" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.4"/><stop offset="1" stop-color="white" stop-opacity="0.1"/></linearGradient></defs></svg>;
const MbxIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#1CD470" stroke="#10A054" stroke-width="2"/><path d="M6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M9.5 15.5C9.5 14.3954 10.3954 13.5 11.5 13.5H12.5C13.6046 13.5 14.5 14.3954 14.5 15.5" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M15.5 10C15.5 9.17157 14.8284 8.5 14 8.5H10C9.17157 8.5 8.5 9.17157 8.5 10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>;
const GmtIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" stroke="#FBB303" stroke-width="2"/><circle cx="12" cy="12" r="8" fill="#FBB303"/><text x="12" y="15" text-anchor="middle" font-size="10" fill="white" font-weight="bold">G</text></svg>;
const BalIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_bal)"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="black"/><path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18V6Z" fill="black"/><path d="M12 6V18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" fill="#E2E8F0"/></g><defs><clipPath id="clip0_bal"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>;
const IskIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06201 5.99974L12.0001 10.8386L16.9382 5.99974L20.0001 9.00684L12.0001 16.864L4.00006 9.00684L7.06201 5.99974Z" fill="url(#paint0_linear_isk)"/><path d="M12.0001 16.8638L16.9382 21.7027L20.0001 18.6956L12.0001 10.8384L12.0001 16.8638Z" fill="url(#paint1_linear_isk)"/><defs><linearGradient id="paint0_linear_isk" x1="12.0001" y1="5.99974" x2="12.0001" y2="16.864" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6"/><stop offset="1" stop-color="#60A5FA"/></linearGradient><linearGradient id="paint1_linear_isk" x1="16.0001" y1="10.8384" x2="16.0001" y2="21.7027" gradientUnits="userSpaceOnUse"><stop stop-color="#9333EA"/><stop offset="1" stop-color="#A855F7"/></linearGradient></defs></svg>;
const BtcIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F7931A"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.02 14.188c-1.23.82-2.7.977-3.81.977h-1.028V19H9.01v-1.835h-.844v-1.42h.844v-5.46h-.844v-1.42h.844V6.5h3.024c1.17 0 2.217.156 3.128.813.91.656 1.423 1.61 1.423 2.765 0 1.095-.492 1.99-1.393 2.61.943.515 1.547 1.446 1.547 2.586 0 1.353-.656 2.492-1.844 3.328zM11.98 11.23h1.02c.766 0 1.34-.14 1.782-.547.442-.406.688-1.008.688-1.781 0-.75-.246-1.344-.688-1.75-.442-.407-1.016-.547-1.782-.547h-1.02v4.625zm0 1.36h1.22c.86 0 1.524-.156 2.016-.625.493-.47.75-1.157.75-2.016 0-.89-.274-1.586-.798-2.094-.523-.508-1.238-.687-2.188-.687h-1.02v5.422z"/></svg>;
const EthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#627EEA" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path fill="#fff" d="m12 5.2 4 5.3-4 2.3-4-2.3 4-5.3z"/><path fill="#fff" opacity=".6" d="m12 18.3 4-2.8-4-7.3-4 7.3 4 2.8z"/><path fill="#fff" d="m16 15.5-4 2.8v-5.1l4-2.2v4.5z"/><path fill="#fff" opacity=".6" d="m8 15.5 4 2.8v-5.1l-4-2.2v4.5z"/></svg>;
const XrpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#23292F" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path stroke="#00AEEF" stroke-width="1.5" d="M6.033 10.352c.234-2.34 2.29-4.14 4.67-4.14 2.52 0 4.57 2.05 4.57 4.57s-2.05 4.57-4.57 4.57c-2.38 0-4.436-1.8-4.67-4.14m11.934 3.296c-.234 2.34-2.29 4.14-4.67 4.14-2.52 0-4.57-2.05-4.57-4.57s2.05-4.57 4.57-4.57c2.38 0 4.436 1.8 4.67 4.14"/></svg>;


const initialMarketData = [
  { rank: 1, icon: DviIcon, name: 'DVI 디비전', ticker: 'DVI', price: 2.388, change1h: 1.5, change24h: 34.08, change7d: 30.84, volume24h: 12000, volumeChange24h: 320, netInflow: 520, marketCap: 17.79, circulating: 1000000000, maxSupply: 1000000000 },
  { rank: 2, icon: MbxIcon, name: 'MBX 마브렉스', ticker: 'MBX', price: 145.0, change1h: -0.2, change24h: 27.19, change7d: 28.88, volume24h: 8540, volumeChange24h: 150, netInflow: 312, marketCap: 301.99, circulating: 263477908, maxSupply: 1000000000 },
  { rank: 3, icon: GmtIcon, name: 'GMT 스테픈', ticker: 'GMT', price: 32.46, change1h: 0.8, change24h: 24.84, change7d: 26.20, volume24h: 7110, volumeChange24h: 210, netInflow: -88, marketCap: 739.48, circulating: 3111400155, maxSupply: 6000000000 },
  { rank: 4, icon: BalIcon, name: 'BAL 밸런서', ticker: 'BAL', price: 3390, change1h: -1.1, change24h: 21.07, change7d: 4.75, volume24h: 520, volumeChange24h: -25, netInflow: 12, marketCap: 672.49, circulating: 68258590, maxSupply: 96150714 },
  { rank: 5, icon: IskIcon, name: 'ISK 이스크라', ticker: 'ISK', price: 1800, change1h: 2.3, change24h: 19.84, change7d: -18.58, volume24h: 250, volumeChange24h: 80, netInflow: -5.2, marketCap: 9.86, circulating: 538830607, maxSupply: 1000000000 },
  { rank: 6, icon: BtcIcon, name: 'BTC 비트코인', ticker: 'BTC', price: 98000000, change1h: -0.5, change24h: 2.1, change7d: -5.5, volume24h: 35000, volumeChange24h: 45, netInflow: 1200, marketCap: 19000000, circulating: 19700000, maxSupply: 21000000 },
  { rank: 7, icon: EthIcon, name: 'ETH 이더리움', ticker: 'ETH', price: 4500000, change1h: 0.1, change24h: 1.5, change7d: -2.3, volume24h: 21000, volumeChange24h: 30, netInflow: 800, marketCap: 5400000, circulating: 120000000, maxSupply: null },
  { rank: 8, icon: XrpIcon, name: 'XRP 리플', ticker: 'XRP', price: 700, change1h: -1.2, change24h: -3.4, change7d: -10.2, volume24h: 15000, volumeChange24h: -10, netInflow: -250, marketCap: 380000, circulating: 55000000000, maxSupply: 100000000000 },
  { rank: 9, icon: DviIcon, name: 'SOL 솔라나', ticker: 'SOL', price: 230000, change1h: 2.1, change24h: 8.9, change7d: 15.3, volume24h: 18000, volumeChange24h: 120, netInflow: 950, marketCap: 1000000, circulating: 440000000, maxSupply: null },
  { rank: 10, icon: MbxIcon, name: 'DOGE 도지코인', ticker: 'DOGE', price: 210, change1h: 3.5, change24h: 12.3, change7d: 5.1, volume24h: 9000, volumeChange24h: 200, netInflow: 400, marketCap: 300000, circulating: 144000000000, maxSupply: null },
];

type SortKey = keyof typeof initialMarketData[0] | 'name';

const ChangeCell = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const colorClass = isPositive ? 'text-bullish' : 'text-bearish';
  return (
    <TableCell className={`text-right font-code ${colorClass}`}>
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </TableCell>
  );
};

const NetInflowCell = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const colorClass = isPositive ? 'text-bullish' : 'text-bearish';
  const formatValue = (val: number) => {
    if (val >= 10000) return `${(val/10000).toFixed(1)}조`;
    return `${val.toLocaleString()}억`;
  }
  return (
    <TableCell className={`text-right font-code ${colorClass}`}>
      {value > 0 ? '+' : ''}{formatValue(value)}
    </TableCell>
  );
};


export default function MarketTrends() {
  const [marketData, setMarketData] = useState(initialMarketData);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'volume24h', direction: 'descending' });

  const sortedMarketData = useMemo(() => {
    let sortableItems = [...marketData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
             if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        
        return 0;
      });
    }
    return sortableItems;
  }, [marketData, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ sortKey, children, className }: { sortKey: SortKey, children: React.ReactNode, className?: string }) => (
    <TableHead className={className}>
      <Button variant="ghost" onClick={() => requestSort(sortKey)} className="px-1">
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
            가상자산 동향
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader sortKey="rank" className="pl-4">순위</SortableHeader>
                <SortableHeader sortKey="name">가상자산명</SortableHeader>
                <SortableHeader sortKey="price" className="text-right">현재가</SortableHeader>
                <SortableHeader sortKey="change1h" className="text-right">1H</SortableHeader>
                <SortableHeader sortKey="change24h" className="text-right">24H</SortableHeader>
                <SortableHeader sortKey="change7d" className="text-right">7D</SortableHeader>
                <SortableHeader sortKey="volume24h" className="text-right">거래대금(24H)</SortableHeader>
                <SortableHeader sortKey="volumeChange24h" className="text-right">거래량(24H%)</SortableHeader>
                <SortableHeader sortKey="netInflow" className="text-right">순유입(24H)</SortableHeader>
                <SortableHeader sortKey="marketCap" className="text-right">시가총액</SortableHeader>
                <SortableHeader sortKey="circulating">유통량</SortableHeader>
                <TableHead className="pr-6 text-center">거래</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMarketData.map((asset) => {
                const circulatingPercent = asset.maxSupply ? (asset.circulating / asset.maxSupply) * 100 : 0;
                return (
                <TableRow key={asset.name}>
                  <TableCell className="pl-6 text-center font-medium">{asset.rank}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <asset.icon />
                      <div className='flex flex-col'>
                        <span>{asset.name.split(' ')[0]}</span>
                        <span className='text-muted-foreground text-xs'>{asset.ticker}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-code">{asset.price.toLocaleString()}</TableCell>
                  <ChangeCell value={asset.change1h} />
                  <ChangeCell value={asset.change24h} />
                  <ChangeCell value={asset.change7d} />
                  <TableCell className="text-right font-code">{(asset.volume24h * 100000000).toLocaleString()}원</TableCell>
                  <ChangeCell value={asset.volumeChange24h} />
                  <NetInflowCell value={asset.netInflow} />
                  <TableCell className="text-right font-code">{(asset.marketCap * 100000000).toLocaleString()}원</TableCell>
                  <TableCell>
                    <div className="flex flex-col w-32">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{asset.circulating.toLocaleString()}</span>
                            <span className='font-code'>{circulatingPercent ? circulatingPercent.toFixed(1) + '%' : '∞'}</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Progress value={circulatingPercent} className="h-2 mt-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>총 공급량: {asset.maxSupply ? asset.maxSupply.toLocaleString() : '무제한'} {asset.ticker}</p>
                                    <p>유통량: {asset.circulating.toLocaleString()} {asset.ticker}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 text-center">
                    <Button variant="outline" size="sm">거래하기</Button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
