import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const TokenBalance = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!isConnected || !address || !window.ethereum) {
      setError('MetaMask not available or not connected properly');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use a JSON-RPC provider to connect to the network
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      
      // Get native ETH balance
      const rawBalance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(rawBalance);
      
      setBalance(formattedBalance);
    } catch (err) {
      console.error('Error fetching ETH balance:', err);
      setError('Failed to fetch ETH balance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance when address changes or component mounts
  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    } else {
      // Reset state when disconnected
      setBalance('0');
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="token-balance">
      <h2>ETH Balance</h2>
      
      {isLoading ? (
        <div className="loading">Loading balance...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="balance-container">
          <div className="token-info">
            <span className="token-name">Base Sepolia</span>
            <span className="token-symbol">(ETH)</span>
          </div>
          <div className="balance-amount">{parseFloat(balance).toFixed(4)}</div>
          <button 
            className="refresh-button"
            onClick={fetchBalance}
          >
            Refresh
          </button>
        </div>
      )}
      
      <style jsx>{`
        .token-balance {
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 400px;
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.5rem;
          color: #1e293b;
        }
        
        .loading {
          color: #64748b;
          font-style: italic;
        }
        
        .error {
          color: #ef4444;
          font-size: 14px;
        }
        
        .balance-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .token-info {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .token-name {
          font-weight: 600;
          color: #334155;
        }
        
        .token-symbol {
          color: #64748b;
        }
        
        .balance-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
        }
        
        .refresh-button {
          margin-top: 10px;
          padding: 8px;
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .refresh-button:hover {
          background-color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default TokenBalance; 