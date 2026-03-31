import useSWR from "swr";
import { getCounter } from "@/lib/contract/contract-client";

export function useCachedContract(sourceAddress: string | null) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["contract", "counter"],
    () => getCounter(sourceAddress || ""), // Source address can be empty for simple reads if the contract allows, but Soroban API usually needs something. We will pass empty or whatever we have.
    {
      refreshInterval: 15000, // auto refresh every 15s
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    counterValue: data ?? null,
    isContractLoading: isLoading,
    isContractValidating: isValidating,
    contractError: error ? (error instanceof Error ? error.message : "Failed to read contract") : null,
    refreshContract: () => mutate(),
  };
}
