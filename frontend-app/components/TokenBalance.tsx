import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const TokenBalance = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const fetchBalance = async () => {
    if (!isConnected || !address) return;

    setLoading(true);
    setError(null);

    try {
      // First check if the backend is available
      const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, { 
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).catch(() => null);
      
      if (!healthCheck || !healthCheck.ok) {
        setBackendAvailable(false);
        throw new Error('Backend service is unavailable. Please ensure the backend server is running.');
      }
      
      setBackendAvailable(true);
      
      // Now fetch the balance
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/balance/${address}`, {
        signal: AbortSignal.timeout(8000) // 8 second timeout - increased from 5s
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      setBalance(data.balance);
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        setError('Request timed out. The RPC endpoint may be experiencing issues.');
      } else if (!backendAvailable) {
        setError('Backend service is unavailable. Please ensure the backend server is running.');
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        setError('Network error: The Base Sepolia network may be experiencing issues.');
      } else {
        setError(err.message || 'Failed to fetch balance. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when the component mounts or when the address changes
  useEffect(() => {
    let mounted = true;
    
    if (isConnected && address) {
      fetchBalance();
    }
    
    return () => {
      mounted = false;
    };
  }, [isConnected, address]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Your ETH Balance</h2>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm mb-2">
          <p>{error}</p>
          <p className="mt-1 text-xs text-gray-600">
            The Base Sepolia testnet or RPC provider may be experiencing issues.
          </p>
        </div>
      ) : balance ? (
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{parseFloat(balance).toFixed(4)}</span>
          <span className="ml-2 text-gray-500">ETH</span>
        </div>
      ) : (
        <div className="text-gray-500">No balance available</div>
      )}
      
      <button 
        onClick={fetchBalance}
        disabled={loading}
        className="mt-3 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md disabled:opacity-50 transition-colors"
      >
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      
      {!backendAvailable && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          Note: The backend server appears to be offline. Start the backend to access balance information.
        </div>
      )}
    </div>
  );
};

export default TokenBalance; 