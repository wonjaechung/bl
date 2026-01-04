interface AssetRowProps {
  name: string;
  symbol: string;
  price: string;
  change: string;
  volume: string;
  badge?: "new" | "free" | "stock";
  hasIndicator?: boolean;
  isHighlighted?: boolean;
}

const AssetRow = ({
  name,
  symbol,
  price,
  change,
  volume,
  badge,
  hasIndicator = false,
  isHighlighted = false,
}: AssetRowProps) => {
  const changeValue = parseFloat(change.replace(/[+%]/g, ""));
  const isPositive = changeValue > 0;

  return (
    <div
      className={`flex w-full items-center justify-between py-2.5 pr-4 touch-active select-none ${
        isHighlighted ? "bg-secondary/50" : ""
      } pl-4`}
    >
      <div className="flex items-center gap-0">
        <div className="relative h-8 w-1.5 bg-secondary rounded-sm mr-3 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border z-0" />
          <div 
            className={`absolute w-full left-0 z-10 transition-all duration-300 ${
              isPositive ? "bg-price-up origin-bottom" : "bg-price-down origin-top"
            }`}
            style={{ 
              height: `${Math.min(Math.abs(changeValue) / 30 * 50, 50)}%`,
              [isPositive ? 'bottom' : 'top']: '50%'
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-semibold text-foreground">{name}</span>
            {badge === "new" && (
              <span className="rounded bg-badge-new px-1 py-0.5 text-[9px] font-bold text-primary-foreground">
                N
              </span>
            )}
            {badge === "free" && (
              <span className="rounded bg-badge-free px-1 py-0.5 text-[9px] font-bold text-primary-foreground">
                무료
              </span>
            )}
            {badge === "stock" && (
              <span className="rounded bg-badge-stock px-1 py-0.5 text-[9px] font-bold text-primary-foreground">
                주
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5">{symbol}</span>
        </div>
      </div>
      
      <div className="flex items-center text-right">
        <span className={`text-[15px] font-medium w-[90px] text-right ${isPositive ? "text-price-up" : "text-foreground"}`}>
          {price}
        </span>
        <span className={`text-[13px] w-[70px] text-right ${isPositive ? "text-price-up" : "text-foreground"}`}>
          {change}
        </span>
        <span className="text-[13px] w-[75px] text-right text-muted-foreground">{volume}</span>
      </div>
    </div>
  );
};

export default AssetRow;
