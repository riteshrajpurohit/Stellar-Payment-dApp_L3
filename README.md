# Stellar Payment dApp - Level 2

**Live Demo:** [https://stellar-payment-dapp-level2-demo.vercel.app](https://stellar-payment-dapp-level2-demo.vercel.app) _(Placeholder)_

## Project Description

A production-ready Web3 decentralized application (dApp) built on the Stellar network using Next.js. This Level 2 upgrade introduces multi-wallet support, Soroban smart contract integration, and real-time state synchronization on the Stellar Testnet.

## Quick Links

- **Stellar Testnet Explorer:** [Stellar Expert](https://testnet.stellarexpert.com/nordic)
- **Deployed Contract Address:** `CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI`
- **Sample Transaction Hash:** `f3b4695b11a5fe04481067e21a221f725a3d0cb8d488e0af32cd51a61ea72058` _(Track on Stellar Expert)_

## Features (Level 2 Upgrades)

- **Multi-Wallet Integration:** Supports multiple wallets including Freighter and Albedo via `@creit.tech/stellar-wallets-kit`.
- **Smart Contract Integration:** Rust-based Soroban smart contract deployed on Stellar Testnet tracking a live counter.
- **Contract Interactions:** Read and Write contract state (e.g., Increment Counter) directly from the frontend.
- **Transaction Lifecycle Tracking:** Comprehensive real-time status updates (Pending, Signing, Simulating, Success, Failed).
- **Real-Time Data Sync:** Polling mechanisms implemented for instant UI updates reflecting blockchain state.

## Folder Structure

```text
├── contracts/               # Stellar Soroban Smart Contracts
│   └── counter/             # Rust-based counter contract
│       ├── src/lib.rs       # Contract logic
│       └── Cargo.toml       # Rust dependencies
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layout, Globals)
│   ├── components/          # Reusable React Components
│   │   ├── app/             # App-specific blocks (Wallet Modal, Contract Panel, etc.)
│   │   └── ui/              # shadcn/ui base components
│   ├── hooks/               # Custom React Hooks (State, Polling)
│   ├── lib/                 # Core Utilities
│   │   ├── contract/        # Smart contract client & RPC logic
│   │   ├── wallet/          # StellarWalletsKit initialization and hooks
│   │   └── stellar.ts       # Stellar SDK Server setup
│   └── types/               # TypeScript Definitions
├── public/                  # Static assets and screenshots
└── tailwind.config.ts       # Tailwind CSS Configuration
```

## How It Works

1. **Wallet Connection:** Users connect using Freighter or Albedo. The app requests permissions and retrieves the public key via `@creit.tech/stellar-wallets-kit`.
2. **Account Hydration:** Fetches testnet XLM balance using the Stellar Horizon server.
3. **Smart Contract Interactivity:**
   - **Read:** Fetches the current counter value using Soroban RPC (`get` function).
   - **Write:** Prepares, simulates, and submits a transaction to `increment` the counter, then updates the status asynchronously.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- Supported Wallet Browser Extensions (Freighter or Albedo).
- [Soroban CLI](https://soroban.stellar.org/docs/setup/environment) (Only if you intend to recompile/deploy the contract).

### 1. Clone & Install

```bash
git clone https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L2.git
cd Stellar-Payment-dApp_L2
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_CONTRACT_ID=CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dApp.

### 4. Need Testnet Tokens?

Fund your testnet wallet by visiting the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#txbuilder?network=test).

## Screenshots

### 1. Wallet Options Available

_(Placeholder for Wallet Modal screenshot showing Freighter and Albedo)_
![Wallet Options](public/wallet-options.png)

### 2. Wallet Connected & Balance

_(Placeholder for connected dashboard)_
![Wallet Connected](public/wallet-connected.png)

### 3. Smart Contract Interaction

_(Placeholder for Counter Smart Contract Panel)_
![Contract Panel](public/contract-interaction.png)

### 4. Successful Transaction

_(Placeholder for Success Toast/Status with Hash)_
![Transaction Result](public/transaction-result.png)
