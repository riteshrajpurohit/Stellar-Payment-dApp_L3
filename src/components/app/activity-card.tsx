import { Activity, Clock } from "lucide-react";
import type { ActivityItem } from "@/types/stellar";

interface ActivityCardProps {
  items: ActivityItem[];
}

export function ActivityCard({ items }: ActivityCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-white">
          <Activity className="text-fuchsia-400" /> Recent Activity
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center text-sm text-slate-400">
          No recent activity found in this session.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border border-white/5 bg-black/40 p-4 transition-colors hover:hover:border-white/10"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <span
                  className={
                    item.status === "success"
                      ? "text-emerald-400"
                      : item.status === "pending"
                      ? "text-blue-400"
                      : "text-red-400"
                  }
                >
                  {item.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-slate-500 font-mono">
                  <Clock size={12} />
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
