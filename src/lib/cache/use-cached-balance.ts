import useSWR from "swr";
import { fetchXlmBalance } from "@/lib/stellar";

export function useCachedBalance(publicKey: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    publicKey ? ["balance", publicKey] : null,
    ([, pubKey]: [string, string]) => fetchXlmBalance(pubKey),
    {
      refreshInterval: 15000, // auto refresh every 15s
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Prevent multiple rapid calls
      errorRetryCount: 3,
    }
  );

  return {
    balance: data ?? null,
    isBalanceLoading: isLoading,
    balanceError: error ? (error instanceof Error ? error.message : "Failed to load balance") : null,
    refreshBalance: () => mutate(),
  };
}
