# GrowBit: Web3 Personal Growth Platform

GrowBit is a groundbreaking application that redefines personal growth through autonomous onchain intelligence. Using Base Sepolia for blockchain functionality and OpenAI for AI-powered task generation, GrowBit empowers users to set personal growth goals in natural language, while an AI agent autonomously generates customized task sequences and tracks their completion—all seamlessly integrated with blockchain technology.

## Features

### ETH Management
- **Wallet Connection**: Seamlessly connect your crypto wallet
- **Balance Viewing**: Check your Base Sepolia ETH balance
- **ETH Transfer**: Send ETH to other addresses on the Base Sepolia network

### Personal Growth Goals
- **Natural Language Goal Setting**: Describe your personal growth goals in your own words
- **Autonomous Task Generation**: AI crafts a tailored sequence of tasks to guide you toward your goal
- **Task Tracking**: Mark tasks as complete and track your progress
- **Blockchain Integration**: All goals and tasks are linked to your wallet address

## Technology Stack

### Frontend
- Next.js with TypeScript
- WalletConnect and Web3Modal for wallet connectivity
- Wagmi for Ethereum interactions
- Styled with JSX styling

### Backend
- Node.js with Express
- Ethers.js for blockchain interactions
- OpenAI API for intelligent task generation
- SQLite database for goals and tasks storage

### Blockchain
- Base Sepolia testnet for ETH transactions

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- A compatible Ethereum wallet (e.g., MetaMask)
- Base Sepolia ETH (available from Base Sepolia faucets)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/growbit.git
cd growbit
```

2. Install backend dependencies
```bash
cd project-root/backend
npm install
```

3. Configure backend environment
Create a `.env` file in the backend directory with:
```
PORT=3001
PROVIDER_URL=https://sepolia.base.org
WALLET_PRIVATE_KEY=your_private_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Configure frontend environment
Create a `.env.local` file in the frontend directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Application

1. Start the backend
```bash
cd project-root/backend
npm start
```

2. In a separate terminal, start the frontend
```bash
cd project-root/frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Navigate between ETH Dashboard and Growth Goals using the tabs
3. On the ETH Dashboard, you can view your balance and transfer ETH
4. On the Growth Goals tab, you can:
   - Set new personal growth goals
   - View AI-generated tasks for each goal
   - Track and update task completion status

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Base Sepolia for providing a reliable testnet
- OpenAI for the AI capabilities
- The Ethereum community for continuous innovation in the Web3 space 