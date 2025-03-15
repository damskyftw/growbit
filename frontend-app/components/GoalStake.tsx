import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const GoalStake = ({ 
  onStakeChange,
  disabled = false
}: { 
  onStakeChange: (amount: string) => void,
  disabled?: boolean 
}) => {
  const { address, isConnected } = useAccount();
  const [stakeAmount, setStakeAmount] = useState('0.01');
  const [showStake, setShowStake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEligibleForFaucet, setIsEligibleForFaucet] = useState(false);
  
  // Check if user is eligible for faucet
  useEffect(() => {
    const checkFaucetEligibility = async () => {
      if (!isConnected || !address) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/info`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Only check eligibility if backend and faucet are ready
        if (data.ready && data.contracts.faucet) {
          const eligibilityResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/faucet/eligible/${address}`
          );
          
          if (eligibilityResponse.ok) {
            const eligibilityData = await eligibilityResponse.json();
            setIsEligibleForFaucet(eligibilityData.eligible || false);
          }
        }
      } catch (err) {
        console.error('Error checking faucet eligibility:', err);
      }
    };
    
    checkFaucetEligibility();
  }, [address, isConnected]);
  
  const handleToggleStake = () => {
    setShowStake(!showStake);
    
    if (!showStake) {
      onStakeChange(stakeAmount);
    } else {
      onStakeChange('');
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validate the amount (must be positive number with max 4 decimal places)
    if (!/^\d*\.?\d{0,4}$/.test(value) && value !== '') {
      return;
    }
    
    setStakeAmount(value);
    
    if (showStake && value) {
      onStakeChange(value);
    }
  };
  
  const requestFaucetDrip = async () => {
    if (!isConnected || !address) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/faucet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userAddress: address })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to request ETH from faucet');
        return;
      }
      
      // Success
      setError(null);
      setIsEligibleForFaucet(false);
      
      // Display success message
      alert(`Success! You received ${data.amount} ETH. Transaction hash: ${data.txHash}`);
    } catch (err: any) {
      setError(err.message || 'Failed to request ETH from faucet');
      console.error('Error requesting ETH from faucet:', err);
    }
  };
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="stakeEth"
            checked={showStake}
            onChange={handleToggleStake}
            disabled={disabled}
            className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="stakeEth" className="text-sm font-medium text-gray-700">
            Stake ETH to commit to your goal
          </label>
        </div>
        
        {isEligibleForFaucet && (
          <button
            type="button"
            onClick={requestFaucetDrip}
            disabled={disabled}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Get Free ETH
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {showStake && (
        <div className="mt-2">
          <div className="flex items-center">
            <input
              type="text"
              value={stakeAmount}
              onChange={handleAmountChange}
              disabled={disabled}
              className="block w-24 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.01"
            />
            <span className="ml-2 text-sm text-gray-500">ETH</span>
          </div>
          
          <p className="mt-1 text-xs text-gray-500">
            Staking ETH helps you commit to your goal. You'll get it back (plus a bonus) when you complete all tasks.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalStake; 