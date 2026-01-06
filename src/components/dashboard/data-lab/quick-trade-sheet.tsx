import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus, CreditCard } from "lucide-react";

interface QuickTradeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  type?: 'buy' | 'sell';
}

export function QuickTradeSheet({ isOpen, onClose, symbol, type = 'buy' }: QuickTradeSheetProps) {
  const [amount, setAmount] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  const handlePercentageChange = (value: number[]) => {
    const newPercent = value[0];
    setPercentage(newPercent);
    // Mock calculation: Total balance assumed 1,000,000 KRW
    setAmount(Math.floor(1000000 * (newPercent / 100)));
  };

  const isBuy = type === 'buy';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] p-6 h-auto max-h-[85vh]">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <span className="font-bold text-primary">{symbol}</span>
            <span className="font-normal text-foreground">간편 {isBuy ? '매수' : '매도'}</span>
          </SheetTitle>
          <SheetDescription>
            현재가 <span className={isBuy ? "text-red-500 font-bold" : "text-blue-500 font-bold"}>98,200,000 KRW</span> (시장가)
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Amount Input */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-muted-foreground">{isBuy ? '매수' : '매도'} 금액 (KRW)</label>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-xl shrink-0"
                onClick={() => setAmount(Math.max(0, amount - 10000))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="relative flex-1">
                <Input 
                  type="text" 
                  value={amount.toLocaleString()} 
                  readOnly
                  className="h-12 text-center text-lg font-bold bg-muted/20 border-border rounded-xl focus-visible:ring-0 focus-visible:border-primary" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">원</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-xl shrink-0"
                onClick={() => setAmount(amount + 10000)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Percentage Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <Slider
              defaultValue={[0]}
              max={100}
              step={10}
              value={[percentage]}
              onValueChange={handlePercentageChange}
              className="py-2"
            />
            <div className="flex justify-between gap-2 mt-2">
               {[10, 25, 50, 100].map((p) => (
                 <Button 
                   key={p} 
                   variant="outline" 
                   size="sm" 
                   className={`flex-1 text-xs h-8 ${percentage === p ? 'bg-primary/10 border-primary text-primary' : ''}`}
                   onClick={() => handlePercentageChange([p])}
                 >
                   {p}%
                 </Button>
               ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button 
                onClick={() => {
                    alert(`${isBuy ? '매수' : '매도'} 주문이 접수되었습니다!`);
                    onClose();
                }}
                className={`w-full h-14 text-lg font-bold rounded-xl gap-2 shadow-lg ${
                isBuy 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
            }`}>
              <CreditCard className="w-5 h-5" />
              {amount > 0 
                ? `${(amount/10000).toFixed(0)}만원 ${isBuy ? '매수' : '매도'}하기` 
                : '금액을 입력하세요'
              }
            </Button>
            <p className="text-center text-[11px] text-muted-foreground mt-3">
              시장가로 즉시 체결됩니다. 수수료 0.04% 포함.
            </p>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
           <SheetClose asChild>
             <Button variant="ghost" className="w-full">닫기</Button>
           </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
