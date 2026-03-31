const { rpc, Keypair } = require("@stellar/stellar-sdk");
const server = new rpc.Server("https://soroban-testnet.stellar.org");
async function run() {
  await server.getAccount(Keypair.random().publicKey());
}
run().catch(e => console.log(e.message));
