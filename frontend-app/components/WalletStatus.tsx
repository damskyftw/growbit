import { useAccount, useDisconnect } from 'wagmi';

const WalletStatus = () => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null;
  }

  // Determine if the connected wallet supports smart wallet features
  const isSmartWallet = connector?.id === 'coinbaseWallet';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <div>
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
              ? "Using Coinbase's smart wallet. Enjoy gas-free reward claims!" 
              : "Using a standard wallet. Gas fees apply for transactions."}
          </p>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default WalletStatus; 