interface CurrencyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CurrencyTabs = ({ activeTab, onTabChange }: CurrencyTabsProps) => {
  const tabs = [
    { id: "krw", label: "원화" },
    { id: "btc", label: "BTC" },
    { id: "holdings", label: "보유" },
    { id: "watchlist", label: "관심" },
  ];

  return (
    <div className="mt-3 border-b border-border px-4">
      <div className="flex gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-2.5 text-[15px] font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-tab-active"
                : "text-tab-inactive"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencyTabs;
