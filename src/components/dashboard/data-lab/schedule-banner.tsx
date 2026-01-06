import React from 'react';
import { CalendarClock, ArrowRight } from "lucide-react";

interface ScheduleBannerProps {
  onClick: () => void;
}

export function ScheduleBanner({ onClick }: ScheduleBannerProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <CalendarClock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-900">시장 일정 한눈에 파악하기</h3>
          <p className="text-xs text-blue-600/80 mt-0.5">주요 경제 지표와 호재 이슈를 놓치지 마세요</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

