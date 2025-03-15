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
  
  // Check user stats and progress
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isConnected || !address) return;
      
      try {
        // In a real app, fetch this from the backend
        // For now, we'll simulate with some sample data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/${address}`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Count completed tasks
        let completedCount = 0;
        data.goals?.forEach((goal: any) => {
          goal.tasks?.forEach((task: any) => {
            if (task.status === 'completed') {
              completedCount++;
            }
          });
        });
        
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
          return badge;
        });
        
        setUserStats({
          level,
          xp,
          xpToNextLevel,
          completedTasks: completedCount,
          streak: 3, // Simulated for demo
          badges: updatedBadges,
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    };
    
    fetchUserStats();
  }, [address, isConnected]);
  
  if (!isConnected) {
    return null;
  }
  
  const xpPercentage = (userStats.xp % 100) / 100 * 100;
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Your Growth Journey</h2>
      
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
          <p className="text-2xl font-bold text-blue-500">{userStats.badges.filter(b => b.achieved).length}</p>
          <p className="text-xs text-gray-500">Badges Earned</p>
        </div>
      </div>
      
      {/* Badges */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Your Badges</h3>
        <div className="grid grid-cols-5 gap-2">
          {userStats.badges.map(badge => (
            <div 
              key={badge.id} 
              className={`text-center ${!badge.achieved ? 'opacity-40' : ''}`}
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
    </div>
  );
};

export default GrowthDashboard; 