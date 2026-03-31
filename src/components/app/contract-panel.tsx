"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { getCounter, incrementCounter } from "@/lib/contract/contract-client";
import { notifyError, notifySuccess } from "@/lib/toast";
import { Loader2, RefreshCw, Zap } from "lucide-react";

export function ContractPanel() {
  const { address, isConnected, signTransaction } = useWalletStore();
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [lastHash, setLastHash] = useState<string | null>(null);

  const fetchCounter = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const val = await getCounter(address);
      setCounter(val);
    } catch (e: any) {
      console.error(e);
      notifyError("Read Error", "Failed to get contract state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchCounter();
      // Optional: Set up real-time polling
      const interval = setInterval(fetchCounter, 10000);
      return () => clearInterval(interval);
    } else {
      setCounter(null);
    }
  }, [isConnected, address]);

  const handleIncrement = async () => {
    if (!address) return;
    setTxPending(true);
    setLastHash(null);
    try {
      notifySuccess(
        "Transaction started",
        "Please sign the transaction in your wallet.",
      );
      const hash = await incrementCounter(address, signTransaction);
      setLastHash(hash);
      notifySuccess("Success!", "Counter incremented successfully.");
      await fetchCounter();
    } catch (e: any) {
      notifyError(
        "Transaction Failed",
        e.message || "Failed to interact with contract.",
      );
    } finally {
      setTxPending(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-zinc-950/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-100">
            <Zap className="w-5 h-5 text-yellow-500" />
            Smart Contract
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Connect wallet to act with the Soroban Counter.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-950/50 border-zinc-800 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-zinc-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Soroban Counter
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-zinc-500">Live</span>
          </div>
        </CardTitle>
        <CardDescription className="text-zinc-400">
          State reflects the current counter on Stellar Testnet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/50">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-400">Current Value</p>
            <p className="text-4xl font-bold tracking-tight text-white">
              {counter !== null ? (
                counter
              ) : loading ? (
                <RefreshCw className="animate-spin w-6 h-6 text-zinc-500" />
              ) : (
                "--"
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCounter}
            disabled={loading}
            className="border-zinc-700 bg-transparent text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-900/20"
          onClick={handleIncrement}
          disabled={txPending || counter === null}
        >
          {txPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Transaction...
            </>
          ) : (
            "Increment Counter"
          )}
        </Button>

        {lastHash && (
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 flex flex-col gap-1 text-sm">
            <span className="text-emerald-500 font-medium">
              Transaction Successful
            </span>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${lastHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors truncate"
            >
              Hash: {lastHash}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
