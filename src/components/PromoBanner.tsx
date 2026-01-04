import { X, ChevronRight } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className="fixed bottom-14 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4 mb-safe">
      <div className="flex items-center justify-between rounded-xl bg-banner px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-primary-foreground">
              오늘의 급등 코인! 완벽 분석
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-[13px] text-primary">빗썸 AI 일일시황 확인하기</span>
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
        </div>
        <button className="p-1 text-muted-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
