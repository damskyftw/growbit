import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface VerificationResult {
  verified: boolean;
  confidence: number;
  feedback: string;
  verifiedAt?: string;
}

interface Task {
  id: number;
  goal_id: number;
  description: string;
  status: 'pending' | 'completed' | 'verified';
  created_at: string;
  evidence?: string;
  verification_data?: string;
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

const GoalsList = () => {
  const { address, isConnected } = useAccount();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceData, setEvidenceData] = useState<{taskId: number, evidence: string}>({taskId: 0, evidence: ''});
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<{taskId: number, evidence: string} | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{taskId: number, message: string} | null>(null);

  const fetchGoals = async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${address}`);
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

    // If trying to mark as completed, open evidence modal
    if (newStatus === 'completed') {
      // Get existing evidence if available
      const task = goals.flatMap(g => g.tasks).find(t => t.id === taskId);
      setEvidenceData({
        taskId, 
        evidence: task?.evidence || ''
      });
      setVerificationResult(null);
      setEvidenceError(null);
      setShowEvidenceModal(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`, {
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

  const submitEvidence = async () => {
    if (!evidenceData.evidence.trim()) {
      setEvidenceError('Please provide evidence of task completion');
      return;
    }

    setIsSubmittingEvidence(true);
    setEvidenceError(null);
    setVerificationResult(null);
    setSubmissionSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${evidenceData.taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          evidence: evidenceData.evidence
        }),
      });

      const data = await response.json();
      
      // If verification failed, show feedback but don't close modal
      if (!response.ok && data.aiVerification) {
        setVerificationResult(data.aiVerification);
        setEvidenceError('AI verification failed. Please review the feedback and try again.');
        setIsSubmittingEvidence(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task');
      }

      // Update the task status in the local state
      setGoals(prevGoals => 
        prevGoals.map(goal => ({
          ...goal,
          tasks: goal.tasks.map(task => 
            task.id === evidenceData.taskId ? 
              { ...task, status: 'completed', evidence: evidenceData.evidence } : 
              task
          )
        }))
      );

      // If AI verification was successful, store the result and show success message
      if (data.aiVerification) {
        setVerificationResult(data.aiVerification);
      }
      
      // Show success message in the modal instead of closing it immediately
      setShowSuccessMessage(true);
      setSubmissionSuccess({
        taskId: evidenceData.taskId,
        message: data.aiVerification && data.aiVerification.verified 
          ? 'Your evidence has been verified successfully!' 
          : 'Your task has been marked as completed!'
      });
      
      // Close modal after 3 seconds if user doesn't close it manually
      setTimeout(() => {
        if (showSuccessMessage) {
          setShowEvidenceModal(false);
          setShowSuccessMessage(false);
        }
      }, 3000);
      
    } catch (err: any) {
      console.error('Error submitting evidence:', err);
      setEvidenceError(err.message || 'Failed to submit evidence');
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const discardEvidence = () => {
    if (isSubmittingEvidence) return;
    
    if (evidenceData.evidence.trim() !== '' && 
        !confirm('Are you sure you want to discard your evidence?')) {
      return;
    }
    
    setShowEvidenceModal(false);
    setEvidenceData({taskId: 0, evidence: ''});
    setVerificationResult(null);
    setEvidenceError(null);
    setShowSuccessMessage(false);
    setSubmissionSuccess(null);
  };

  const cancelGoal = async (goalId: number) => {
    if (!isConnected || !confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete goal');
      }

      // Remove the goal from local state
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      alert('Goal deleted successfully');
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal: ' + err.message);
    }
  };
  
  const viewTaskEvidence = (taskId: number) => {
    const task = goals.flatMap(g => g.tasks).find(t => t.id === taskId);
    if (task && task.evidence) {
      setViewingEvidence({taskId, evidence: task.evidence});
    }
  };

  // Fetch goals when the component mounts or when the address changes
  useEffect(() => {
    fetchGoals();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="text-blue-500 text-center">
          Please connect your wallet to view your goals
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Your Growth Goals</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-gray-500 italic text-center py-4">Loading your goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">You haven't set any goals yet.</p>
          <p className="text-gray-500">Use the form above to create your first growth goal!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map(goal => (
            <div key={goal.id} className="bg-gray-50 rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg text-gray-900">{goal.description}</h3>
                  <div className="text-xs text-gray-500 mt-1 mb-3">
                    Created on: {new Date(goal.created_at).toLocaleDateString()}
                  </div>
                </div>
                {!goal.staked_amount ? (
                  <button
                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                    onClick={() => cancelGoal(goal.id)}
                  >
                    Cancel Goal
                  </button>
                ) : (
                  <div className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                    Staked {goal.staked_amount} ETH
                  </div>
                )}
              </div>
              
              {goal.staked_amount && (
                <div className="bg-blue-50 p-3 rounded-md mb-3 text-sm text-blue-800">
                  <p><strong>Note:</strong> This goal has ETH staked. You must provide proof when completing tasks.</p>
                </div>
              )}
              
              <div className="bg-white p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks:</h4>
                <ul className="space-y-2">
                  {goal.tasks && goal.tasks.map(task => (
                    <li key={task.id} className={`py-2 border-b border-gray-100 ${task.status}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.description}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.status === 'pending' ? 'bg-gray-200 text-gray-700' : 
                          task.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        {task.status === 'pending' && (
                          <button
                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            {goal.staked_amount ? 'Complete with Proof' : 'Mark Complete'}
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <>
                            <button
                              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                              onClick={() => updateTaskStatus(task.id, 'pending')}
                            >
                              Mark Pending
                            </button>
                            {goal.staked_amount && (
                              <button
                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                onClick={() => updateTaskStatus(task.id, 'completed')}
                              >
                                Edit Proof
                              </button>
                            )}
                          </>
                        )}
                        {task.evidence && (
                          <button
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                            onClick={() => viewTaskEvidence(task.id)}
                          >
                            View Proof
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
      
      {/* Evidence Submission Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showSuccessMessage ? 'Submission Successful' : 'Provide Task Completion Evidence'}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-500" 
                onClick={discardEvidence}
                disabled={isSubmittingEvidence}
              >
                ✕
              </button>
            </div>
            
            {showSuccessMessage && submissionSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium mb-2">{submissionSuccess.message}</p>
                <p className="text-sm text-gray-500">You can always view or edit your evidence later.</p>
                <div className="mt-6">
                  <button
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={() => {
                      setShowEvidenceModal(false);
                      setShowSuccessMessage(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {evidenceError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                    <p className="text-red-700 text-sm">{evidenceError}</p>
                  </div>
                )}
                
                {verificationResult && !verificationResult.verified && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
                    <p className="font-medium text-yellow-800 text-sm">AI Verification Feedback:</p>
                    <p className="text-yellow-700 text-sm mt-1">{verificationResult.feedback}</p>
                    <p className="text-yellow-600 text-xs mt-2">Please revise your evidence based on this feedback.</p>
                  </div>
                )}
                
                {verificationResult && verificationResult.verified && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                    <p className="font-medium text-green-800 text-sm">AI Verification Successful:</p>
                    <p className="text-green-700 text-sm mt-1">{verificationResult.feedback}</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4">
                  Please provide evidence that you have completed this task. Be specific and detailed.
                  {goals.find(g => g.tasks.some(t => t.id === evidenceData.taskId))?.staked_amount && 
                    " Your evidence will be verified by AI since you have ETH staked on this goal."}
                </p>
                
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 text-sm h-32 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe how you completed this task, attach links, or provide any other relevant evidence..."
                  value={evidenceData.evidence}
                  onChange={(e) => setEvidenceData({...evidenceData, evidence: e.target.value})}
                  disabled={isSubmittingEvidence}
                ></textarea>
                
                <div className="mt-4 flex justify-between">
                  <div className="text-xs text-gray-500">
                    {evidenceData.evidence.length} / 1000 characters
                  </div>
                  <div className="space-x-3">
                    <button
                      className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={discardEvidence}
                      disabled={isSubmittingEvidence}
                    >
                      {verificationResult && !verificationResult.verified ? 'Discard Changes' : 'Cancel'}
                    </button>
                    <button
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      onClick={submitEvidence}
                      disabled={isSubmittingEvidence || !evidenceData.evidence.trim()}
                    >
                      {isSubmittingEvidence ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (verificationResult ? 'Resubmit Evidence' : 'Submit Evidence')}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Remember:</span> Your evidence should clearly demonstrate that you've completed the task. The more detailed, the better.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* View Evidence Modal */}
      {viewingEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Task Completion Evidence</h3>
              <button 
                className="text-gray-400 hover:text-gray-500" 
                onClick={() => setViewingEvidence(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4 max-h-60 overflow-y-auto">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{viewingEvidence.evidence}</p>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                onClick={() => {
                  // Set up to edit this evidence
                  setEvidenceData({
                    taskId: viewingEvidence.taskId,
                    evidence: viewingEvidence.evidence
                  });
                  setViewingEvidence(null);
                  setShowEvidenceModal(true);
                }}
              >
                Edit Evidence
              </button>
              
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
      
      <button 
        className="mt-4 w-full py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        onClick={fetchGoals}
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh Goals'}
      </button>
    </div>
  );
};

export default GoalsList; 