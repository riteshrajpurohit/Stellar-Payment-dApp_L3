"use client";

import { useState } from "react";
import { Box, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { incrementCounter } from "@/lib/contract/contract-client";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { notifyError, notifySuccess } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { CachedStateBadge } from "./cached-state-badge";

interface ContractPanelProps {
  isConnected: boolean;
  counterValue: number | null;
  isLoading: boolean;
  isValidating: boolean;
  error: string | null;
  walletAddress: string | null;
  onRefresh: () => void;
}

export function ContractPanel({
  isConnected,
  counterValue,
  isLoading,
  isValidating,
  error,
  walletAddress,
  onRefresh,
}: ContractPanelProps) {
  const { signTransaction } = useWalletStore();
  const [isIncrementing, setIsIncrementing] = useState(false);

  const handleIncrement = async () => {
    if (!walletAddress) return;
    setIsIncrementing(true);
    try {
      const hash = await incrementCounter(walletAddress, async (xdr) => {
        return await signTransaction(xdr);
      });
      notifySuccess("Success", `Counter incremented! Hash: ${hash.substring(0,6)}...`);
      onRefresh(); // Invalidate cache
    } catch (err: any) {
      notifyError("Failed", err.message || "Failed to increment counter.");
    } finally {
      setIsIncrementing(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-white">
          <Box className="text-purple-400" /> Soroban Contract
        </h2>
        <CachedStateBadge isLoading={isLoading} isValidating={isValidating} />
      </div>

      <div className="rounded-xl border border-white/10 bg-black/50 p-6 flex flex-col items-center justify-center text-center">
        <div className="mb-2 text-sm font-medium text-slate-400 uppercase tracking-wider">Network Counter Value</div>
        
        <div className="text-6xl font-light text-white my-4">
          {isLoading && counterValue === null ? (
            <Skeleton className="h-20 w-32 mx-auto" />
          ) : error ? (
            <div className="text-red-400 text-sm flex items-center gap-2"><AlertCircle size={16}/> {error}</div>
          ) : (
            counterValue ?? "0"
          )}
        </div>

        <div className="mt-4 flex w-full gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading || isValidating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isValidating ? "animate-spin" : ""} /> Sync
          </button>

          <button
            onClick={handleIncrement}
            disabled={!isConnected || isIncrementing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 border border-purple-500 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {isIncrementing ? <Spinner className="text-white" /> : <Plus size={16} />}
            Increment
          </button>
        </div>

        {!isConnected && (
          <p className="mt-4 text-xs text-amber-400/80">Connect wallet to invoke contract methods.</p>
        )}
      </div>
    </div>
  );
}
