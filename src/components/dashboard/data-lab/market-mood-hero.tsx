import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, CloudRain, Sun, CloudLightning, ThermometerSun, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MarketMoodHeroProps {
  score: number; // 0-100
  onDeepDive?: () => void;
}

export function MarketMoodHero({ score, onDeepDive }: MarketMoodHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMoodText = () => {
    if (score >= 80) return { 
      title: "강력 매수 구간", 
      desc: "상승 모멘텀이 매우 강합니다.", 
      longDesc: "매수 심리가 최고조에 달했습니다. 적극적으로 수익을 극대화할 수 있는 구간입니다.",
      action: "지금 뜨는 주도주 확인하기",
      icon: ThermometerSun,
      theme: "red"
    };
    if (score >= 60) return { 
      title: "상승 우위 장세", 
      desc: "견고한 상승 흐름입니다.", 
      longDesc: "매수세가 우위인 상황입니다. 추세를 따르는 매매가 유리합니다.",
      action: "상승세 강한 테마 보기",
      icon: Sun,
      theme: "orange" 
    };
    if (score >= 40) return { 
      title: "혼조세 / 관망", 
      desc: "뚜렷한 방향성이 없습니다.", 
      longDesc: "상승과 하락 힘이 팽팽합니다. 섣불리 진입하기보다 현금을 보유하세요.",
      action: "실시간 수급 현황 체크",
      icon: CloudRain,
      theme: "slate"
    };
    return { 
      title: "하락 주의보", 
      desc: "리스크 관리가 필요합니다.", 
      longDesc: "매도 압력이 강합니다. 무리한 진입보다는 저점을 기다리세요.",
      action: "과매도 반등 기회 찾기",
      icon: CloudLightning,
      theme: "blue"
    };
  };

  const mood = getMoodText();
  const Icon = mood.icon;

  // 색상 팔레트 동적 생성
  const getThemeColors = (theme: string) => {
    switch(theme) {
      case 'red': return { 
        bg: "bg-red-50/50", 
        border: "border-red-100", 
        text: "text-red-700", 
        subText: "text-red-600/80", 
        progress: "bg-red-500",
        progressText: "text-red-600"
      };
      case 'orange': return { 
        bg: "bg-orange-50/50", 
        border: "border-orange-100", 
        text: "text-orange-700", 
        subText: "text-orange-600/80", 
        progress: "bg-orange-500",
        progressText: "text-orange-600"
      };
      case 'blue': return { 
        bg: "bg-blue-50/50", 
        border: "border-blue-100", 
        text: "text-blue-700", 
        subText: "text-blue-600/80", 
        progress: "bg-blue-500",
        progressText: "text-blue-600"
      };
      default: return { 
        bg: "bg-slate-50/50", 
        border: "border-slate-200", 
        text: "text-slate-700", 
        subText: "text-slate-600/80", 
        progress: "bg-slate-600",
        progressText: "text-slate-700"
      };
    }
  };

  const themeColors = getThemeColors(mood.theme);

  // 보조 지표 데이터 (Mock)
  const indicators = [
    { 
      label: "상승 자산 비중", 
      value: 72, 
      max: 100, 
      unit: "%", 
      desc: "시장 전반이 오르고 있어요",
    },
    { 
      label: "평균 RSI", 
      value: 68, 
      max: 100, 
      unit: "", 
      desc: "매수세가 강한 편이에요",
    },
    { 
      label: "공포/탐욕 지수", 
      value: 82, 
      max: 100, 
      unit: "점", 
      desc: "극단적 탐욕 단계",
    },
    { 
      label: "거래 대금 강도", 
      value: 140, 
      max: 200, 
      unit: "%", 
      desc: "평소보다 거래가 활발해요",
    },
  ];

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${themeColors.border} ${themeColors.bg} transition-all duration-300`}>
      {/* Background Animated Orb */}
      <div className="absolute -top-10 -right-10 opacity-30 blur-3xl pointer-events-none">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${mood.theme === 'blue' ? 'from-blue-400 to-indigo-300' : 'from-red-400 to-orange-300'} animate-pulse`} />
      </div>

      <div className="relative z-10 p-5">
        {/* Header Layout */}
        <div className="flex justify-between items-start mb-5">
          <div className="space-y-1">
            <h2 className={`text-2xl font-bold tracking-tight ${themeColors.text}`}>
              {mood.title}
            </h2>
            <p className={`text-sm font-medium ${themeColors.subText} leading-snug`}>
              {mood.desc}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between pt-1 text-[11px] font-medium text-muted-foreground/60 hover:text-foreground transition-colors group"
        >
          <span>판단 근거 보기</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 group-hover:text-foreground" /> : <ChevronDown className="w-3.5 h-3.5 group-hover:text-foreground" />}
        </button>
      </div>

      {/* Expanded Details (Sliders) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-background/50 border-t border-border/50"
          >
            <div className="p-5 space-y-4">
              {indicators.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                    <span className={`text-xs font-bold ${themeColors.progressText}`}>
                      {item.value}{item.unit}
                    </span>
                  </div>
                  <Progress value={(item.value / item.max) * 100} className="h-1.5 bg-black/5" indicatorClassName={themeColors.progress} />
                  <p className="text-[10px] text-muted-foreground text-right">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
