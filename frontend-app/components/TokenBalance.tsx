import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const TokenBalance = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!isConnected || !address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/balance/${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      setBalance(data.balance);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance. Please try again.');
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when the component mounts or when the address changes
  useEffect(() => {
    fetchBalance();
  }, [isConnected, address]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Your ETH Balance</h2>
      
      {loading ? (
        <div className="animate-pulse h-6 bg-gray-200 rounded w-24"></div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
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
        className="mt-3 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
      >
        Refresh
      </button>
    </div>
  );
};

export default TokenBalance; 