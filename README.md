# Stellar Payment dApp L3

A production-style Stellar Testnet dashboard built with Next.js, Soroban RPC, SWR, and a small Soroban counter contract. The app supports wallet connection, XLM transfers, live balance polling, and contract state refresh from a single command-center UI.

## Submission Artifacts

- Live demo: https://stellar-payment-d-app-l3.vercel.app/
- Demo video: https://drive.google.com/file/d/1pG4URfGs_B-4LG5flvT3YM8fGCLlKa3m/view?usp=sharing
- GitHub repository: https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L3
- Contract deployment address: `CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI`
- Transaction hash for contract interaction: not present in the repository yet; add the verified hash here before final submission

## Features

- Multi-wallet connection flow for Stellar wallets via `@creit.tech/stellar-wallets-kit`
- Send XLM payments on Stellar Testnet
- Validate recipient, amount, and memo input before submission
- Fetch live XLM balances with SWR caching and auto-refresh
- Read and increment a Soroban counter contract
- Transaction status cards with explorer links
- Session activity timeline for recent wallet actions
- Responsive dark UI with glass-style panels

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Stellar SDK and Soroban RPC
- SWR for data fetching and cache refresh
- Zustand for wallet state
- Tailwind CSS for styling
- Sonner for toast notifications
- Vitest and Testing Library for tests

## Project Structure

```text
src/
  app/                 Next.js app router entry points
  components/          UI components and app-specific panels
  hooks/               Client hooks for wallet and transaction flows
  lib/                 Stellar helpers, validation, cache, and state
  types/               Shared TypeScript models
  utils/               Generic formatting and validation helpers
contracts/
  counter/             Soroban counter contract source

tests/                 Vitest unit and component tests
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_EXPLORER_BASE_URL=https://stellar.expert/explorer/testnet/tx
NEXT_PUBLIC_COUNTER_CONTRACT_ID=CDAHSUXZYB2B7G33I4WYZTYZ6OEZ7XW74T236A7NDHGF6S4MB2F64NUI
```

A matching template is available in `.env.example`.

## Local Setup

```bash
git clone https://github.com/riteshrajpurohit/Stellar-Payment-dApp_L3.git
cd Stellar-Payment-dApp_L3
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in a wallet-enabled browser with a Stellar Testnet wallet extension installed.

## Build and Test

```bash
npm test
npm run build
```

The repository currently includes 16 passing tests across validation, utility, and component coverage.

## CI

A GitHub Actions workflow is included at `.github/workflows/ci.yml`. It installs dependencies, runs the test suite, and builds the app on each push and pull request.

## Soroban Contract

The contract source lives in `contracts/counter/src/lib.rs`. It exposes two methods:

- `get_counter`
- `increment_counter`

The app reads the counter with Soroban RPC and submits increment transactions through the connected wallet.

## Screenshots

Test output:

<img width="1470" height="956" alt="Vitest output showing 16 passing tests" src="https://github.com/user-attachments/assets/86fd7412-3858-4e08-848b-22b802d666be" />

Dashboard states:

<img width="1470" height="956" alt="Dashboard landing screen" src="https://github.com/user-attachments/assets/a099447d-9701-4aab-8c8a-cc628a11b3ec" />

<img width="1470" height="956" alt="Wallet connected screen" src="https://github.com/user-attachments/assets/c90fe6dd-1ef4-40ca-9d8e-8ce80ea6c56f" />

<img width="1470" height="956" alt="Transaction pending and verified states" src="https://github.com/user-attachments/assets/33a17d50-bd2a-4e0d-aa8d-0950f298d6a2" />

<img width="1470" height="956" alt="Transaction success confirmation" src="https://github.com/user-attachments/assets/7c5e0bfa-f67f-49f3-bb65-1e1b5de50f9b" />

## Notes for Submission

- The repository already contains a live demo URL, demo video link, and deployment address.
- The verified contract-interaction transaction hash still needs to be added before final submission if you want the README to satisfy the checklist verbatim.
- The project currently has 18 Git commits, which satisfies the minimum commit requirement.

## Screenshots

The repository README can include screenshots for:

- Mobile responsive UI
- CI/CD pipeline running
- Test output with 3+ passing tests
- Contract interaction evidence

Add or refresh those images as needed before publishing the final submission.
