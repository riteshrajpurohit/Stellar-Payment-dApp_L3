"use client";

import { useCallback, useState, useEffect } from "react";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { STELLAR_NETWORK_PASSPHRASE } from "@/lib/constants";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toast";
import type {
  ActivityItem,
  TransactionResult,
  TxStatus,
  WalletConnectionState,
} from "@/types/stellar";
import { validateTransactionInput } from "@/utils/validation";

interface SendPaymentInput {
  recipient: string;
  amount: string;
  memo?: string;
}

const loadStellarHelpers = () => import("@/lib/stellar");

export const useStellarWallet = () => {
  const {
    address,
    isConnected,
    isConnecting,
    disconnect,
    signTransaction,
    init,
  } = useWalletStore();

  const [balance, setBalance] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txError, setTxError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TransactionResult | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const addActivity = useCallback((item: ActivityItem) => {
    setActivity((prev) => [item, ...prev].slice(0, 5));
  }, []);

  const refreshBalance = useCallback(
    async (targetAddress?: string) => {
      const addr = targetAddress || address;
      if (!addr) {
        setBalance(null);
        return;
      }

      setIsBalanceLoading(true);
      setBalanceError(null);

      try {
        const { fetchXlmBalance } = await loadStellarHelpers();
        const freshBalance = await fetchXlmBalance(addr);
        setBalance(freshBalance);
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to fetch wallet balance.";
        setBalanceError(msg);
        notifyError("Balance lookup failed", msg);
      } finally {
        setIsBalanceLoading(false);
      }
    },
    [address],
  );

  useEffect(() => {
    if (isConnected && address) refreshBalance(address);
  }, [isConnected, address, refreshBalance]);

  const sendPayment = useCallback(
    async ({ recipient, amount, memo }: SendPaymentInput) => {
      if (!address) {
        const message = "Connect your wallet before sending XLM.";
        setTxError(message);
        notifyError("Wallet required", message);
        return;
      }

      const validationError = validateTransactionInput({
        recipient,
        amount,
        memo,
      });
      if (validationError) {
        setTxError(validationError);
        notifyError("Invalid transaction details", validationError);
        return;
      }

      const { StrKey } = await import("@stellar/stellar-sdk");
      if (!StrKey.isValidEd25519PublicKey(recipient.trim())) {
        const message = "Recipient address is not a valid Stellar public key.";
        setTxError(message);
        notifyError("Invalid address", message);
        return;
      }

      setTxStatus("pending");
      setTxError(null);
      setLastTx(null);

      try {
        const { buildAndSubmitPayment, hasEnoughSpendableBalance } =
          await loadStellarHelpers();

        // Check balance first
        if (balance) {
          if (!hasEnoughSpendableBalance(balance, amount)) {
            throw new Error(
              `Insufficient funds. Your spendable balance is less than ${amount} XLM.`,
            );
          }
        }

        notifyInfo(
          "Payment Started",
          "Please review and sign the transaction in your wallet.",
        );

        const result = await buildAndSubmitPayment(
          {
            sourceAddress: address,
            recipient,
            amount,
            memo,
          },
          async (xdr: string) => await signTransaction(xdr),
        );

        setLastTx(result);
        setTxStatus("success");
        notifySuccess(
          "Payment Successful",
          `Sent ${amount} XLM to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
        );

        addActivity({
          id: result.hash,
          type: "payment",
          amount,
          target: recipient,
          status: "success",
          timestamp: Date.now(),
          txHash: result.hash,
        });

        refreshBalance(address);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Payment failed. Please try again.";
        setTxError(errorMsg);
        setTxStatus("error");
        notifyError("Transaction Failed", errorMsg);

        addActivity({
          id: Date.now().toString(),
          type: "payment",
          amount,
          target: recipient,
          status: "error",
          timestamp: Date.now(),
        });
      }
    },
    [address, balance, refreshBalance, signTransaction, addActivity],
  );

  const connectionState: WalletConnectionState = isConnected
    ? "connected"
    : isConnecting
      ? "connecting"
      : "disconnected";

  return {
    connectionState,
    walletAddress: address || "",
    isConnected,
    isFreighterInstalled: true,
    balance,
    isBalanceLoading,
    balanceError,
    txStatus,
    txError,
    lastTx,
    activity,
    connectWallet: () => init(), // Fallback if used
    disconnectWallet: disconnect,
    refreshBalance,
    sendPayment,
  };
};
