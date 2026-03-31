import { Wallet2, RefreshCw, Power } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { CachedStateBadge } from "./cached-state-badge";
import { WalletButton } from "./wallet-button";

interface WalletPanelProps {
  isConnected: boolean;
  address: string;
  balance: string | null;
  isBalanceLoading: boolean;
  balanceError: string | null;
  onRefreshBalance: () => void;
  onDisconnect: () => void;
}

export function WalletPanel({
  isConnected,
  address,
  balance,
  isBalanceLoading,
  balanceError,
  onRefreshBalance,
  onDisconnect,
}: WalletPanelProps) {
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-white">
          <Wallet2 className="text-blue-400" /> Wallet Connection
        </h2>
        {isConnected && <CachedStateBadge isLoading={isBalanceLoading} isValidating={isBalanceLoading} />}
      </div>

      {!isConnected ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center space-y-6">
          <p className="text-sm text-slate-400">
            Connect your Freighter or Albedo wallet to view your balance and interact
            with the network.
          </p>
          <div className="flex justify-center">
             <WalletButton />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-black/50 p-5">
             <div className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wider">Connected Address</div>
             <div className="font-mono text-sm text-blue-300 break-all bg-blue-500/10 p-2 rounded border border-blue-500/20">
               {address}
             </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/50 p-5">
             <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-wider">
               <span>Spendable Native Balance</span>
               <button 
                onClick={onRefreshBalance} 
                disabled={isBalanceLoading}
                className="hover:text-white transition-colors disabled:opacity-50"
               >
                 <RefreshCw size={14} className={isBalanceLoading ? "animate-spin" : ""} />
               </button>
             </div>
             <div className="text-3xl font-light text-white">
               {isBalanceLoading && !balance ? (
                 <Skeleton className="h-10 w-32" />
               ) : balanceError ? (
                 <span className="text-red-400 text-base">{balanceError}</span>
               ) : (
                 <div className="flex items-baseline gap-2">
                   {balance} <span className="text-lg text-slate-500 font-medium">XLM</span>
                 </div>
               )}
             </div>
          </div>

          <button
            onClick={onDisconnect}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Power size={16} /> Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
