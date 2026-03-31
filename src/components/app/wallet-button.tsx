"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WalletModal } from "@/components/app/wallet-modal";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { shortenAddress } from "@/utils/format";
import { LogOut, Wallet } from "lucide-react";

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, disconnect, init } = useWalletStore();

  useEffect(() => {
    init().finally(() => setMounted(true));
  }, [init]);

  if (!mounted)
    return <div className="w-32 h-10 animate-pulse bg-zinc-800 rounded-full" />;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
          {shortenAddress(address)}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-full transition-colors"
          onClick={disconnect}
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium px-6 shadow-lg shadow-zinc-100/10 transition-all rounded-full"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
