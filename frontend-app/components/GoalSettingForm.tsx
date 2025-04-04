import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import GoalStake from './GoalStake';

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

const GoalSettingForm = () => {
  const { address, isConnected } = useAccount();
  const [goalDescription, setGoalDescription] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdGoal, setCreatedGoal] = useState<Goal | null>(null);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);

  // Reset form when wallet changes
  useEffect(() => {
    if (address) {
      // Reset form state when wallet changes
      setGoalDescription('');
      setStakeAmount('');
      setError(null);
      setBalanceError(null);
      setSuccessMessage(null);
      setCreatedGoal(null);
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!goalDescription.trim()) {
      setError('Please enter a goal description');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setBalanceError(null);
    setSuccessMessage(null);
    setCreatedGoal(null);

    try {
      const requestBody: any = {
        userAddress: address,
        description: goalDescription,
      };
      
      // Add stake amount if provided
      if (stakeAmount) {
        requestBody.stakeAmount = stakeAmount;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a balance error
        if (data.error && data.error.includes('Insufficient balance')) {
          setBalanceError(data.error);
        } else {
          throw new Error(data.error || 'Failed to create goal');
        }
        return;
      }

      // Ensure the response data has the expected structure
      const goalData = data.goal || data;
      
      // Default to empty array if tasks is undefined
      if (!goalData.tasks) {
        goalData.tasks = [];
      }

      let successText = 'Goal created successfully! Here are your tasks:';
      
      // Add blockchain info to success message if goal was staked
      if (stakeAmount && goalData.blockchain_goal_id) {
        successText = `Goal created and ${stakeAmount} ETH staked successfully! Complete all tasks to earn it back.`;
      }

      setSuccessMessage(successText);
      setCreatedGoal(goalData);
      setGoalDescription('');
      setStakeAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to create goal. Please try again.');
      console.error('Error creating goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStakeChange = (amount: string) => {
    setStakeAmount(amount);
    // Clear balance error when stake amount changes
    setBalanceError(null);
  };

  // Create a simplified demo Twitter goal with just one task
  const createDemoTwitterGoal = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsDemoSubmitting(true);
    setError(null);
    setBalanceError(null);
    setSuccessMessage(null);
    setCreatedGoal(null);

    try {
      const requestBody: any = {
        userAddress: address
      };
      
      // Add stake amount if provided
      if (stakeAmount) {
        requestBody.stakeAmount = stakeAmount;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/demo/twitter-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a balance error
        if (data.error && data.error.includes('Insufficient balance')) {
          setBalanceError(data.error);
        } else {
          throw new Error(data.error || 'Failed to create demo goal');
        }
        return;
      }

      // Process the response
      const goalData = data.goal || data;
      
      // Default to empty array if tasks is undefined
      if (!goalData.tasks) {
        goalData.tasks = [];
      }

      let successText = 'Demo Twitter goal created! Share a tweet and take a screenshot as evidence:';
      
      // Add blockchain info to success message if goal was staked
      if (stakeAmount && goalData.blockchain_goal_id) {
        successText = `Demo Twitter goal created with ${stakeAmount} ETH staked! Complete the task to earn it back.`;
      }

      setSuccessMessage(successText);
      setCreatedGoal(goalData);
      setGoalDescription('');
      setStakeAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to create demo goal. Please try again.');
      console.error('Error creating demo goal:', err);
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Set a New Growth Goal</h2>
      
      {!isConnected ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">Connect your wallet to set goals</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : balanceError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{balanceError}</p>
          <p className="text-sm text-red-600 mt-1">Please reduce your stake amount or add more ETH to your wallet.</p>
        </div>
      ) : successMessage ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
          {createdGoal && (
            <div className="mt-4">
              <h3 className="font-medium">Tasks:</h3>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {createdGoal.tasks && createdGoal.tasks.map((task, index) => (
                  <li key={task.id || index} className="text-sm text-gray-700">
                    {task.description}
                  </li>
                ))}
              </ul>
              
              {createdGoal.blockchain_tx_hash && (
                <div className="mt-3 text-xs text-gray-500">
                  <p>
                    Transaction: <a 
                      href={`https://sepolia.basescan.org/tx/${createdGoal.blockchain_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on BaseScan
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Quick Demo Button */}
      <div className="mb-5 pb-5 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Demo</h3>
        <button
          type="button"
          onClick={createDemoTwitterGoal}
          disabled={isDemoSubmitting || isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isDemoSubmitting ? 'Creating...' : 'Create Twitter Task Demo'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Creates a simple goal with one task: Post a tweet about web3. Perfect for quick demos!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your goal
          </label>
          <textarea
            id="goalDescription"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Learn to play the guitar, Improve my public speaking skills, Run a half marathon..."
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <GoalStake 
          onStakeChange={handleStakeChange}
          disabled={isSubmitting}
        />

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-growbit-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalSettingForm; 