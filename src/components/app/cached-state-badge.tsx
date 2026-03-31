import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";

interface CachedStateBadgeProps {
  isValidating: boolean;
  isLoading: boolean;
  className?: string;
}

export function CachedStateBadge({ isValidating, isLoading, className }: CachedStateBadgeProps) {
  if (isLoading) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300 backdrop-blur-sm", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading...
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-300 backdrop-blur-sm", className)}>
        <Clock className="h-3 w-3 animate-pulse" />
        Syncing...
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 backdrop-blur-sm", className)}>
      <CheckCircle2 className="h-3 w-3" />
      Live
    </div>
  );
}
