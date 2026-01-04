import { TrendingUp, LayoutGrid, Wallet, ArrowLeftRight, MoreHorizontal } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems = [
    { id: "exchange", label: "거래소", icon: TrendingUp },
    { id: "services", label: "혜택/서비스", icon: LayoutGrid },
    { id: "assets", label: "자산현황", icon: Wallet },
    { id: "transfer", label: "입출금", icon: ArrowLeftRight },
    { id: "more", label: "더보기", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background">
      <div className="flex items-center justify-around py-1.5 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 select-none ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
