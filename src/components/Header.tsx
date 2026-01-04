import { Search, Bell, Settings } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const tabs = [
    { id: "exchange", label: "거래소" },
    { id: "recommend", label: "추천", hasNotification: true },
    { id: "trends", label: "동향" },
    { id: "calendar", label: "캘린더" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background px-4 pt-5 pb-1">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative text-[17px] font-bold transition-colors select-none ${
                activeTab === tab.id
                  ? "text-tab-active"
                  : "text-tab-inactive"
              }`}
            >
              {tab.label}
              {tab.hasNotification && (
                <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="text-foreground select-none">
            <Search className="h-[22px] w-[22px]" strokeWidth={2} />
          </button>
          <button className="relative text-foreground select-none">
            <Bell className="h-[22px] w-[22px]" strokeWidth={2} />
          </button>
          <button className="text-foreground select-none">
            <Settings className="h-[22px] w-[22px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
