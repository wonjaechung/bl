'use client';
import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Landmark } from 'lucide-react';

import BithumbVolume from './bithumb-volume';
import KimchiPremium from './kimchi-premium';
import BtcFearGreedIndex from './btc-fear-greed-index';
import BitcoinDominance from './bitcoin-dominance';
import BtcPriceDrop from './btc-price-drop';
import StablecoinMarketCap from './stablecoin-marketcap';
import M2Supply from './m2-supply';
import { cn } from '@/lib/utils';

export type IndicatorId = 'dominance' | 'volume' | 'kimchi' | 'fear' | 'drop' | 'stable' | 'm2';

type IndicatorData = {
    id: IndicatorId;
    component: React.ComponentType;
    title: string;
    value: string;
    unit?: string;
    icon?: React.ComponentType<any>;
    color?: string;
};

export const indicatorData: Record<IndicatorId, IndicatorData> = {
    dominance: { id: 'dominance', component: BitcoinDominance, title: 'BTC 도미넌스', value: '49.08%', unit: '%' },
    volume: { id: 'volume', component: BithumbVolume, title: '빗썸 거래대금', value: '2.13조', unit: '조' },
    kimchi: { id: 'kimchi', component: KimchiPremium, title: '김치 프리미엄', value: '1.38%', unit: '%' },
    fear: { id: 'fear', component: BtcFearGreedIndex, title: 'BTC 공포/탐욕', value: '41', unit: '' },
    drop: { id: 'drop', component: BtcPriceDrop, title: 'BTC 고점대비 낙폭', value: '-2.00%', unit: '%' },
    stable: { id: 'stable', component: StablecoinMarketCap, title: '스테이블 시총', value: '90.8조', unit: '조' },
    m2: { id: 'm2', component: M2Supply, title: 'M2 통화량', value: '4100.2조', unit: '조', icon: Landmark },
};

interface MarketIndicatorsCarouselProps {
    selectedIndicator: IndicatorId;
    onIndicatorSelect: (id: IndicatorId) => void;
}

export function MarketIndicatorsCarousel({ selectedIndicator, onIndicatorSelect }: MarketIndicatorsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
    });
    
    const indicatorOrder: IndicatorId[] = ['dominance', 'volume', 'kimchi', 'fear', 'drop', 'stable', 'm2'];


    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {indicatorOrder.map(id => {
                    const IndicatorComponent = indicatorData[id].component;
                    const isSelected = selectedIndicator === id;
                    return (
                        <div
                            key={id}
                            className={cn(
                                "embla__slide p-1 cursor-pointer transition-opacity",
                                !isSelected && "opacity-60 hover:opacity-100"
                            )}
                            onClick={() => onIndicatorSelect(id)}
                        >
                            <div className={cn(
                                "rounded-xl transition-all h-full",
                                isSelected && "ring-2 ring-primary"
                            )}>
                                <IndicatorComponent />
                            </div>
                        </div>
                    );
                })}
            </div>
            <style jsx>{`
                .embla {
                    overflow: hidden;
                }
                .embla__container {
                    display: flex;
                    margin-left: -1rem;
                }
                .embla__slide {
                    flex: 0 0 33.333%;
                    min-width: 0;
                    padding-left: 1rem;
                }
                @media (min-width: 768px) {
                    .embla__slide {
                        flex: 0 0 25%;
                    }
                }
                @media (min-width: 1024px) {
                    .embla__slide {
                        flex: 0 0 20%;
                    }
                }
            `}</style>
        </div>
    );
}
