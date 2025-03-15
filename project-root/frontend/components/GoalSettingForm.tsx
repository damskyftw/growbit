import { useState } from 'react';
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

const GoalSettingForm = () => {
  const { address, isConnected } = useAccount();
  const [goalDescription, setGoalDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdGoal, setCreatedGoal] = useState<Goal | null>(null);

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
    setSuccessMessage(null);
    setCreatedGoal(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          description: goalDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create goal');
      }

      setSuccessMessage('Goal created successfully! Here are your tasks:');
      setCreatedGoal(data);
      setGoalDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create goal. Please try again.');
      console.error('Error creating goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="goal-setting-form">
        <div className="info-message">
          Please connect your wallet to set goals
        </div>
        <style jsx>{`
          .goal-setting-form {
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
    <div className="goal-setting-form">
      <h2>Set Your Growth Goal</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {successMessage && createdGoal && (
        <div className="success-container">
          <div className="success-message">{successMessage}</div>
          <div className="tasks-container">
            <h3>Tasks:</h3>
            <ul className="task-list">
              {createdGoal.tasks.map(task => (
                <li key={task.id} className="task-item">
                  {task.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goalDescription">Describe your personal growth goal</label>
          <textarea
            id="goalDescription"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
            placeholder="e.g., Learn to play the guitar, Improve my public speaking skills, Read 20 books this year..."
            rows={5}
            disabled={isSubmitting}
          />
          <p className="help-text">
            Be specific about what you want to achieve. Our AI agent will generate actionable tasks for you.
          </p>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Create Goal & Generate Tasks'}
        </button>
      </form>
      
      <style jsx>{`
        .goal-setting-form {
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
        
        h3 {
          font-size: 1.2rem;
          color: #334155;
          margin-bottom: 10px;
        }
        
        .success-container {
          margin-bottom: 20px;
        }
        
        .success-message {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ecfdf5;
          color: #10b981;
          border-radius: 5px;
          border-left: 4px solid #10b981;
        }
        
        .error-message {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #fef2f2;
          color: #ef4444;
          border-radius: 5px;
          border-left: 4px solid #ef4444;
        }
        
        .tasks-container {
          background-color: #f1f5f9;
          border-radius: 5px;
          padding: 15px;
          margin-top: 10px;
        }
        
        .task-list {
          list-style-type: none;
          padding-left: 0;
          margin: 0;
        }
        
        .task-item {
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
        }
        
        .task-item:last-child {
          border-bottom: none;
        }
        
        .task-item:before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-right: 0.5em;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }
        
        textarea {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 16px;
          font-family: inherit;
          transition: border-color 0.2s;
          resize: vertical;
        }
        
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        textarea:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }
        
        .help-text {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        
        .submit-button {
          margin-top: 10px;
          padding: 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default GoalSettingForm; 