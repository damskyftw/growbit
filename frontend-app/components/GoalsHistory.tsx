import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Task {
  id: number;
  goal_id: number;
  description: string;
  status: 'pending' | 'completed' | 'verified';
  created_at: string;
  completed_at?: string;
  evidence?: string;
  verification_data?: string;
}

interface Goal {
  id: number;
  user_address: string;
  description: string;
  created_at: string;
  tasks: Task[];
  blockchain_goal_id?: number;
  blockchain_tx_hash?: string;
  staked_amount?: string;
  isCompleted?: boolean;
}

const GoalsHistory = () => {
  const { address, isConnected } = useAccount();
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<{taskId: number, evidence: string} | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const fetchCompletedGoals = async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch goals');
      }

      // Filter goals where all tasks are completed
      const goalsWithCompletedStatus = data.goals.map((goal: Goal) => {
        const allTasksCompleted = goal.tasks?.length > 0 && 
          goal.tasks.every(task => 
            task.status === 'completed' || task.status === 'verified'
          );
        return {
          ...goal, 
          isCompleted: allTasksCompleted
        };
      });

      // Get only completed goals
      const completed = goalsWithCompletedStatus.filter((goal: Goal) => goal.isCompleted);
      
      // Sort by creation date (newest first by default)
      const sorted = sortGoals(completed, sortOption);
      
      setCompletedGoals(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch completed goals. Please try again.');
      console.error('Error fetching completed goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sortGoals = (goals: Goal[], option: 'newest' | 'oldest') => {
    return [...goals].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return option === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSortChange = (option: 'newest' | 'oldest') => {
    setSortOption(option);
    setCompletedGoals(sortGoals(completedGoals, option));
  };
  
  const viewTaskEvidence = (taskId: number) => {
    const task = completedGoals.flatMap(g => g.tasks).find(t => t.id === taskId);
    if (task && task.evidence) {
      setViewingEvidence({taskId, evidence: task.evidence});
    }
  };

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(selectedGoal?.id === goal.id ? null : goal);
  };

  // Fetch completed goals when the component mounts or when the address changes
  useEffect(() => {
    fetchCompletedGoals();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-blue-500 text-center">
          Please connect your wallet to view your completed goals
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Completed Goals History</h2>
        
        <div className="flex text-sm border rounded-md overflow-hidden">
          <button
            onClick={() => handleSortChange('newest')}
            className={`px-3 py-1 ${sortOption === 'newest' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
          >
            Newest
          </button>
          <button
            onClick={() => handleSortChange('oldest')}
            className={`px-3 py-1 border-l ${sortOption === 'oldest' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
          >
            Oldest
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">Loading your completed goals...</p>
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : completedGoals.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">You haven't completed any goals yet.</p>
          <p className="text-sm text-gray-400 mt-2">Complete all tasks in a goal to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedGoals.map(goal => (
            <div key={goal.id} className="bg-gray-50 rounded-md p-4 shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 
                    className="font-medium text-lg text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => handleGoalSelect(goal)}
                  >
                    {goal.description}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>Completed on: {new Date(goal.tasks[goal.tasks.length - 1].completed_at || goal.tasks[goal.tasks.length - 1].created_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Created on: {new Date(goal.created_at).toLocaleDateString()}</span>
                  </div>
                  {goal.staked_amount && (
                    <div className="mt-1 px-3 py-1 text-xs inline-block font-medium text-green-700 bg-green-100 rounded">
                      Staked {goal.staked_amount} ETH
                    </div>
                  )}
                </div>
                <div className="flex">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed ✓
                  </span>
                </div>
              </div>
              
              {selectedGoal?.id === goal.id && (
                <div className="mt-4 bg-white p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Completed Tasks:</h4>
                  <ul className="space-y-2">
                    {goal.tasks && goal.tasks.map(task => (
                      <li key={task.id} className="py-2 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">{task.description}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            {task.status}
                          </span>
                        </div>
                        {task.evidence && (
                          <div className="flex justify-end">
                            <button
                              className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                              onClick={() => viewTaskEvidence(task.id)}
                            >
                              View Proof
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* View Evidence Modal */}
      {viewingEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion Evidence</h3>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4 max-h-60 overflow-y-auto">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{viewingEvidence.evidence}</p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setViewingEvidence(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t text-sm text-gray-500">
        <p>Your completed goals serve as a record of your growth journey. Reflect on your past achievements to stay motivated!</p>
        {completedGoals.length > 0 && (
          <p className="mt-2 text-green-600">
            You've completed {completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''}! Great job.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoalsHistory; 