import { useState } from "react";
import Header from "@/components/Header";
import LoginPrompt from "@/components/LoginPrompt";
import CurrencyTabs from "@/components/CurrencyTabs";
import FilterPills from "@/components/FilterPills";
import AssetListHeader from "@/components/AssetListHeader";
import AssetRow from "@/components/AssetRow";
import PromoBanner from "@/components/PromoBanner";
import BottomNav from "@/components/BottomNav";
import EconomicCalendar from "@/components/dashboard/economic-calendar";
import DataLab from "@/components/dashboard/DataLab";

const cryptoAssets = [
  { name: "테더 골드", symbol: "XAUT", price: "6,300,000", change: "+0.91%", volume: "2,097백만", badge: "new" as const },
  { name: "템코", symbol: "TEMCO", price: "1.663", change: "+38.70%", volume: "23,660백만", badge: "free" as const, hasIndicator: true },
  { name: "래드웍스", symbol: "RAD", price: "515", change: "+34.46%", volume: "11,790백만", badge: "stock" as const, hasIndicator: true, isHighlighted: true },
  { name: "디파이 앱", symbol: "HOME", price: "31.37", change: "+20.19%", volume: "2,012백만", hasIndicator: true },
  { name: "아르고", symbol: "AERGO", price: "94.00", change: "+16.16%", volume: "5,019백만", hasIndicator: true },
  { name: "스토리", symbol: "IP", price: "2,751", change: "+12.29%", volume: "6,350백만", hasIndicator: true },
  { name: "어댑터 토큰", symbol: "ADP", price: "1.426", change: "+10.72%", volume: "7,621백만", badge: "free" as const, hasIndicator: true },
  { name: "쿠키다오", symbol: "COOKIE", price: "64.06", change: "+10.23%", volume: "4,312백만", hasIndicator: true },
  { name: "라그랑주", symbol: "LA", price: "466", change: "+9.65%", volume: "4,253백만", hasIndicator: true },
  { name: "비트코인", symbol: "BTC", price: "92,105,000", change: "+1.24%", volume: "152,300백만", hasIndicator: true },
  { name: "이더리움", symbol: "ETH", price: "3,521,000", change: "+2.15%", volume: "85,420백만", hasIndicator: true },
];

const Index = () => {
  const [headerTab, setHeaderTab] = useState("exchange");
  const [currencyTab, setCurrencyTab] = useState("krw");
  const [activeFilter, setActiveFilter] = useState("all");
  const [bottomTab, setBottomTab] = useState("exchange");

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div id="app-container" className="w-full max-w-[430px] h-[100dvh] bg-background relative flex flex-col shadow-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Header activeTab={headerTab} onTabChange={setHeaderTab} />
          
          {headerTab === "calendar" ? (
            <div className="px-4 pt-4 pb-8">
              <EconomicCalendar />
            </div>
          ) : headerTab === "datalab" ? (
            <DataLab />
          ) : (
            <>
              <LoginPrompt />
              
              <CurrencyTabs activeTab={currencyTab} onTabChange={setCurrencyTab} />
              
              <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              
              <AssetListHeader />
              
              <div className="divide-y divide-border/30 pb-28">
                {cryptoAssets.map((asset, index) => (
                  <AssetRow
                    key={index}
                    name={asset.name}
                    symbol={asset.symbol}
                    price={asset.price}
                    change={asset.change}
                    volume={asset.volume}
                    badge={asset.badge}
                    hasIndicator={asset.hasIndicator}
                    isHighlighted={asset.isHighlighted}
                  />
                ))}
              </div>
              
              <PromoBanner />
            </>
          )}
        </div>
        
        <BottomNav activeTab={bottomTab} onTabChange={setBottomTab} />
      </div>
    </div>
  );
};

export default Index;
