import React from 'react';
import { BarChart2, ArrowRight } from "lucide-react";

interface IndicatorBannerProps {
  onClick: () => void;
}

export function IndicatorBanner({ onClick }: IndicatorBannerProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <BarChart2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-orange-900">보조지표 한눈에 파악하기</h3>
          <p className="text-xs text-orange-600/80 mt-0.5">시장 상황을 더 정확하게 분석하세요</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

