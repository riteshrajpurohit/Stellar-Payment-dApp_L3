"use client";

import { useState, useEffect } from "react";
import { ArrowDownToLine, ShieldCheck, ExternalLink } from "lucide-react";

import { ActivityCard } from "@/components/app/activity-card";
import { AppHeader } from "@/components/app/app-header";
import { FaucetHint } from "@/components/app/faucet-hint";
import { TransactionForm } from "@/components/app/transaction-form";
import { TxResultCard } from "@/components/app/tx-result-card";
import { WalletPanel } from "@/components/app/wallet-panel";
import { ContractPanel } from "@/components/app/contract-panel";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";

export default function Home() {
  const {
    address: walletAddress,
    isConnected,
    isConnecting,
    disconnect,
  } = useWalletStore();

  // Use legacy hook just for transaction building if they want it
  const legacyWallet = useStellarWallet();

  return (
    <div className="min-h-screen">
      <AppHeader
        isConnected={isConnected}
        walletAddress={walletAddress || ""}
        isConnecting={isConnecting}
        onConnect={() => {}}
        onDisconnect={disconnect}
      />

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8 md:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-7 shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 size-48 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100">
              <ShieldCheck className="size-4" />
              Stellar Testnet Live
            </div>

            <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
              Stellar Web3 Level 2 dApp
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              A production-ready environment featuring Multi-Wallet support
              (Freighter & Albedo), Soroban Smart Contracts, real-time events,
              and robust transaction tracking.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {/* Smart Contract Panel */}
          <ContractPanel />

          <WalletPanel
            isConnected={isConnected}
            address={walletAddress || ""}
            balance={legacyWallet.balance}
            isBalanceLoading={legacyWallet.isBalanceLoading}
            balanceError={legacyWallet.balanceError}
            onRefreshBalance={() =>
              walletAddress && legacyWallet.refreshBalance(walletAddress)
            }
            onDisconnect={disconnect}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <TransactionForm
              disabled={!isConnected}
              isSubmitting={legacyWallet.txStatus === "pending"}
              onSubmit={legacyWallet.sendPayment}
            />
            <TxResultCard
              status={legacyWallet.txStatus}
              error={legacyWallet.txError}
              result={legacyWallet.lastTx}
            />
          </div>
          <div className="space-y-6">
            <ActivityCard items={legacyWallet.activity} />
            <FaucetHint />
          </div>
        </section>
      </main>
    </div>
  );
}
