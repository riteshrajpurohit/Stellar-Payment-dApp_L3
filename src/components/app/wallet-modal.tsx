"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/wallet/useWallet";

export function WalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { supportedWallets, connect, isConnecting } = useWalletStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Connect a Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Choose your preferred Stellar wallet to connect
          </DialogDescription>
          <div className="sr-only" aria-describedby="dialog-description">
            Select a wallet provider to connect your account.
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {supportedWallets.map((wallet: any) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="h-14 flex items-center justify-between px-4 hover:bg-zinc-900 border-zinc-800"
              disabled={isConnecting}
              onClick={async () => {
                await connect(wallet.id);
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                  {wallet.icon ? (
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs">{wallet.name[0]}</span>
                  )}
                </div>
                <span className="font-medium text-base text-zinc-200">
                  {wallet.name}
                </span>
              </div>
              <span className="text-xs text-zinc-500">
                {isConnecting ? "Connecting..." : "Connect"}
              </span>
            </Button>
          ))}
          {supportedWallets.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              Loading wallets...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
