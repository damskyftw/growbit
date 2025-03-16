import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface LeaderboardUser {
  address: string;
  displayName: string;
  avatar: string;
  score: number;
  streak: number;
  level: number;
  position?: number;
}

const Leaderboard = () => {
  const { address, isConnected } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  
  // Reset leaderboard data when wallet changes
  useEffect(() => {
    if (isConnected && address) {
      // Reset data when the wallet address changes
      setLeaderboardData([]);
      setUserRank(null);
      setLoading(true);
      setError(null);
    }
  }, [address, isConnected]);
  
  // Simulate fetching leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!isConnected || !address) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Check if backend is available
        const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        }).catch(() => null);
        
        if (!healthCheck || !healthCheck.ok) {
          setError('Backend service is unavailable. Leaderboard data cannot be loaded.');
          setLoading(false);
          return;
        }
        
        // In a production app, this would be fetched from the backend
        // For now, we'll use mock data with empty/default values for new users
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock data
        const mockData: LeaderboardUser[] = [
          {
            address: '0x8923...1234',
            displayName: 'GrowthMaster',
            avatar: '👨‍💻',
            score: 1250,
            streak: 15,
            level: 8,
          },
          {
            address: '0x7772...9876',
            displayName: 'AchievementHunter',
            avatar: '🏆',
            score: 1050,
            streak: 12,
            level: 7,
          },
          {
            address: '0x5544...5431',
            displayName: 'ConsistencyQueen',
            avatar: '👸',
            score: 980,
            streak: 20,
            level: 6,
          },
          {
            address: '0x3322...8765',
            displayName: 'GoalDigger',
            avatar: '🚀',
            score: 920,
            streak: 8,
            level: 6,
          },
          {
            address: '0x1199...5544',
            displayName: 'TaskMaster',
            avatar: '🧠',
            score: 890,
            streak: 9,
            level: 5,
          },
          {
            address: '0x9900...1122',
            displayName: 'GrowthJourney',
            avatar: '🌱',
            score: 850,
            streak: 7,
            level: 5,
          },
          {
            address: '0x8877...3344',
            displayName: 'FocusedMind',
            avatar: '🧘',
            score: 800,
            streak: 10,
            level: 4,
          },
          {
            address: '0x5566...7788',
            displayName: 'StreakKeeper',
            avatar: '🔥',
            score: 750,
            streak: 14,
            level: 4,
          },
          {
            address: '0x1122...3344',
            displayName: 'GoalAchiever',
            avatar: '🎯',
            score: 700,
            streak: 6,
            level: 3,
          },
          {
            address: '0x9988...7766',
            displayName: 'GrowthHacker',
            avatar: '💻',
            score: 650,
            streak: 5,
            level: 3,
          },
        ];
        
        // Add the current user to a proper position using consistent logic
        // For a new address, start them at position 40
        if (isConnected && address) {
          const userPosition = 40; // New users will start at position 40
          const userScore = 50; // New users will start with 50 points
          
          const userData: LeaderboardUser = {
            address: address,
            displayName: 'You',
            avatar: '😎',
            score: userScore,
            streak: 0,
            level: 1,
            position: userPosition,
          };
          
          setUserRank(userData);
        }
        
        // Add position numbers to the leaderboard entries
        const dataWithPositions = mockData.map((user, index) => ({
          ...user,
          position: index + 1
        }));
        
        setLeaderboardData(dataWithPositions);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isConnected && address) {
      fetchLeaderboard();
    }
  }, [address, isConnected, timeFrame]);
  
  if (!isConnected) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Community Leaderboard</h2>
        <p className="text-gray-500 text-sm">Connect your wallet to view the leaderboard and see your ranking.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Community Leaderboard</h2>
        
        {/* Time frame selector */}
        <div className="flex text-sm border rounded-md overflow-hidden">
          <button
            onClick={() => setTimeFrame('weekly')}
            className={`px-3 py-1 ${timeFrame === 'weekly' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFrame('monthly')}
            className={`px-3 py-1 border-l ${timeFrame === 'monthly' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFrame('allTime')}
            className={`px-3 py-1 border-l ${timeFrame === 'allTime' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="py-6 text-center text-red-500 mb-4">{error}</div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Top users list */}
          <div className="divide-y">
            {leaderboardData.map((user) => (
              <div 
                key={user.address} 
                className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md px-2"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full mr-2 ${
                    user.position === 1 ? 'bg-yellow-100 text-yellow-600' :
                    user.position === 2 ? 'bg-gray-200 text-gray-600' :
                    user.position === 3 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {user.position}
                  </div>
                  <div className="flex items-center min-w-0">
                    <div className="w-9 h-9 flex-shrink-0 mr-2 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
                      <span className="text-xl">{user.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate max-w-[120px]" title={user.displayName}>
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]" title={user.address}>
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end ml-2 space-x-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-yellow-500">
                      <span className="mr-1">🔥</span>
                      <span className="text-xs font-medium whitespace-nowrap">{user.streak} streak</span>
                    </div>
                    <div className="text-xs text-blue-600 whitespace-nowrap">Level {user.level}</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-bold text-sm">{user.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Current user's position if not in top 10 */}
          {userRank && userRank.position && userRank.position > leaderboardData.length && (
            <>
              <div className="my-2 border-t border-dashed pt-2 text-xs text-center text-gray-400">
                • • •
              </div>
              <div className="py-3 flex items-center justify-between bg-blue-50 rounded-md px-2">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full mr-2 bg-blue-100 text-blue-600">
                    {userRank.position}
                  </div>
                  <div className="flex items-center min-w-0">
                    <div className="w-9 h-9 flex-shrink-0 mr-2 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center overflow-hidden">
                      <span className="text-xl">{userRank.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{userRank.displayName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[120px]" title={userRank.address}>
                        {userRank.address.substring(0, 6)}...{userRank.address.substring(userRank.address.length - 4)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end ml-2 space-x-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-yellow-500">
                      <span className="mr-1">🔥</span>
                      <span className="text-xs font-medium whitespace-nowrap">{userRank.streak} streak</span>
                    </div>
                    <div className="text-xs text-blue-600 whitespace-nowrap">Level {userRank.level}</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-bold text-sm">{userRank.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* How points are calculated */}
          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <p className="font-medium mb-1">How points are calculated:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Complete a task: +25 points</li>
              <li>Complete a staked goal: +100 points</li>
              <li>Daily streak: +10 points per day</li>
              <li>Earning badges: +50 points each</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard; 