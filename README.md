# Stellar Web3 Command Center (Level 3 dApp)

A high-fidelity, production-ready decentralized application built on the Stellar network. This project elevates the traditional web3 development experience by introducing robust Soroban smart contract integration, multi-wallet connectivity, advanced caching layers (SWR), and a meticulously polished dark-mode dashboard interface.

---

## 🚀 Live Links & Submission Deliverables

- **Live Demo Link:** https://stellar-payment-d-app-l3.vercel.app/
- **1-Minute Demo Video:** https://drive.google.com/file/d/1pG4URfGs_B-4LG5flvT3YM8fGCLlKa3m/view?usp=sharing
- **GitHub Repository:** [https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L3](https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L3)

## ✅ Submission Checklist Highlights

- [x] **Mini-dApp fully functional:** End-to-end send/receive, contract invocation, and lifecycle states working flawlessly.
- [x] **Minimum 3 tests passing:** 16 robust Component and Unit tests passing seamlessly via Vitest. 
- [x] **README complete:** This exhaustive documentation file containing setups, architecture, and demo flows.
- [x] **Minimum 3+ meaningful commits:** A clean, legible GitHub commit history reflecting the iterative upgrade to Level 3.
- [x] **Visual Evidence:** Tests outputs and Demo video attached.

---

## 📸 Test Output (16 Tests Passing)

<img width="1470" height="956" alt="Screenshot 2026-04-01 at 12 08 29 AM" src="https://github.com/user-attachments/assets/86fd7412-3858-4e08-848b-22b802d666be" />

---

## 🖼️ Project Gallery / Screenshots

**1. Dashboard Landing (Unconnected)**

<img width="1470" height="956" alt="Screenshot 2026-04-01 at 1 05 19 AM" src="https://github.com/user-attachments/assets/a099447d-9701-4aab-8c8a-cc628a11b3ec" />


**2. Wallet Connected & Live Sync**

<img width="1470" height="956" alt="Screenshot 2026-04-01 at 1 05 33 AM" src="https://github.com/user-attachments/assets/c90fe6dd-1ef4-40ca-9d8e-8ce80ea6c56f" />

**3. Smart Contract Interaction**
![Contract Interaction Loading](#)

**4. Send Transaction (Pending & Verified)**

<img width="1470" height="956" alt="Screenshot 2026-04-01 at 1 07 08 AM" src="https://github.com/user-attachments/assets/33a17d50-bd2a-4e0d-aa8d-0950f298d6a2" />

<img width="1470" height="956" alt="Screenshot 2026-04-01 at 1 08 19 AM" src="https://github.com/user-attachments/assets/7c5e0bfa-f67f-49f3-bb65-1e1b5de50f9b" />

---

## 🏗️ Project Architecture & File Structure

This repository follows a clean, highly modular React architecture optimized for separation of concerns between UI layers, Blockchain logic, and State caching.

```text
📦 stellar-payment-dapp
 ┣ 📂 src
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📜 globals.css       # Core Tailwind & Glassmorphism design tokens
 ┃ ┃ ┣ 📜 layout.tsx        # Next.js Root Layout wrapper
 ┃ ┃ ┗ 📜 page.tsx          # Main Dashboard entry point
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 app               # Business-Specific UI (WalletPanel, TransactionForm, etc.)
 ┃ ┃ ┗ 📂 ui                # Reusable Generic UI (Skeleton, Spinner, Dialog)
 ┃ ┣ 📂 hooks
 ┃ ┃ ┗ 📜 use-stellar-wallet.ts # Primary custom hook aggregating network & logic states
 ┃ ┣ 📂 lib
 ┃ ┃ ┣ 📂 cache             # SWR caching implementations (useCachedBalance, useCachedContract)
 ┃ ┃ ┣ 📂 contract          # Soroban RPC client initialization module
 ┃ ┃ ┣ 📂 validation        # Pure deterministic transaction validation functions
 ┃ ┃ ┗ 📂 wallet            # Zustand global state (useWalletStore)
 ┃ ┣ 📂 types               # Global TypeScript definitions (ActivityItem, TransactionResult)
 ┃ ┗ 📂 utils               # Utility helpers (address shorteners, formatters)
 ┣ 📂 tests                 # Vitest testing suite (Component & Logic Tests)
 ┣ 📜 vitest.config.ts      # Testing configurations linking to JS-DOM
 ┗ 📜 package.json
```

---

## 🧠 Tech Stack Deep Dive

### 1. Frontend Core (Next.js 14 & React 18)
Built entirely on **Next.js App Router** for optimal performance. The architecture utilizes `"use client"` directives heavily as this is primarily a client-side Web3 SPA relying on wallet browser extensions.

### 2. State Management (Zustand)
Used `@/lib/wallet/useWallet.ts` as a minimal, lightweight global store controlling the `WalletConnection` lifecycle. It securely holds the connected user's public address without trapping it inside local component lifecycles, enabling Multi-Wallet connectivity via `@creit.tech/stellar-wallets-kit`.

### 3. Remote Data Caching (SWR)
To prevent network spam and RPC rate-limiting on the Stellar Testnet, data fetching is abstracted into `swr` layers. 
- Example: the user's XLM `balance` and the `Soroban Counter state` refresh intelligently based on focus and intervals, bypassing manual reload requirements.

### 4. Smart Contract Integration (Soroban RPC)
Direct read/write access to the Stellar Testnet via `@stellar/stellar-sdk`. 
Smart contracts use the underlying RPC node `https://soroban-testnet.stellar.org` to asynchronously increment and retrieve on-chain state blocks.

### 5. Deterministic Testing (Vitest & React Testing Library)
A rigorous `.test.ts` suite mapped via `environment: "jsdom"`. It explicitly verifies input sanitizations, fee calculations, and correctly catches React component mount states based on transaction results.

---

## 🎨 UI / UX Aesthetics

This project deliberately avoids generic UI themes, instead leveraging a tailored **"Command Center"** experience optimized for high-end web3 users.

- **Glassmorphism Design:** Utilizes `backdrop-blur-xl`, semi-transparent whites (`bg-white/5`), and thin contrast borders (`border-white/10`) to create floating UI panels above the dark gradient.
- **Aurora Color Spaces:** Highlights and indicators rely on deep OKLCH-based colors (Cyan, Emerald, Fuchsia) mapped via `lucide-react` icons.
- **Micro-Interactions:** 
  - Buttons transition smoothly on hover.
  - Form validation is completely reactive.
  - Pending transactions render custom `Spinner` SVG components preventing UI blocking.
  - Pre-fetch rendering dynamically pulls geometric bounds using animated `Skeleton` frames to prevent jarring DOM layout shifts.

---

## 💻 Local Setup & Development Guide

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- A Stellar Wallet Extension like [Freighter](https://www.freighter.app/) installed in the Browser.

### 2. General Installation
```bash
git clone https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L3.git
cd Stellar-Payment-dApp_L3
npm install
```

### 3. Environment Variables
Create a root `.env.local` to safely bind network interactions:
```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_COUNTER_CONTRACT_ID=CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI
```

### 4. Booting the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your wallet-enabled browser.

---

## 🧪 Testing Coverage

The deployment ships with stringent coverage protecting form validations, mathematical thresholds (`base fees`), and component render structures. All logic runs completely isolated.

**Execute the test suite locally:**
```bash
npm run test
```

**Execute in watch mode:**
```bash
npm run test:watch
```
