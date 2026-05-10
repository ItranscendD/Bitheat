# Bitheat Monorepo

Bitheat is an open-source, blockchain-powered health ledger for displaced populations in Nigeria. It creates portable, immutable health records for children that survive flooding, device loss, and server outages.

## Project Structure

- `mobile/`: Expo React Native app (CHW + Guardian)
- `admin/`: Next.js 14 admin dashboard
- `contracts/`: Solidity contracts (Hardhat + Celo)
- `shared/`: Shared TypeScript types and constants

## Tech Stack

- **Mobile**: Expo, React Native, Expo Router, Zustand, SQLite, Viem
- **Admin**: Next.js 14, Tailwind CSS, TanStack Query
- **Blockchain**: Celo L2, Solidity, Hardhat
- **Storage**: SQLite (offline), IPFS (Helia)
- **Identity**: DID (did:key)

## Setup Instructions

1. **Prerequisites**:
   - Node.js 20+
   - pnpm 9+

2. **Installation**:
   ```bash
   pnpm install
   ```

3. **Development**:
   - Start Mobile: `pnpm dev:mobile`
   - Start Admin: `pnpm dev:admin`
   - Compile Contracts: `pnpm build:contracts`

4. **Testing**:
   - Run all tests: `pnpm test:all`

## Design Tokens

- Primary Emerald: `#0CCE8B`
- Blockchain Indigo: `#6D28D9`
- Dark BG: `#0D1117`
- Surface: `#161B22`

## Field Mode Requirements

- Minimum touch target: 48px
- Zero connectivity operation for P0 flows
- High contrast (7:1 target)
