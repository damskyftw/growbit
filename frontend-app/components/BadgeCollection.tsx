import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'special' | 'community';
  achieved: boolean;
  progress?: {
    current: number;
    required: number;
  };
  achievedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const BadgeCollection = () => {
  const { address, isConnected } = useAccount();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'achieved' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Badge['category']>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // Fetch badges data
  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be fetched from the backend
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Create mock badge data with a reduced set of key achievements
        const mockBadges: Badge[] = [
          // Beginner Badges
          {
            id: 'first_goal',
            name: 'Goal Setter',
            description: 'Set your first growth goal',
            icon: '🎯',
            category: 'beginner',
            achieved: true,
            achievedAt: '2025-03-10T10:00:00',
            rarity: 'common',
          },
          {
            id: 'first_stake',
            name: 'Skin in the Game',
            description: 'Stake ETH on a goal for the first time',
            icon: '💰',
            category: 'beginner',
            achieved: true,
            achievedAt: '2025-03-11T09:30:00',
            rarity: 'common',
          },
          
          // Intermediate Badges
          {
            id: 'three_days',
            name: 'Consistency',
            description: 'Complete tasks 3 days in a row',
            icon: '🔥',
            category: 'intermediate',
            achieved: true,
            achievedAt: '2025-03-12T18:00:00',
            rarity: 'uncommon',
          },
          {
            id: 'ten_tasks',
            name: 'Achiever',
            description: 'Complete 10 tasks',
            icon: '🏆',
            category: 'intermediate',
            achieved: false,
            progress: {
              current: 3,
              required: 10,
            },
            rarity: 'uncommon',
          },
          
          // Advanced Badges
          {
            id: 'thirty_day_streak',
            name: 'Habit Builder',
            description: 'Maintain a 30-day completion streak',
            icon: '📈',
            category: 'advanced',
            achieved: false,
            progress: {
              current: 3,
              required: 30,
            },
            rarity: 'rare',
          },
          {
            id: 'eth_master',
            name: 'ETH Master',
            description: 'Successfully claim 1 ETH in total rewards',
            icon: '💎',
            category: 'advanced',
            achieved: false,
            progress: {
              current: 0.05,
              required: 1,
            },
            rarity: 'epic',
          },
          
          // Special Badges
          {
            id: 'early_adopter',
            name: 'Early Adopter',
            description: 'Join GrowBit during its beta phase',
            icon: '🚀',
            category: 'special',
            achieved: true,
            achievedAt: '2025-03-09T15:20:00',
            rarity: 'rare',
          },
          
          // Community Badges
          {
            id: 'first_challenge',
            name: 'Challenger',
            description: 'Complete your first friend challenge',
            icon: '🤝',
            category: 'community',
            achieved: false,
            rarity: 'uncommon',
          },
          {
            id: 'top_performer',
            name: 'Top Performer',
            description: 'Reach the top 10 on the weekly leaderboard',
            icon: '🏅',
            category: 'community',
            achieved: false,
            rarity: 'epic',
          },
        ];
        
        setBadges(mockBadges);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isConnected) {
      fetchBadges();
    }
  }, [isConnected]);
  
  const filteredBadges = badges.filter(badge => {
    // Filter by achievement status
    if (filter === 'achieved' && !badge.achieved) return false;
    if (filter === 'locked' && badge.achieved) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && badge.category !== categoryFilter) return false;
    
    return true;
  });
  
  const badgeCounts = {
    total: badges.length,
    achieved: badges.filter(b => b.achieved).length,
    locked: badges.filter(b => !b.achieved).length,
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not achieved yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getBadgeRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-200 bg-gray-50';
      case 'uncommon':
        return 'border-green-200 bg-green-50';
      case 'rare':
        return 'border-blue-200 bg-blue-50';
      case 'epic':
        return 'border-purple-200 bg-purple-50';
      case 'legendary':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };
  
  const getBadgeRarityTextColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600';
      case 'uncommon':
        return 'text-green-600';
      case 'rare':
        return 'text-blue-600';
      case 'epic':
        return 'text-purple-600';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };
  
  if (!isConnected) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Badge Collection</h2>
        <p className="text-gray-500 text-sm">Connect your wallet to view your badge collection.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Badge Collection</h2>
      
      {/* Badge detail modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Badge Details</h3>
              <button 
                onClick={() => setSelectedBadge(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  selectedBadge.achieved ? getBadgeRarityColor(selectedBadge.rarity) : 'bg-gray-100'
                } border-2 mr-4 overflow-hidden`}>
                  <span className="flex items-center justify-center h-full w-full">{selectedBadge.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{selectedBadge.name}</h4>
                  <div className={`text-xs font-medium ${getBadgeRarityTextColor(selectedBadge.rarity)}`}>
                    {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)} Badge
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedBadge.category.charAt(0).toUpperCase() + selectedBadge.category.slice(1)} Category
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedBadge.description}</p>
              
              {selectedBadge.achieved ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm">
                  <div className="font-medium">Achievement Unlocked!</div>
                  <div className="text-green-600 text-xs mt-1">{formatDate(selectedBadge.achievedAt)}</div>
                </div>
              ) : selectedBadge.progress ? (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{selectedBadge.progress.current} / {selectedBadge.progress.required}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(selectedBadge.progress.current / selectedBadge.progress.required) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-700 text-sm">
                  <div className="font-medium">Not yet achieved</div>
                  <div className="text-gray-500 text-xs mt-1">Complete the requirements to unlock this badge</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Badge Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-blue-50 rounded-md text-center">
          <div className="text-xl font-bold text-blue-600">{badges.filter(b => b.achieved).length}</div>
          <div className="text-sm text-gray-500">Achieved</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-md text-center">
          <div className="text-xl font-bold text-gray-600">{badges.filter(b => !b.achieved).length}</div>
          <div className="text-sm text-gray-500">Locked</div>
        </div>
        <div className="p-3 bg-green-50 rounded-md text-center">
          <div className="text-xl font-bold text-green-600">
            {badges.length > 0 
              ? Math.round((badges.filter(b => b.achieved).length / badges.length) * 100) 
              : 0}%
          </div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2 mb-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } mb-1 mr-1`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('achieved')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'achieved' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } mb-1 mr-1`}
          >
            Achieved
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              filter === 'locked' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } mb-1 mr-1`}
          >
            Locked
          </button>
        </div>
        
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-sm border rounded-md p-1.5"
          >
            <option value="all">All Categories</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="special">Special</option>
            <option value="community">Community</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">Loading badges...</p>
        </div>
      ) : filteredBadges.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">No badges match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredBadges.map((badge) => (
            <div 
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`text-center cursor-pointer p-3 rounded-md border-2 ${
                badge.achieved 
                  ? getBadgeRarityColor(badge.rarity)
                  : 'bg-gray-50 border-gray-200 opacity-70'
              } hover:shadow-md transition-shadow`}
            >
              <div 
                className={`text-2xl mx-auto mb-2 w-14 h-14 flex items-center justify-center rounded-full ${
                  badge.achieved ? 'bg-white' : 'bg-gray-100'
                } overflow-hidden`}
              >
                <span className="flex items-center justify-center h-full w-full">{badge.icon}</span>
              </div>
              <p className="text-sm font-medium mb-1 line-clamp-1" title={badge.name}>
                {badge.name}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1" title={badge.description}>
                {badge.description}
              </p>
              {!badge.achieved && badge.progress && (
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p className="mb-1">Badge Rarity Levels:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-600">Common</span>
          <span className="px-2 py-1 bg-green-50 border border-green-200 rounded-full text-green-600">Uncommon</span>
          <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-600">Rare</span>
          <span className="px-2 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-600">Epic</span>
          <span className="px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-600">Legendary</span>
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection; 