import { ChevronsUpDown, ChevronDown } from "lucide-react";

const AssetListHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-[11px] text-muted-foreground bg-secondary/30 border-y border-border/50">
      <div className="flex items-center gap-0.5">
        <span>자산명</span>
        <ChevronsUpDown className="h-3 w-3" />
      </div>
      <div className="flex items-center text-right">
        <div className="flex items-center gap-0.5 w-[90px] justify-end">
          <span>현재가</span>
          <ChevronsUpDown className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-0.5 w-[70px] justify-end">
          <span className="font-medium text-foreground underline decoration-1 underline-offset-2">어제</span>
          <span>·</span>
          <span className="font-medium text-foreground">변동</span>
          <ChevronDown className="h-3 w-3 text-foreground fill-current" />
        </div>
        <div className="flex items-center gap-0.5 w-[75px] justify-end">
          <span>거래금액</span>
          <ChevronsUpDown className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default AssetListHeader;
