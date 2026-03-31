const { rpc, TransactionBuilder, Account, Networks, Keypair } = require("@stellar/stellar-sdk");
const server = new rpc.Server("https://soroban-testnet.stellar.org");
async function run() {
  const account = new Account(Keypair.random().publicKey(), "1");
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .setTimeout(30)
    .build();
    
  console.log("sending...");
  await server.sendTransaction(tx);
  console.log("sent");
}
run().catch(e => console.log(e.message));
