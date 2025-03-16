import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Challenge {
  id: string;
  type: 'sent' | 'received' | 'active';
  description: string;
  friend: {
    address: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
  expiresAt: string;
  goalAmount: number;
  progress: {
    user: number;
    friend: number;
  };
}

const FriendChallenges = () => {
  const { address, isConnected } = useAccount();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendAddress, setFriendAddress] = useState('');
  const [challengeGoal, setChallengeGoal] = useState('');
  const [showNewChallengeForm, setShowNewChallengeForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'sent' | 'received'>('active');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Reset challenges when wallet changes
  useEffect(() => {
    if (isConnected && address) {
      // Reset challenges when the wallet address changes
      setChallenges([]);
      setLoading(true);
      setError(null);
      setShowNewChallengeForm(false);
      setShowSuccessMessage(false);
      setFriendAddress('');
      setChallengeGoal('');
      setErrorMessage(null);
    }
  }, [address, isConnected]);
  
  // Simulate fetching challenge data
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!isConnected || !address) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Check if backend is available
        const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        }).catch(() => null);
        
        if (!healthCheck || !healthCheck.ok) {
          setError('Backend service is unavailable. Challenge data cannot be loaded.');
          setLoading(false);
          return;
        }
        
        // In a production app, this would be fetched from the backend
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For new users, provide empty challenges list
        setChallenges([]);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to load challenge data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isConnected && address) {
      fetchChallenges();
    }
  }, [isConnected, address]);
  
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset state
    setErrorMessage(null);
    setIsSubmitting(true);
    
    // Validate input
    if (!friendAddress.startsWith('0x') || friendAddress.length !== 42) {
      setErrorMessage('Please enter a valid Ethereum address (0x...)');
      setIsSubmitting(false);
      return;
    }
    
    if (!challengeGoal.trim() || challengeGoal.length < 5) {
      setErrorMessage('Please provide a more detailed challenge description');
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would call the API to create a challenge
    setTimeout(() => {
      const newChallenge: Challenge = {
        id: `new-${Date.now()}`,
        type: 'sent',
        description: challengeGoal,
        friend: {
          address: friendAddress,
          displayName: `Friend (${friendAddress.substring(0, 6)}...)`,
          avatar: '😊',
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        goalAmount: 1,
        progress: {
          user: 0,
          friend: 0,
        },
      };
      
      setChallenges([newChallenge, ...challenges]);
      
      // Show success message then hide form
      setShowSuccessMessage(true);
      setIsSubmitting(false);
      
      // Hide success message after 3 seconds and reset form
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowNewChallengeForm(false);
        setFriendAddress('');
        setChallengeGoal('');
      }, 3000);
    }, 1500); // Simulated network delay
  };
  
  const handleAcceptChallenge = (challengeId: string) => {
    setChallenges(
      challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, type: 'active' } 
          : challenge
      )
    );
  };
  
  const handleDeclineChallenge = (challengeId: string) => {
    setChallenges(
      challenges.filter(challenge => challenge.id !== challengeId)
    );
  };
  
  const getFilteredChallenges = () => {
    return challenges.filter(challenge => challenge.type === activeTab);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if (!isConnected) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Friend Challenges</h2>
        <p className="text-gray-500 text-sm">Connect your wallet to challenge friends to grow together.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Friend Challenges</h2>
        
        {!showNewChallengeForm && (
          <button
            onClick={() => setShowNewChallengeForm(true)}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            New Challenge
          </button>
        )}
      </div>
      
      {showNewChallengeForm ? (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-blue-800">
              {showSuccessMessage ? 'Challenge Sent!' : 'Challenge a Friend'}
            </h3>
            <button 
              onClick={() => {
                setShowNewChallengeForm(false);
                setShowSuccessMessage(false);
                setFriendAddress('');
                setChallengeGoal('');
                setErrorMessage(null);
              }}
              className="text-blue-500 hover:text-blue-700"
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>
          
          {showSuccessMessage ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium mb-2">Challenge sent successfully!</p>
              <p className="text-sm text-gray-500">Your friend will receive your challenge request.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateChallenge}>
              {errorMessage && (
                <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs">
                  {errorMessage}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="friendAddress" className="block text-xs font-medium text-gray-700 mb-1">
                  Friend's Wallet Address
                </label>
                <input
                  type="text"
                  id="friendAddress"
                  value={friendAddress}
                  onChange={(e) => setFriendAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full text-sm p-2 border border-gray-300 rounded-md"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="challengeGoal" className="block text-xs font-medium text-gray-700 mb-1">
                  Challenge Description
                </label>
                <input
                  type="text"
                  id="challengeGoal"
                  value={challengeGoal}
                  onChange={(e) => setChallengeGoal(e.target.value)}
                  placeholder="Complete 5 workouts this week..."
                  className="w-full text-sm p-2 border border-gray-300 rounded-md"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Challenge'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewChallengeForm(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
      
      {/* Challenge type tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'active' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'sent' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'received' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Received
        </button>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="py-6 text-center text-red-500 mb-4">{error}</div>
      )}
      
      {/* Loading or Empty States */}
      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : getFilteredChallenges().length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-gray-500">No {activeTab} challenges found.</p>
          {activeTab === 'active' && (
            <p className="text-sm text-gray-400 mt-2">
              Challenge a friend or accept a pending challenge to get started.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredChallenges().map((challenge) => (
            <div key={challenge.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2" title={challenge.description}>{challenge.description}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full mr-1.5 overflow-hidden border border-gray-200">
                      <span className="flex items-center justify-center h-full w-full">{challenge.friend.avatar}</span>
                    </span>
                    <span className="truncate" title={challenge.friend.displayName}>{challenge.friend.displayName}</span>
                  </p>
                </div>
                <div className="text-xs text-right flex-shrink-0 ml-2">
                  <div className={`px-2 py-1 rounded-full ${
                    getDaysRemaining(challenge.expiresAt) <= 2
                      ? 'bg-red-100 text-red-700'
                      : getDaysRemaining(challenge.expiresAt) <= 5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {getDaysRemaining(challenge.expiresAt)} days left
                  </div>
                  <div className="mt-1 text-gray-500">
                    {formatDate(challenge.createdAt)}
                  </div>
                </div>
              </div>
              
              {challenge.type === 'active' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Your progress</span>
                    <span>{challenge.progress.user} / {challenge.goalAmount}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(challenge.progress.user / challenge.goalAmount) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600 mb-1 mt-2">
                    <span>{challenge.friend.displayName}'s progress</span>
                    <span>{challenge.progress.friend} / {challenge.goalAmount}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(challenge.progress.friend / challenge.goalAmount) * 100}%` }}
                    ></div>
                  </div>
                  
                  <button
                    className="mt-3 w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Update Progress
                  </button>
                </div>
              )}
              
              {challenge.type === 'received' && (
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleAcceptChallenge(challenge.id)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineChallenge(challenge.id)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              )}
              
              {challenge.type === 'sent' && (
                <div className="mt-3 text-center text-xs text-gray-500">
                  Waiting for {challenge.friend.displayName} to accept your challenge
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p className="font-medium mb-1">Benefits of Friend Challenges:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Increased accountability with peer support</li>
          <li>Double XP for completing challenges with friends</li>
          <li>Unlock special collaborative badges</li>
          <li>Track your progress against friends for friendly competition</li>
        </ul>
      </div>
    </div>
  );
};

export default FriendChallenges; 