import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedTasks: number;
  streak: number;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
  }[];
}

interface Task {
  id: number;
  status: string;
  completed_at?: string;
}

interface Goal {
  id: number;
  tasks: Task[];
}

const GrowthDashboard = () => {
  const { address, isConnected } = useAccount();
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    completedTasks: 0,
    streak: 0,
    badges: [
      {
        id: 'first_goal',
        name: 'Goal Setter',
        description: 'Set your first growth goal',
        icon: '🎯',
        achieved: false,
      },
      {
        id: 'first_completion',
        name: 'Task Master',
        description: 'Complete your first task',
        icon: '✅',
        achieved: false,
      },
      {
        id: 'three_days',
        name: 'Consistency',
        description: 'Complete tasks 3 days in a row',
        icon: '🔥',
        achieved: false,
      },
      {
        id: 'level_5',
        name: 'Growth Enthusiast',
        description: 'Reach Level 5',
        icon: '⭐',
        achieved: false,
      },
      {
        id: 'ten_tasks',
        name: 'Achiever',
        description: 'Complete 10 tasks',
        icon: '🏆',
        achieved: false,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reset stats when wallet changes
  useEffect(() => {
    if (isConnected && address) {
      // Reset stats when the wallet address changes
      setUserStats({
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        completedTasks: 0,
        streak: 0,
        badges: userStats.badges.map(badge => ({ ...badge, achieved: false })),
      });
      setIsLoading(true);
      setError(null);
    }
  }, [address, isConnected]);
  
  // Check user stats and progress
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isConnected || !address) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if backend is available
        const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        }).catch(() => null);
        
        if (!healthCheck || !healthCheck.ok) {
          setError('Backend service is unavailable. Progress data cannot be loaded.');
          setIsLoading(false);
          return;
        }
        
        // Fetch goals data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${address}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch user goals');
        }
        
        const data = await response.json();
        
        // Handle case where the user has no goals yet
        if (!data.goals || data.goals.length === 0) {
          // For a brand new user, keep default values (all zeros)
          setIsLoading(false);
          return;
        }
        
        // Count completed tasks and gather their completion dates
        let completedCount = 0;
        const completedDates: Date[] = [];
        
        data.goals?.forEach((goal: Goal) => {
          goal.tasks?.forEach((task: Task) => {
            if (task.status === 'completed') {
              completedCount++;
              // If there's a completed_at date, use it
              if (task.completed_at) {
                completedDates.push(new Date(task.completed_at));
              } else {
                // If no completed_at field, we'll use the current date
                // This is a fallback - ideally all completed tasks should have this field
                completedDates.push(new Date());
              }
            }
          });
        });
        
        // Sort dates from newest to oldest
        completedDates.sort((a, b) => b.getTime() - a.getTime());
        
        // Calculate streak based on daily task completions
        let streak = 0;
        
        if (completedDates.length > 0) {
          // Start with 1 for today if there's at least one completed task
          streak = 1;
          
          // Create a date for comparison, starting with the most recent completed task
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Check if the most recent task was completed today
          const mostRecentDate = new Date(completedDates[0]);
          mostRecentDate.setHours(0, 0, 0, 0);
          
          // If the most recent task wasn't completed today, we don't have a current streak
          if (mostRecentDate.getTime() !== today.getTime()) {
            streak = 0;
          }
          
          // Now check for consecutive days before today
          if (streak > 0) {
            // Get unique dates (we only care if at least one task was completed each day)
            const uniqueDates = completedDates.map(date => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d.getTime();
            }).filter((date, index, self) => self.indexOf(date) === index);
            
            // For each previous day, check if there was a task completed
            let checkDate = new Date(today);
            
            while (true) {
              // Move to the previous day
              checkDate.setDate(checkDate.getDate() - 1);
              checkDate.setHours(0, 0, 0, 0);
              
              // Check if there was a task completed on this day
              if (uniqueDates.includes(checkDate.getTime())) {
                streak++;
              } else {
                // Break the streak when we find a day with no completions
                break;
              }
            }
          }
        }
        
        // Demo calculation of XP and level
        const xp = completedCount * 25; // 25 XP per completed task
        const level = Math.floor(xp / 100) + 1;
        const xpToNextLevel = (level * 100) - xp;
        
        // Update badges based on progress
        const hasGoals = data.goals?.length > 0;
        const hasCompletedTasks = completedCount > 0;
        
        const updatedBadges = userStats.badges.map(badge => {
          if (badge.id === 'first_goal' && hasGoals) {
            return { ...badge, achieved: true };
          }
          if (badge.id === 'first_completion' && hasCompletedTasks) {
            return { ...badge, achieved: true };
          }
          if (badge.id === 'ten_tasks' && completedCount >= 10) {
            return { ...badge, achieved: true };
          }
          if (badge.id === 'level_5' && level >= 5) {
            return { ...badge, achieved: true };
          }
          // Update the streak badge
          if (badge.id === 'three_days' && streak >= 3) {
            return { ...badge, achieved: true };
          }
          return badge;
        });
        
        setUserStats({
          level,
          xp,
          xpToNextLevel,
          completedTasks: completedCount,
          streak: streak,
          badges: updatedBadges,
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load your progress data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [address, isConnected]);
  
  if (!isConnected) {
    return null;
  }
  
  const xpPercentage = (userStats.xp % 100) / 100 * 100;
  const earnedBadgesCount = userStats.badges.filter(b => b.achieved).length;
  const totalBadgesCount = userStats.badges.length;
  const completionPercentage = totalBadgesCount > 0 
    ? Math.round((earnedBadgesCount / totalBadgesCount) * 100) 
    : 0;
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Your Growth Journey</h2>
      
      {isLoading ? (
        <div className="py-10 flex justify-center">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="py-6 text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center">
                <div className="bg-growbit-green text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
                  {userStats.level}
                </div>
                <div>
                  <p className="font-medium">Level {userStats.level}</p>
                  <p className="text-xs text-gray-500">{userStats.xpToNextLevel} XP to next level</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">🔥</span>
              <span className="font-medium">{userStats.streak} day streak</span>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>XP Progress</span>
              <span>{userStats.xp % 100}/100</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 w-full">
              <div 
                className="bg-growbit-green h-2.5 rounded-full" 
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-2xl font-bold text-growbit-green">{userStats.completedTasks}</p>
              <p className="text-xs text-gray-500">Tasks Completed</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-2xl font-bold text-blue-500">{earnedBadgesCount}</p>
              <p className="text-xs text-gray-500">Badges Earned</p>
            </div>
          </div>
          
          {/* Badges */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Your Badges</h3>
              <span className="text-xs text-gray-500">{completionPercentage}% Complete</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {userStats.badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`text-center ${!badge.achieved ? 'opacity-40' : ''}`}
                  title={badge.description}
                >
                  <div 
                    className={`text-2xl mx-auto mb-1 w-10 h-10 flex items-center justify-center rounded-full ${
                      badge.achieved ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <p className="text-xs font-medium truncate" title={badge.name}>
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Features Teaser */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Coming Soon</h3>
            <div className="flex space-x-2">
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">🏆 Leaderboards</div>
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">👥 Friend Challenges</div>
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">🎁 NFT Rewards</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GrowthDashboard; 