import { useAccount, useConnect } from 'wagmi';
import { useState, useEffect } from 'react';

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector, error: connectError } = useConnect();
  const [connectStatus, setConnectStatus] = useState<string | null>(null);

  // Add logging for debugging connector status
  useEffect(() => {
    if (connectors.length === 0) {
      console.log('No connectors available. Wallet providers may not be accessible.');
    } else {
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));
    }
  }, [connectors]);

  // Track connection error
  useEffect(() => {
    if (connectError) {
      console.error('Connection error:', connectError);
      setConnectStatus(`Connection failed: ${connectError.message}`);
      
      // Clear error message after 5 seconds
      const timer = setTimeout(() => {
        setConnectStatus(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [connectError]);

  if (isConnected) {
    return null;
  }

  const handleConnect = (connector: any) => {
    try {
      setConnectStatus(`Connecting to ${connector.name}...`);
      connect({ connector });
    } catch (err: any) {
      console.error('Error initiating connection:', err);
      setConnectStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Connect Wallet</p>
        
        {connectStatus && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
            {connectStatus}
          </div>
        )}
        
        {connectError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
            Connection error: {connectError.message}
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready || isLoading}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                ${!connector.ready ? 'bg-gray-400' : 
                  connector.id === 'coinbaseWallet' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {connector.name}
              {connector.id === 'coinbaseWallet' && (
                <span className="ml-1 text-xs">(Smart Wallet)</span>
              )}
              {!connector.ready && ' (not available)'}
              {isLoading && pendingConnector?.id === connector.id && ' (connecting...)'}
            </button>
          ))}

          {connectors.length === 0 && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              No wallet connectors available. Please make sure you have a wallet extension installed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet; 