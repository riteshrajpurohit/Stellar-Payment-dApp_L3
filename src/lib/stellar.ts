import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import {
  MIN_BASE_FEE_XLM,
  STELLAR_EXPLORER_BASE_URL,
  STELLAR_HORIZON_URL,
  STELLAR_NETWORK_PASSPHRASE,
} from "@/lib/constants";
import { explorerTxLink } from "@/utils/format";

const server = new Horizon.Server(STELLAR_HORIZON_URL);

interface BuildAndSubmitArgs {
  senderPublicKey: string;
  recipientPublicKey: string;
  amount: string;
  memo?: string;
  signWithFreighter: (xdr: string) => Promise<string>;
}

export const fetchXlmBalance = async (publicKey: string): Promise<string> => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find(
      (balance) => balance.asset_type === "native"
    );
    return nativeBalance?.balance ?? "0";
  } catch (err: any) {
    if (err?.response?.status === 404) {
      throw new Error("Account not found on the network. Is it funded?");
    }
    throw new Error("Failed connecting to Stellar network.");
  }
};

export const hasEnoughSpendableBalance = (
  balance: string,
  amount: string
): boolean => {
  const spendable = Number(balance);
  const requested = Number(amount);

  if (Number.isNaN(spendable) || Number.isNaN(requested)) {
    return false;
  }

  return spendable > requested + MIN_BASE_FEE_XLM;
};

export const buildAndSubmitPayment = async ({
  senderPublicKey,
  recipientPublicKey,
  amount,
  memo,
  signWithFreighter,
}: BuildAndSubmitArgs) => {
  let senderAccount;
  try {
    senderAccount = await server.loadAccount(senderPublicKey);
  } catch (err) {
    throw new Error("Failed to load your account. Ensure it is funded.");
  }

  let txBuilder = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET, // Always TESTNET for this tutorial
  }).addOperation(
    Operation.payment({
      destination: recipientPublicKey,
      asset: Asset.native(),
      amount,
    })
  );

  if (memo?.trim()) {
    txBuilder = txBuilder.addMemo(Memo.text(memo.trim()));
  }

  const unsignedTx = txBuilder.setTimeout(180).build();
  
  let signedXdr;
  try {
    signedXdr = await signWithFreighter(unsignedTx.toXDR());
  } catch (err) {
    throw new Error("Transaction signature was rejected or failed.");
  }

  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    STELLAR_NETWORK_PASSPHRASE
  );

  try {
    const response = await server.submitTransaction(signedTransaction);

    return {
      hash: response.hash,
      ledger: response.ledger,
      successful: response.successful,
      explorerUrl: explorerTxLink(STELLAR_EXPLORER_BASE_URL, response.hash),
    };
  } catch (err: any) {
    // Parse Horizon error
    const resultCodes = err?.response?.data?.extras?.result_codes;
    if (resultCodes) {
      if (resultCodes.transaction === "tx_failed" && resultCodes.operations?.includes("op_no_destination")) {
        throw new Error("Recipient account does not exist or lacks trustlines.");
      }
      if (resultCodes.transaction === "tx_bad_seq") {
        throw new Error("Transaction sequence out of sync. Please try again.");
      }
    }
    throw new Error("Network rejected the transaction.");
  }
};

export const loadStellarHelpers = async () => ({
  fetchXlmBalance,
  hasEnoughSpendableBalance,
  buildAndSubmitPayment
});
