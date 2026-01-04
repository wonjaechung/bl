import { ChevronRight } from "lucide-react";

const LoginPrompt = () => {
  return (
    <div className="mx-4 mt-2 rounded-xl bg-secondary p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            <span className="text-[15px] font-medium text-foreground">
              로그인이 필요해요
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-0.5 text-[13px]">
            <span className="text-muted-foreground">최초 가입 시 </span>
            <span className="font-medium text-primary">최대 2만원 지급!</span>
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center">
          <div className="relative">
            <svg viewBox="0 0 48 48" className="h-12 w-12">
              <circle cx="17" cy="18" r="8" fill="hsl(var(--primary))" opacity="0.25" />
              <circle cx="31" cy="18" r="8" fill="hsl(var(--primary))" opacity="0.25" />
              <ellipse cx="24" cy="32" rx="10" ry="8" fill="hsl(var(--primary))" opacity="0.2" />
            </svg>
            <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
