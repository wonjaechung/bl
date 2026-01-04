'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Microscope } from 'lucide-react';
import RsiTop5 from './rsi-top-5';
import RsiBottom5 from './rsi-bottom-5';
import RvolTop5 from './rvol-top-5';
import TechnicalAnalysis from './technical-analysis';
import BetaRanking from './beta-ranking';

const tabs = [
    { value: 'overbought', label: '과매수'},
    { value: 'oversold', label: '과매도'},
    { value: 'rvol', label: '거래량 폭발'},
    { value: 'trend', label: '추세 전환'},
    { value: 'beta', label: '고베타'},
]

export default function TechnicalAnalysisSection() {
    return (
        <Card className="bg-card-dark border-zinc-800">
            <CardHeader>
                <div className="flex items-center gap-2 pt-1">
                    <Microscope className="w-5 h-5 text-primary" />
                    <CardTitle className="font-headline text-lg text-white">기술적 분석</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="overbought" className="w-full">
                    <TabsList>
                        {tabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="overbought" className="mt-4">
                        <RsiTop5 />
                    </TabsContent>
                    <TabsContent value="oversold" className="mt-4">
                        <RsiBottom5 />
                    </TabsContent>
                    <TabsContent value="rvol" className="mt-4">
                        <RvolTop5 />
                    </TabsContent>
                    <TabsContent value="trend" className="mt-4">
                        <TechnicalAnalysis />
                    </TabsContent>
                    <TabsContent value="beta" className="mt-4">
                        <BetaRanking />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
