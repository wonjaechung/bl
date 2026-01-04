import { ChevronDown } from "lucide-react";

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterPills = ({ activeFilter, onFilterChange }: FilterPillsProps) => {
  const filters = [
    { id: "all", label: "전체" },
    { id: "rising", label: "상승신호" },
    { id: "major", label: "메이저" },
    { id: "general", label: "일반" },
    { id: "new", label: "신규" },
    { id: "caution", label: "거래유의" },
  ];

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pl-4 pr-12 py-2.5 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-foreground text-background"
                : "border border-border bg-background text-muted-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 flex items-center px-4 bg-gradient-to-l from-background via-background to-transparent">
        <button className="p-1">
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default FilterPills;
