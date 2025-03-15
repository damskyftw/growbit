# GrowBit ETH Dashboard Project Structure

This document outlines the structure of our GrowBit ETH Dashboard application, which includes a Next.js frontend and Node.js backend for interacting with the Base Sepolia testnet.

## Project Root Directory

```
project-root/
├── frontend/               # Next.js frontend application
└── backend/                # Node.js Express backend
```

## Frontend Structure

```
frontend/
├── components/             # React components
│   ├── WalletConnect.tsx   # Wallet connection component
│   ├── TokenBalance.tsx    # ETH balance display component
│   └── TransferToken.tsx   # ETH transfer form component
├── config/                 # Configuration files
│   └── web3.ts             # Wagmi & Web3 configuration
├── types/                  # TypeScript type definitions
│   └── global.d.ts         # Global type definitions
├── pages/                  # Next.js pages
│   ├── _app.tsx            # Main application wrapper
│   └── index.tsx           # Homepage
├── public/                 # Static assets
├── styles/                 # CSS styles
│   └── globals.css         # Global styles
├── .env.local              # Environment variables (not in git)
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Backend Structure

```
backend/
├── index.js                # Main Express server with ETH transfer and balance endpoints
├── .env                    # Environment variables (not in git)
└── package.json            # Dependencies and scripts
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_NETWORK_NAME=Base Sepolia
```

### Backend (.env)
```
PORT=3001
PROVIDER_URL=https://sepolia.base.org
WALLET_PRIVATE_KEY=your_private_key_here
```

## Technologies Used

- **Frontend**: Next.js, React, wagmi.sh, ethers.js
- **Backend**: Node.js, Express, ethers.js
- **Network**: Base Sepolia Testnet

## Running the Application

1. Start the backend server:
```
cd backend && npm start
```

2. Start the frontend development server:
```
cd frontend && npm run dev
```

## API Endpoints

### Backend API

- `GET /api/health` - Check API status
- `GET /api/wallet/balance` - Get the balance of the backend wallet
- `GET /api/balance/:address` - Get the ETH balance of any address
- `POST /api/transfer` - Transfer ETH from the backend wallet to a specified address
   - Request body: `{ "to": "0x...", "amount": "0.01" }` 