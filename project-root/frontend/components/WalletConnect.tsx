import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { useState } from 'react';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, error: connectError, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [showAddress, setShowAddress] = useState(false);

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Toggle showing full address
  const toggleAddress = () => {
    setShowAddress(!showAddress);
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="connected-info">
          <span className="connected-badge">Connected</span>
          <span 
            className="address" 
            onClick={toggleAddress}
            title="Click to show/hide full address"
          >
            {showAddress ? address : formatAddress(address || '')}
          </span>
        </div>
        <button 
          className="disconnect-button"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
        <style jsx>{`
          .wallet-connected {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            padding: 15px;
            border-radius: 10px;
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            width: 100%;
            max-width: 400px;
          }
          
          .connected-info {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
          }
          
          .connected-badge {
            background-color: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .address {
            font-family: monospace;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
          }
          
          .address:hover {
            background-color: #e2e8f0;
          }
          
          .disconnect-button {
            width: 100%;
            padding: 10px;
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .disconnect-button:hover {
            background-color: #e2e8f0;
          }
        `}</style>
      </div>
    );
  }

  const metaMaskConnector = new MetaMaskConnector();

  return (
    <div className="wallet-connect">
      <button 
        className="connect-button"
        disabled={isLoading}
        onClick={() => connect({ connector: metaMaskConnector })}
      >
        {isLoading && pendingConnector?.id === metaMaskConnector.id 
          ? 'Connecting...' 
          : 'Connect MetaMask'
        }
      </button>
      
      {connectError && (
        <div className="error-message">
          {connectError.message}
        </div>
      )}
      
      <style jsx>{`
        .wallet-connect {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 400px;
        }
        
        .connect-button {
          width: 100%;
          padding: 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .connect-button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        .connect-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 14px;
          text-align: center;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default WalletConnect; 