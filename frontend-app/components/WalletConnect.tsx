import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

const WalletConnect = () => {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // This resolves hydration issues with Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine if the connected wallet supports smart wallet features
  const isSmartWallet = connector?.id === 'coinbaseWallet';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {isConnected ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Connected Wallet</p>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            {isSmartWallet && (
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Smart Wallet
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {isSmartWallet 
              ? "Using Coinbase's smart wallet on Base Sepolia. Enjoy gas-free reward claims!" 
              : "Using a standard EOA wallet. Gas fees will apply for transactions."}
          </p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Connect Wallet</p>
            <p className="text-xs text-gray-500 mt-1 mb-2">
              Choose Coinbase Wallet for smart wallet features including gas-free reward claims.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connect({ connector })}
                disabled={!connector.ready}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                  ${connector.id === 'coinbaseWallet' 
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
                `}
              >
                {connector.name}
                {connector.id === 'coinbaseWallet' && (
                  <span className="ml-1 text-xs">(Smart Wallet)</span>
                )}
                {isLoading && pendingConnector?.id === connector.id && ' (connecting...)'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 