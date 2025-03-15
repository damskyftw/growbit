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
  tasks: Task[];
}

const GoalsList = () => {
  const { address, isConnected } = useAccount();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/goals/${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch goals');
      }

      setGoals(data.goals || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch goals. Please try again.');
      console.error('Error fetching goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: 'pending' | 'completed' | 'verified') => {
    if (!isConnected) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task');
      }

      // Update the task status in the local state
      setGoals(prevGoals => 
        prevGoals.map(goal => ({
          ...goal,
          tasks: goal.tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        }))
      );
    } catch (err: any) {
      console.error('Error updating task:', err);
      alert('Failed to update task: ' + err.message);
    }
  };

  // Fetch goals when the component mounts or when the address changes
  useEffect(() => {
    fetchGoals();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="goals-list">
        <div className="info-message">
          Please connect your wallet to view your goals
        </div>
        <style jsx>{`
          .goals-list {
            margin-top: 20px;
            padding: 20px;
            border-radius: 10px;
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            width: 100%;
            max-width: 600px;
          }
          
          .info-message {
            color: #3b82f6;
            text-align: center;
            padding: 10px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="goals-list">
      <h2>Your Growth Goals</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading your goals...</div>
      ) : goals.length === 0 ? (
        <div className="no-goals">
          <p>You haven't set any goals yet.</p>
          <p>Use the form above to create your first growth goal!</p>
        </div>
      ) : (
        <div className="goals-container">
          {goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <h3 className="goal-title">{goal.description}</h3>
              <div className="goal-date">Created on: {new Date(goal.created_at).toLocaleDateString()}</div>
              
              <div className="tasks-section">
                <h4>Tasks:</h4>
                <ul className="tasks-list">
                  {goal.tasks.map(task => (
                    <li key={task.id} className={`task-item ${task.status}`}>
                      <div className="task-content">
                        <span className="task-description">{task.description}</span>
                        <span className="task-status">{task.status}</span>
                      </div>
                      <div className="task-actions">
                        {task.status === 'pending' && (
                          <button
                            className="mark-completed-btn"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            Mark Complete
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button
                            className="mark-pending-btn"
                            onClick={() => updateTaskStatus(task.id, 'pending')}
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="refresh-button"
        onClick={fetchGoals}
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh Goals'}
      </button>
      
      <style jsx>{`
        .goals-list {
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 600px;
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
          text-align: center;
          padding: 15px 0;
        }
        
        .no-goals {
          text-align: center;
          padding: 20px;
          color: #64748b;
          border: 1px dashed #cbd5e1;
          border-radius: 5px;
          margin: 15px 0;
        }
        
        .error-message {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #fef2f2;
          color: #ef4444;
          border-radius: 5px;
          border-left: 4px solid #ef4444;
        }
        
        .goals-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .goal-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 15px;
        }
        
        .goal-title {
          margin: 0 0 10px 0;
          color: #1e293b;
          font-size: 1.2rem;
        }
        
        .goal-date {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 15px;
        }
        
        .tasks-section {
          background-color: #f8f9fa;
          border-radius: 5px;
          padding: 12px;
        }
        
        h4 {
          margin: 0 0 10px 0;
          color: #334155;
          font-size: 1rem;
        }
        
        .tasks-list {
          list-style-type: none;
          padding-left: 0;
          margin: 0;
        }
        
        .task-item {
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .task-item:last-child {
          border-bottom: none;
        }
        
        .task-item.completed .task-description {
          text-decoration: line-through;
          color: #64748b;
        }
        
        .task-item.verified .task-description {
          color: #10b981;
          font-weight: 500;
        }
        
        .task-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        
        .task-description {
          flex: 1;
        }
        
        .task-status {
          font-size: 0.8rem;
          padding: 2px 6px;
          border-radius: 12px;
          background-color: #e2e8f0;
          color: #475569;
          text-transform: capitalize;
        }
        
        .task-item.completed .task-status {
          background-color: #bfdbfe;
          color: #1e40af;
        }
        
        .task-item.verified .task-status {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .task-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .mark-completed-btn, .mark-pending-btn {
          padding: 4px 8px;
          font-size: 0.8rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .mark-completed-btn {
          background-color: #3b82f6;
          color: white;
        }
        
        .mark-completed-btn:hover {
          background-color: #2563eb;
        }
        
        .mark-pending-btn {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        
        .mark-pending-btn:hover {
          background-color: #e2e8f0;
        }
        
        .refresh-button {
          width: 100%;
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
        
        .refresh-button:hover:not(:disabled) {
          background-color: #e2e8f0;
        }
        
        .refresh-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default GoalsList; 