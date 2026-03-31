"use client";

import { Wallet, Zap } from "lucide-react";

interface AppHeaderProps {
  isConnected: boolean;
  walletAddress: string;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function AppHeader({
  isConnected,
  walletAddress,
  isConnecting,
  onConnect,
  onDisconnect,
}: AppHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Zap size={18} />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-white hidden sm:block">
            Stellar Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${
                isConnected
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  : "bg-slate-600"
              }`}
            />
            <span className="text-sm font-medium text-slate-300">
              {isConnected ? "Network Live" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
