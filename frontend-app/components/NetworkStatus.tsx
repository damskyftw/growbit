import { useState, useEffect } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const NetworkStatus = () => {
  const { chain } = useNetwork();
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork();
  const [showDetails, setShowDetails] = useState(false);

  // Base Sepolia chain ID
  const targetChainId = 84532;
  const isCorrectNetwork = chain?.id === targetChainId;

  if (!chain) return null;

  const getNetworkColor = () => {
    if (isCorrectNetwork) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className={`rounded-lg border p-3 my-2 ${getNetworkColor()}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="font-medium">
            {isCorrectNetwork 
              ? 'Connected to Base Sepolia' 
              : `Connected to ${chain.name || 'Unknown Network'}`}
          </span>
        </div>
        <button 
          className="text-xs underline focus:outline-none"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-2 pt-2 border-t border-opacity-20 border-current">
          <div className="text-xs space-y-1">
            <p>
              <span className="font-medium">Current Network:</span> {chain.name} (ID: {chain.id})
            </p>
            <p>
              <span className="font-medium">Required Network:</span> Base Sepolia (ID: {targetChainId})
            </p>
            
            {!isCorrectNetwork && switchNetwork && (
              <button
                onClick={() => switchNetwork(targetChainId)}
                disabled={isLoading && pendingChainId === targetChainId}
                className="mt-2 px-3 py-1 bg-white bg-opacity-30 hover:bg-opacity-40 rounded text-xs font-medium"
              >
                {isLoading && pendingChainId === targetChainId 
                  ? 'Switching...' 
                  : 'Switch to Base Sepolia'}
              </button>
            )}
            
            {!isCorrectNetwork && !switchNetwork && (
              <p className="mt-1 italic">
                Your wallet doesn't support automatic network switching. Please manually switch to Base Sepolia in your wallet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus; 