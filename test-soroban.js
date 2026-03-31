const { rpc, Contract, TransactionBuilder, Account, Networks, Keypair } = require("@stellar/stellar-sdk");
const server = new rpc.Server("https://soroban-testnet.stellar.org");
const contractId = process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID || "CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI";
async function run() {
  const dummy = Keypair.random();
  console.log("using account", dummy.publicKey());
  const account = await server.getAccount(dummy.publicKey()).catch(() => new Account(dummy.publicKey(), "1"));
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call("get_counter"))
    .setTimeout(30)
    .build();
    
  console.log("simulating...");
  const sim = await server.simulateTransaction(tx);
  console.log(sim);
  
}
run().catch(console.error);
