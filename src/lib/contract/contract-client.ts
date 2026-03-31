import {
  rpc,
  Contract,
  xdr,
  scValToNative,
  TransactionBuilder,
  Account,
  Networks,
} from "@stellar/stellar-sdk";
import { kit } from "@/lib/wallet/wallet-kit";
import { STELLAR_NETWORK_PASSPHRASE } from "@/lib/constants";

const SERVER_URL = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(SERVER_URL);
const CONTRACT_ID = process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID || "";

// Base builder function
async function buildTx(
  sourceAddress: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = [],
) {
  const account = await server
    .getAccount(sourceAddress)
    .catch(() => new Account(sourceAddress, "1"));

  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  return prepared;
}

export const getCounter = async (sourceAddress: string): Promise<number> => {
  if (!CONTRACT_ID) return 0;

  try {
    const tx = await buildTx(sourceAddress, CONTRACT_ID, "get_counter");
    const simulation = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationSuccess(simulation)) {
      if (simulation.result?.retval) {
        return scValToNative(simulation.result.retval);
      }
    }
    return 0;
  } catch (error) {
    console.error("Read contract error", error);
    return 0;
  }
};

export const incrementCounter = async (
  sourceAddress: string,
  signTransaction: (xdr: string) => Promise<string>,
): Promise<string> => {
  if (!CONTRACT_ID) throw new Error("Contract ID not configured in .env.local");

  const tx = await buildTx(sourceAddress, CONTRACT_ID, "increment_counter");

  // Requires user signature
  const signedXdr = await signTransaction(tx.toXDR());

  // Submit
  const sendResp = await server.submitTransaction(
    TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK_PASSPHRASE) as any,
  );
  if (sendResp.status === "ERROR") {
    throw new Error("RPC send error");
  }

  // Poll for status
  let txResp = await server.getTransaction(sendResp.hash);
  let retries = 0;
  while (txResp.status === "NOT_FOUND" && retries < 15) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    txResp = await server.getTransaction(sendResp.hash);
    retries++;
  }

  if (txResp.status === "SUCCESS") {
    return sendResp.hash;
  } else {
    throw new Error("Transaction failed on-chain");
  }
};
