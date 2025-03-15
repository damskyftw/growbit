# GrowBit

GrowBit is an agent-powered goal achievement system that turns personal growth into rewarding blockchain experiences. Built for the ETHSF hackathon 2025.

## About

GrowBit combines AI and blockchain technology to create a powerful motivation system where:
- Users set meaningful personal growth goals in natural language
- AI autonomously generates customized task sequences
- Users can stake ETH on their goals for stronger commitment
- Blockchain integration provides transparent accountability and financial motivation
- Task completion is verified and rewarded with crypto incentives

## Key Features

- Natural language goal setting
- AI-powered task generation
- Optional ETH staking on goals
- Task verification system
- Crypto micro-rewards for achievements
- Growth Dashboard with streaks, stats and badges
- Cancel option for non-staked goals

## Technology Stack

- **Frontend**: React, Next.js, Tailwind CSS, Wagmi hooks
- **Backend**: Express.js, Node.js, OpenAI, SQLite
- **Blockchain**: Solidity, Hardhat, Ethers.js, Base Sepolia testnet
- **Integration**: Coinbase Wallet SDK for gas-free transactions

## Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Access to Base Sepolia testnet

### Setup

1. Clone the repository:
```
git clone https://github.com/damskyftw/growbit.git
cd growbit
```

2. Install backend dependencies:
```
cd project-root/backend
npm install
```

3. Install frontend dependencies:
```
cd ../../frontend-app
npm install
```

4. Set up environment variables:
   - Copy the example.env file to create your own .env files:
     ```
     # For backend
     cp example.env project-root/backend/.env
     
     # For frontend
     cp example.env frontend-app/.env.local
     ```
   
   - Edit the .env files with your actual values:
     - You'll need an OpenAI API key for AI features
     - You'll need a wallet private key for blockchain interactions (use a testnet wallet!)
     - Contract addresses will be provided after deployment or you can deploy your own

### Security Considerations

- **NEVER COMMIT** your .env files to the repository
- Use a dedicated testnet wallet with minimal funds for development
- Keep your API keys and private keys secure
- The .gitignore file is set up to prevent accidental commits of sensitive files

### Running the Application

1. Start the backend:
```
cd project-root/backend
npm start
```

2. In a new terminal, start the frontend:
```
cd frontend-app
npm run dev
```

3. Access the application at `http://localhost:3000`

## License

MIT

