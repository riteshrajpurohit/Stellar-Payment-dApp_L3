# Stellar Web3 Command Center (Level 3 dApp)

A high-fidelity, production-ready decentralized application built on the Stellar network. This project features multi-wallet connectivity, robust Soroban smart contract integration, a native XLM payments UI, caching mechanisms via SWR, rigorous automated testing, and a premium "glassmorphism" dark-mode aesthetic.

## Features

- **Premium UI/UX:** A true "Command Center" dashboard leveraging deep dark-mode aesthetics, responsive glass cards, gradient borders, and micro-interactions.
- **Robust Wallet Support:** Built-in connection lifecycle for Freighter and Albedo via `@creit.tech/stellar-wallets-kit`.
- **Intelligent Caching:** Lightweight reads! Balances and smart-contract state are cached and automatically revalidated via `SWR`, reducing unnecessary network spam while presenting clean "live sync" states.
- **Soroban Interactions:** Read and Write capabilities to a live Soroban counter contract on the Stellar Testnet. 
- **Polished Transaction States:** Every async user action generates deterministic loading states (skeletons and spinners), with graceful RPC error parsing returned as friendly Toast notifications.

---

## Tech Stack

- **Framework:** Next.js 14 App Router
- **State Management & Caching:** Zustand (Wallet Store) + SWR (React Hooks for Remote Data Fetching)
- **Styling:** Tailwind CSS + custom glassmorphism, Lucide Icons, shadcn UI patterns.
- **Blockchain Connectivity:** `@stellar/stellar-sdk`, `@creit.tech/stellar-wallets-kit`
- **Testing:** `Vitest` & `React Testing Library`

---

## Smart Contract Details
**Network:** TESTNET  
**RPC Server:** `https://soroban-testnet.stellar.org`  
**Explorer Reference:** `https://testnet.stellarexpert.com/nordic`

---

## Local Setup & Development

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- A Stellar Wallet Extension like [Freighter](https://www.freighter.app/)

### 2. Installation
```bash
git clone <your-repo-link>
cd stellar-payment-dapp-l3
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root folder (or use constants if configured inline):
```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_COUNTER_CONTRACT_ID=CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI
```

### 4. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Testing

This product ships with comprehensive unit and component tests ensuring form validations and core blockchain helper utilities map correctly.

**Run tests suite:**
```bash
npm run test
```
**Run in watch mode:**
```bash
npm run test:watch
```

---

## Demo Video Script Outline

*Preparing a demo structure? Follow this flow for a solid 1-minute video:*
1. **Intro [0:00-0:05]:** Show the landing page, hover over the glass cards. Emphasize the sleek layout. 
2. **Connect Wallet [0:05-0:15]:** Click "Connect Wallet", select Freighter. Show how the UI instantly unlocks, skeletons pulse, and "Syncing..." badges slide in, followed by the XLM balance rendering.
3. **Contract Interaction [0:15-0:30]:** Show the "Soroban Contract" panel. Click "Increment". Approve in Freighter. Watch the Spinner state. Once complete, show the success Toast and the auto-refreshing counter value.
4. **Peer Transfer [0:30-0:45]:** Scroll to the Transaction Form. Emphasize validation (add a bad string to show error, then fix it). Send 1 XLM. Show the "Pending" timeline progress onto the successful receipt.
5. **Testing & Outro [0:45-1:00]:** Quick cut to terminal running `npm run test` showcasing all green tests. Conclude demo.

---

## Architecture Overview

- **`src/app/`**: Core Next.js routing and global CSS themes defining the dark/aurora look.
- **`src/components/app/`**: Complex business UI elements (WalletPanel, ContractPanel).
- **`src/components/ui/`**: Reusable generic blocks (Spinner, Skeletons).
- **`src/lib/cache/`**: Modular SWR configurations managing read-heavy blockchain data layers.
- **`src/lib/validation/`**: Pure functions preventing bad transaction requests.
- **`tests/`**: Vitest/JSDom configured tests for utilities and discrete components.
