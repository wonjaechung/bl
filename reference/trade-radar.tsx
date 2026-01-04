'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BtcIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" fill="#F7931A" stroke="none"/>
        <path d="M14.5 17.5V15.75C15.3284 15.4184 16 14.537 16 13.5C16 12.463 15.3284 11.5816 14.5 11.25V9.75C15.3284 9.41843 16 8.53702 16 7.5C16 6.11929 14.8807 5 13.5 5H9.5V19H13.5C14.8807 19 16 17.8807 16 16.5C16 15.463 15.3284 14.5816 14.5 14.25V12.75C15.3284 12.4184 16 11.537 16 10.5C16 9.11929 14.8807 8 13.5 8H11.5M11.5 5V19M11.5 12H13.5C14.3284 12 15 12.6716 15 13.5C15 14.3284 14.3284 15 13.5 15H11.5" stroke="white" strokeWidth="1.5" />
        <path d="M10.5 5V8H9.5V5H10.5ZM10.5 16V19H9.5V16H10.5Z" stroke="white" strokeWidth="1.5"/>
    </svg>
);

const EthIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" fill="#627EEA" stroke="none"/>
        <path d="m12 18.3 4-2.8-4-7.3-4 7.3 4 2.8z" fill="#fff" fillOpacity="0.6"/>
        <path d="m12 5.2 4 5.3-4 2.3-4-2.3 4-5.3z" fill="#fff"/>
        <path d="m8 15.5 4 2.8v-5.1l-4-2.2v4.5z" fill="#fff" fillOpacity="0.6"/>
        <path d="m16 15.5-4 2.8v-5.1l4-2.2v4.5z" fill="#fff"/>
    </svg>
);

const XrpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" fill="#23292F" stroke="none"/>
        <path d="M6.033 10.352c.234-2.34 2.29-4.14 4.67-4.14 2.52 0 4.57 2.05 4.57 4.57s-2.05 4.57-4.57 4.57c-2.38 0-4.436-1.8-4.67-4.14m11.934 3.296c-.234 2.34-2.29 4.14-4.67 4.14-2.52 0-4.57-2.05-4.57-4.57s2.05-4.57 4.57-4.57c2.38 0 4.436 1.8 4.67 4.14" stroke="#00AEEF" strokeWidth="1.5"/>
    </svg>
);


const whaleTrades = [
    {
        time: '14:20:05',
        icon: BtcIcon,
        ticker: 'BTC',
        action: '매수',
        total: '12.5억',
        amount: '9.32 BTC',
        price: '134,250,000',
    },
    {
        time: '14:19:44',
        icon: XrpIcon,
        ticker: 'XRP',
        action: '매도',
        total: '3.2억',
        amount: '350,200 XRP',
        price: '915',
    },
    {
        time: '14:18:12',
        icon: EthIcon,
        ticker: 'ETH',
        action: '매도',
        total: '7.4억',
        amount: '171.85 ETH',
        price: '4,321,760',
    },
];

export default function TradeRadar() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CardTitle className="font-headline text-lg">거래 레이더</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="whales">
          <TabsList className="px-6">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="whales">고래</TabsTrigger>
            <TabsTrigger value="surges">급등</TabsTrigger>
            <TabsTrigger value="accumulation">매집</TabsTrigger>
          </TabsList>
          <TabsContent value="whales" className="m-0">
            <div className="space-y-4 px-6 py-4">
              {whaleTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <trade.icon className="h-8 w-8" />
                    <div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm text-muted-foreground">{trade.time}</p>
                        <span className="font-bold">{trade.ticker}</span>
                        <span className={`text-sm font-medium ${trade.action === '매수' ? 'text-bullish' : 'text-bearish'}`}>
                          {trade.total}원 {trade.action}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-code">
                        └ {trade.amount} @ {trade.price}원
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="outline" className="bg-accent/20 border-accent text-accent">고래</Badge>
                  </div>
                </div>
              ))}
            </div>
             <div className="flex justify-center items-center gap-2 p-2 border-t">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-5 w-5 rotate-180" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
