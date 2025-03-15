import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Task {
  id: number;
  goal_id: number;
  description: string;
  status: 'pending' | 'completed' | 'verified';
  created_at: string;
}

interface Goal {
  id: number;
  user_address: string;
  description: string;
  created_at: string;
  blockchain_goal_id?: number;
  blockchain_tx_hash?: string;
  staked_amount?: string;
  tasks: Task[];
}

// This is a simplified demo component to show smart wallet gas-free capabilities
const ClaimReward = () => {
  const { address, isConnected, connector } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasCompletedTasks, setHasCompletedTasks] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [lastClaimTime, setLastClaimTime] = useState<Date | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);
  
  // Check if using a smart wallet (Coinbase Wallet)
  const isSmartWallet = connector?.id === 'coinbaseWallet';
  
  // Check blockchain status
  useEffect(() => {
    const checkBlockchainStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/info`);
        if (response.ok) {
          const data = await response.json();
          setBlockchainEnabled(data.ready && data.contracts.stake);
        }
      } catch (err) {
        console.error('Error checking blockchain status:', err);
      }
    };
    
    checkBlockchainStatus();
  }, []);
  
  // Check if user has any completed goals
  useEffect(() => {
    const checkCompletedTasks = async () => {
      if (!isConnected || !address) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${address}`);
        if (!response.ok) {
          console.error('Failed to fetch goals');
          return;
        }
        
        const data = await response.json();
        const userGoals = data.goals || [];
        setGoals(userGoals);
        
        // Check if any goals have all tasks completed and have a staked amount
        const hasCompletableGoals = userGoals.some((goal: Goal) => {
          // Check if this goal has a stake and blockchain ID
          const hasStake = !!goal.staked_amount && !!goal.blockchain_goal_id;
          
          // Check if all tasks are completed
          const allTasksCompleted = goal.tasks?.length > 0 && 
            goal.tasks.every((task: Task) => 
              task.status === 'completed' || task.status === 'verified'
            );
            
          return hasStake && allTasksCompleted;
        });
        
        setHasCompletedTasks(hasCompletableGoals);
        
        // Reset claim status if there are new completed tasks after a previous claim
        if (hasCompletableGoals && hasClaimedReward && lastClaimTime) {
          // Check if any goal/task was completed after the last claim
          const hasNewCompletedTasks = userGoals.some((goal: Goal) => 
            goal.tasks?.some((task: Task) => 
              (task.status === 'completed' || task.status === 'verified') && 
              new Date(task.created_at) > lastClaimTime
            )
          );
          
          if (hasNewCompletedTasks) {
            setHasClaimedReward(false);
          }
        }
      } catch (err) {
        console.error('Error checking completed tasks:', err);
      }
    };
    
    checkCompletedTasks();
    
    // Set up polling to check for completed tasks periodically
    const interval = setInterval(checkCompletedTasks, 30000);
    return () => clearInterval(interval);
  }, [address, isConnected, hasClaimedReward, lastClaimTime]);
  
  const claimReward = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedGoalId) {
      setError('Please select a goal to claim rewards for');
      return;
    }
    
    if (!hasCompletedTasks) {
      setError('You need to complete tasks before claiming rewards');
      return;
    }
    
    if (hasClaimedReward) {
      setError('You have already claimed your rewards. Complete more tasks to earn more.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Call the blockchain API to claim reward
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/claim-reward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          goalId: selectedGoalId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim reward');
      }
      
      const now = new Date();
      setLastClaimTime(now);
      setHasClaimedReward(true);
      
      const txHash = data.txHash;
      const amount = data.amount;
      
      if (isSmartWallet) {
        setSuccessMessage(`Reward of ${amount} ETH claimed successfully! Transaction was gas-free thanks to your smart wallet. TX: ${txHash}`);
      } else {
        setSuccessMessage(`Reward of ${amount} ETH claimed successfully! Gas fees were deducted from your wallet. TX: ${txHash}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to claim reward. Please try again.');
      console.error('Error claiming reward:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset claim state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setHasClaimedReward(false);
      setLastClaimTime(null);
      setSelectedGoalId(null);
    }
  }, [isConnected]);
  
  // Don't render if not connected
  if (!isConnected) {
    return null;
  }

  // Find completable goals (with stakes and all tasks completed)
  const completableGoals = goals.filter(goal => {
    const hasStake = !!goal.staked_amount && !!goal.blockchain_goal_id;
    
    const allTasksCompleted = goal.tasks?.length > 0 && 
      goal.tasks.every(task => 
        task.status === 'completed' || task.status === 'verified'
      );
      
    return hasStake && allTasksCompleted;
  });

  // Determine if the claim button should be disabled
  const isClaimDisabled = isLoading || !hasCompletedTasks || hasClaimedReward || !selectedGoalId || !blockchainEnabled;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Claim Growth Rewards</h2>
        {!blockchainEnabled && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
            Blockchain Required
          </span>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {blockchainEnabled ? (
        <>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            {completableGoals.length > 0 ? (
              <>
                <p className="text-sm text-gray-700 mb-2">
                  {hasClaimedReward 
                    ? "You've already claimed rewards for your completed tasks. Complete more tasks to earn more!" 
                    : "You have completed goals that qualify for ETH rewards!"}
                </p>
                
                {!hasClaimedReward && (
                  <div className="mb-4">
                    <label htmlFor="goalSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Select goal to claim reward
                    </label>
                    <select
                      id="goalSelect"
                      value={selectedGoalId || ''}
                      onChange={(e) => setSelectedGoalId(parseInt(e.target.value))}
                      disabled={isLoading || hasClaimedReward}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">-- Select a goal --</option>
                      {completableGoals.map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.description} ({goal.staked_amount} ETH)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">
                      {selectedGoalId ? 
                        goals.find(g => g.id === selectedGoalId)?.staked_amount : 
                        '0.00'} ETH
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {hasClaimedReward ? 'Claimed' : 'Available to claim'}
                    </span>
                  </div>
                  {isSmartWallet && (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      Gas-Free
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-700">
                Complete all tasks for a staked goal to claim ETH rewards. Stake ETH when creating a goal to be eligible.
              </p>
            )}
          </div>
          
          <div className="mb-3 text-xs text-gray-500">
            <p>
              <span className="font-semibold">How it works:</span> When you complete all tasks for a goal with staked ETH, you can claim back your stake plus a bonus.
            </p>
            <p className="mt-1">
              {isSmartWallet 
                ? "You're using a smart wallet, so claims will be gas-free!" 
                : "You're using a standard wallet, so you'll pay gas fees for claims."}
            </p>
          </div>
          
          <button
            onClick={claimReward}
            disabled={isClaimDisabled}
            className={`w-full py-2 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isClaimDisabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isSmartWallet 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            } text-white disabled:opacity-50`}
          >
            {isLoading 
              ? 'Processing...' 
              : hasClaimedReward 
                ? 'Already Claimed' 
                : !hasCompletedTasks 
                  ? 'Complete Tasks First' 
                  : !selectedGoalId
                    ? 'Select a Goal'
                    : 'Claim Reward'}
          </button>
        </>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">
            Blockchain functionality not available. Please check if the backend is properly configured.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClaimReward; 