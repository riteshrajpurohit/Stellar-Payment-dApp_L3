"use client";

import { useCallback, useState } from "react";
import { useWalletStore } from "@/lib/wallet/useWallet";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toast";
import type {
  ActivityItem,
  TransactionResult,
  TxStatus,
  WalletConnectionState,
} from "@/types/stellar";
import { validateTransactionInput } from "@/lib/validation/tx-validation";
import { useCachedBalance } from "@/lib/cache/use-cached-balance";
import { loadStellarHelpers } from "@/lib/stellar";

interface SendPaymentInput {
  recipient: string;
  amount: string;
  memo?: string;
}

export const useStellarWallet = () => {
  const {
    address,
    isConnected,
    isConnecting,
    disconnect,
    signTransaction,
    init,
  } = useWalletStore();

  const { balance, isBalanceLoading, balanceError, refreshBalance } = useCachedBalance(address || null);

  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txError, setTxError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<TransactionResult | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const addActivity = useCallback((item: ActivityItem) => {
    setActivity((prev) => [item, ...prev].slice(0, 5));
  }, []);

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

      setTxStatus("pending");
      setTxError(null);
      setLastTx(null);

      try {
        const { buildAndSubmitPayment, hasEnoughSpendableBalance } = await loadStellarHelpers();

        if (balance) {
          if (!hasEnoughSpendableBalance(balance, amount)) {
            throw new Error(
              `Insufficient funds. Your spendable balance is less than ${amount} XLM.`
            );
          }
        }

        notifyInfo(
          "Payment Started",
          "Please review and sign the transaction in your wallet."
        );

        const result = await buildAndSubmitPayment({
          senderPublicKey: address,
          recipientPublicKey: recipient,
          amount,
          memo,
          signWithFreighter: async (xdr: string) => await signTransaction(xdr),
        });

        setLastTx({
          ...result,
          recipient,
          amount,
          memo,
          createdAt: new Date().toISOString(),
        });
        setTxStatus("success");
        notifySuccess(
          "Payment Successful",
          `Sent ${amount} XLM to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`
        );

        addActivity({
          id: result.hash,
          title: "Payment",
          description: `Sent ${amount} XLM to ${recipient}`,
          status: "success",
          timestamp: Date.now(),
          hash: result.hash,
        });

        refreshBalance();
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
          title: "Payment Failed",
          description: `Attempt to send ${amount} XLM failed`,
          status: "error",
          timestamp: Date.now(),
        });
      }
    },
    [address, balance, signTransaction, addActivity, refreshBalance]
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
