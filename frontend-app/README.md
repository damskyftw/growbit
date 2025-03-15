# GrowBit 🌱 - Achieve Your Growth Goals

GrowBit is a Web3 personal growth platform that helps users set and achieve personal growth goals while earning ETH rewards. The application uses AI to generate tasks for each goal and allows users to track their progress.

## Features

- **Connect Your Wallet**: Multiple wallet connection options including smart wallet support via Coinbase Wallet.
- **Set Growth Goals**: Create personal growth goals and get AI-generated tasks to achieve them.
- **Track Progress**: Mark tasks as completed and view your progress over time.
- **Earn ETH Rewards**: Complete tasks and earn ETH rewards (on Base Sepolia testnet).
- **Transfer ETH**: Send ETH to other addresses directly from the application.
- **Smart Wallet Support**: Gas-free reward claims when using Coinbase Wallet's smart wallet features on Base Sepolia.

## Tech Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Wagmi for wallet connection
- React Hooks for state management

### Backend
- Node.js with Express
- SQLite database for data storage
- OpenAI API for task generation
- Ethers.js for blockchain interactions

### Blockchain
- Base Sepolia testnet
- Account Abstraction (ERC-4337) support via Coinbase Wallet
- Smart wallet features with gas sponsorship for rewards

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MetaMask, Coinbase Wallet, or another Web3 wallet

### Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/growbit.git
cd growbit
```

2. Start the backend server:
```bash
cd project-root/backend
npm install
npm start
```

3. Start the frontend application:
```bash
cd ../frontend-app
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Environment Configuration

### Backend (.env)
```
PROVIDER_URL=https://sepolia.base.org
WALLET_PRIVATE_KEY=your_wallet_private_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usage

1. Connect your wallet using the "Connect Wallet" button.
   - For gas-free reward claims, use Coinbase Wallet with smart wallet features.
   - For a standard experience, use MetaMask, Rabby Wallet, or other EOA wallets.
2. View your ETH balance in the Wallet section.
3. Create a new growth goal using the "New Goal" form.
4. AI will automatically generate tasks to help you achieve your goal.
5. Track and update the status of tasks in the Goals section.
6. Transfer ETH using the Transfer section if needed.

## Smart Wallet Features

GrowBit leverages Base Sepolia's integration with Coinbase Wallet to provide smart wallet capabilities:

- **Gas-Free Reward Claims**: When using Coinbase Wallet, reward claims are gas-free through paymaster sponsorship.
- **Enhanced Security**: Better security through account abstraction.
- **Simple UX**: No approvals needed for common operations.

These features are automatically available when connecting with Coinbase Wallet, but the application remains fully compatible with standard EOA wallets like MetaMask and Rabby Wallet.

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for the API used to generate tasks
- Base Sepolia for providing a testnet for ETH transactions
- Coinbase for smart wallet capabilities
- Wagmi for the wallet connection library 