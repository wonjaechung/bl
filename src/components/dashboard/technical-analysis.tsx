import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Mock Data
const rsiData = [
    { name: '월드코인', ticker: 'WLD', price: 4200, rsi: 85.2, status: 'overbought' },
    { name: '싱귤래리티넷', ticker: 'AGIX', price: 450, rsi: 82.1, status: 'overbought' },
    { name: '페치', ticker: 'FET', price: 2800, rsi: 79.5, status: 'overbought' },
    { name: '렌더토큰', ticker: 'RNDR', price: 12500, rsi: 78.4, status: 'overbought' },
    { name: '스택스', ticker: 'STX', price: 3800, rsi: 76.2, status: 'overbought' },
];

const oversoldData = [
    { name: '리플', ticker: 'XRP', price: 700, rsi: 28.5, status: 'oversold' },
    { name: '카르다노', ticker: 'ADA', price: 650, rsi: 29.1, status: 'oversold' },
    { name: '알고랜드', ticker: 'ALGO', price: 250, rsi: 29.8, status: 'oversold' },
    { name: '샌드박스', ticker: 'SAND', price: 680, rsi: 30.2, status: 'oversold' },
    { name: '이오스', ticker: 'EOS', price: 1100, rsi: 31.5, status: 'oversold' },
];

const volumeData = [
    { name: '온도 파이낸스', ticker: 'ONDO', price: 1500, rvol: 3.5, change: 250 },
    { name: '폴리매쉬', ticker: 'POLYX', price: 450, rvol: 3.2, change: 220 },
    { name: '미나', ticker: 'MINA', price: 800, rvol: 2.8, change: 180 },
    { name: '니어프로토콜', ticker: 'NEAR', price: 7500, rvol: 2.5, change: 150 },
    { name: '수이', ticker: 'SUI', price: 1200, rvol: 2.2, change: 120 },
];

const trendData = [
    { name: 'BONK', ticker: 'BONK', price: 0.034, type: 'golden', time: '2일전' },
    { name: 'SIX', ticker: 'SIX', price: 50, type: 'golden', time: '4일전' },
    { name: 'ROA', ticker: 'ROA', price: 88, type: 'dead', time: '4일전' },
    { name: 'BNB', ticker: 'BNB', price: 815000, type: 'golden', time: '7일전' },
    { name: 'PEPE', ticker: 'PEPE', price: 0.015, type: 'dead', time: '7일전' },
];

const betaData = [
    { name: '솔라나', ticker: 'SOL', price: 230000, beta: 1.45 },
    { name: '아발란체', ticker: 'AVAX', price: 48000, beta: 1.82 },
    { name: '체인링크', ticker: 'LINK', price: 25000, beta: 1.21 },
    { name: '이더리움', ticker: 'ETH', price: 4500000, beta: 1.05 },
    { name: '리플', ticker: 'XRP', price: 700, beta: 0.88 },
];

type TabType = 'overbought' | 'oversold' | 'rvol' | 'trend' | 'beta';

export default function TechnicalAnalysis() {
    const [activeTab, setActiveTab] = useState<TabType>('overbought');

    const renderTableContent = () => {
        switch (activeTab) {
            case 'overbought':
            case 'oversold':
                const data = activeTab === 'overbought' ? rsiData : oversoldData;
                return (
                    <>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium text-xs">코인명</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">현재가</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">RSI</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.ticker} className="border-border/50 hover:bg-muted/30">
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.ticker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm">
                                        {item.price.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm text-foreground">
                                        {item.rsi}
                                    </TableCell>
                                    <TableCell className="text-right py-2.5">
                                        <Badge variant="outline" className={cn(
                                            "font-normal text-[10px] h-5",
                                            item.status === 'overbought' 
                                                ? "border-red-500/30 text-red-500 bg-red-500/5" 
                                                : "border-green-500/30 text-green-500 bg-green-500/5"
                                        )}>
                                            {item.status === 'overbought' ? '과매수' : '과매도'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
            case 'rvol':
                return (
                    <>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium text-xs">코인명</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">현재가</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">RVOL</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">평균 대비</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {volumeData.map((item) => (
                                <TableRow key={item.ticker} className="border-border/50 hover:bg-muted/30">
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.ticker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm">
                                        {item.price.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm text-foreground">
                                        {item.rvol}
                                    </TableCell>
                                    <TableCell className="text-right py-2.5">
                                        <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5 font-normal text-[10px] h-5">
                                            +{item.change}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
            case 'trend':
                return (
                    <>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium text-xs">코인명</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">현재가</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">신호</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">포착 시기</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trendData.map((item) => (
                                <TableRow key={item.ticker} className="border-border/50 hover:bg-muted/30">
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.ticker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm">
                                        {item.price < 1000 ? item.price : item.price.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className="text-right py-2.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <Badge variant="outline" className={cn(
                                                "font-normal text-[10px] h-5 gap-1",
                                                item.type === 'golden'
                                                    ? "border-red-500/30 text-red-500 bg-red-500/5"
                                                    : "border-blue-500/30 text-blue-500 bg-blue-500/5"
                                            )}>
                                                {item.type === 'golden' ? '골든크로스' : '데드크로스'}
                                            </Badge>
                                        </div>
                                        <div className="text-[9px] text-muted-foreground mt-0.5">
                                            {item.type === 'golden' ? '5일선 > 20일선' : '5일선 < 20일선'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 text-xs text-foreground">
                                        {item.time}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
            case 'beta':
                return (
                    <>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-medium text-xs">코인명</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">현재가</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">베타</TableHead>
                                <TableHead className="text-right text-muted-foreground font-medium text-xs">예상 등락</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {betaData.map((item) => (
                                <TableRow key={item.ticker} className="border-border/50 hover:bg-muted/30">
                                    <TableCell className="py-2.5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{item.ticker}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm">
                                        {item.price.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className="text-right py-2.5 font-medium text-sm text-foreground">
                                        {item.beta}
                                    </TableCell>
                                    <TableCell className="text-right py-2.5">
                                        <Badge variant="outline" className={cn(
                                            "font-normal text-[10px] h-5",
                                            item.beta > 1 
                                                ? "border-red-500/30 text-red-500 bg-red-500/5" 
                                                : "border-green-500/30 text-green-500 bg-green-500/5"
                                        )}>
                                            {item.beta}배
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </>
                );
        }
    };

    const tabs: { id: TabType; label: string }[] = [
        { id: 'overbought', label: '과매수' },
        { id: 'oversold', label: '과매도' },
        { id: 'rvol', label: '거래량 폭발' },
        { id: 'trend', label: '추세 전환' },
        { id: 'beta', label: '고베타' },
    ];

    return (
        <div className="space-y-4">
            {/* Tabs using Pill Style */}
            <div className="bg-muted/30 p-0.5 rounded-full w-full overflow-x-auto no-scrollbar">
                <div className="flex gap-1 min-w-max w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "h-6 px-3 text-[10px] font-medium rounded-full transition-all duration-200 flex-1 whitespace-nowrap flex items-center justify-center",
                                activeTab === tab.id
                                    ? "bg-foreground text-background shadow-sm font-bold"
                                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
                <Table>
                    {renderTableContent()}
                </Table>
            </div>
        </div>
    );
}

