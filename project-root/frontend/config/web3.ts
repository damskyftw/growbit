import { createClient, configureChains, Chain } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

// Define Base Sepolia chain
const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Base Sepolia Explorer', 
      url: 'https://sepolia.basescan.org' 
    },
  },
  testnet: true,
};

// Define chains and providers
const { chains, provider } = configureChains(
  [baseSepolia, hardhat], // Include Hardhat chain for local development
  [publicProvider()]
);

// Create wagmi client
export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider,
});

export { chains }; 