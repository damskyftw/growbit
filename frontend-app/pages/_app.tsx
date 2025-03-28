import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from 'wagmi';

// Define Base Sepolia testnet
const baseSepolia: Chain = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'] },
    default: { http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

// Configure chains & providers with better fallback options
const { chains, provider, webSocketProvider } = configureChains(
  [baseSepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === baseSepolia.id) {
          // Use environment variable or fallback
          return { http: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org' };
        }
        return null;
      },
      priority: 0, // Higher priority
    }),
    publicProvider(),
  ],
  { pollingInterval: 8000 } // Increase polling interval to reduce load
);

// Log connection status when client is created
console.log('Creating wagmi client with chains:', chains);

// Create wagmi client with improved options
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'GrowBit',
        headlessMode: false,
        reloadOnDisconnect: false,
      },
    }),
    // Additional connector for any injected wallet like Rabby
    new InjectedConnector({ 
      chains,
      options: {
        name: 'Any Wallet',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
  logger: {
    warn: (message) => console.warn('Wagmi warning:', message),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
    
    // Simulate app initialization loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Increased from 600ms to give more time for client setup
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-800">Loading GrowBit</h2>
            <p className="text-gray-500 mt-1">Your growth journey awaits...</p>
          </div>
        </div>
      ) : (
        <WagmiConfig client={client}>
          <Component {...pageProps} />
        </WagmiConfig>
      )}
    </>
  );
}

export default MyApp; 