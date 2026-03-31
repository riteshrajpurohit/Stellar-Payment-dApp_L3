const { rpc, Contract, TransactionBuilder, Account, Networks, Keypair } = require("@stellar/stellar-sdk");
const server = new rpc.Server("https://soroban-testnet.stellar.org");
const contractId = "CB7QYQLFCNN2LRBW3MRA3IWA7R6YNDATEN3S7T64KXZO5GL7XTFWLEUZ";
async function run() {
  const account = new Account(Keypair.random().publicKey(), "1");
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call("get_counter"))
    .setTimeout(30)
    .build();
    
  console.log("simulating...");
  await server.simulateTransaction(tx);
  console.log("simulated");
}
run().catch(e => console.log(e.message));
