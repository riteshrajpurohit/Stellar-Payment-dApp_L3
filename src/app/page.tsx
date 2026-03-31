"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { ActivityCard } from "@/components/app/activity-card";
import { AppHeader } from "@/components/app/app-header";
import { FaucetHint } from "@/components/app/faucet-hint";
import { TransactionForm } from "@/components/app/transaction-form";
import { TxResultCard } from "@/components/app/tx-result-card";
import { WalletPanel } from "@/components/app/wallet-panel";
import { ContractPanel } from "@/components/app/contract-panel";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { useCachedContract } from "@/lib/cache/use-cached-contract";

export default function Home() {
  const {
    address: walletAddress,
    isConnected,
    isConnecting,
    disconnect,
  } = useWalletStore();

  const wallet = useStellarWallet();
  const contract = useCachedContract(walletAddress || "");

  return (
    <div className="min-h-screen pb-20">
      <AppHeader
        isConnected={isConnected}
        walletAddress={walletAddress || ""}
        isConnecting={isConnecting}
        onConnect={() => {}}
        onDisconnect={disconnect}
      />

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-28 md:px-8">
        <section className="glass-card p-7 md:p-10 mb-10">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-sm">
              <ShieldCheck className="size-4" />
              Stellar Operations Console
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Live Web3 Command Center
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              A production-ready environment featuring Multi-Wallet support
              (Freighter & Albedo), Soroban Smart Contracts, cache invalidation,
              and real-time event tracking.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Wallet Status */}
          <div className="space-y-6 lg:col-span-5">
            <WalletPanel
              isConnected={isConnected}
              address={walletAddress || ""}
              balance={wallet.balance}
              isBalanceLoading={wallet.isBalanceLoading}
              balanceError={wallet.balanceError}
              onRefreshBalance={wallet.refreshBalance}
              onDisconnect={disconnect}
            />
            
            <ContractPanel 
              isConnected={isConnected} 
              counterValue={contract.counterValue}
              isLoading={contract.isContractLoading}
              isValidating={contract.isContractValidating}
              error={contract.contractError}
              walletAddress={walletAddress}
              onRefresh={contract.refreshContract}
            />
          </div>

          {/* Right Column: Transactions & Activity */}
          <div className="space-y-6 lg:col-span-7">
            <div className="glass-card p-6">
              <TransactionForm
                disabled={!isConnected}
                isSubmitting={wallet.txStatus === "pending"}
                onSubmit={wallet.sendPayment}
              />
            </div>
            
            {wallet.lastTx && (
              <TxResultCard
                status={wallet.txStatus}
                error={wallet.txError}
                result={wallet.lastTx}
              />
            )}
            
            <ActivityCard items={wallet.activity} />
            <FaucetHint />
          </div>
        </div>
      </main>
    </div>
  );
}
