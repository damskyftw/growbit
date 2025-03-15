import { useState, useEffect } from 'react';
import Head from 'next/head';
import TokenBalance from '../components/TokenBalance';
import GoalSettingForm from '../components/GoalSettingForm';
import GoalsList from '../components/GoalsList';
import NavTabs from '../components/NavTabs';
import SmartWalletInfo from '../components/SmartWalletInfo';
import ClaimReward from '../components/ClaimReward';
import GrowthDashboard from '../components/GrowthDashboard';
import Leaderboard from '../components/Leaderboard';
import FriendChallenges from '../components/FriendChallenges';
import BadgeCollection from '../components/BadgeCollection';
import GoalsHistory from '../components/GoalsHistory';
import WalletStatus from '../components/WalletStatus';
import ConnectWallet from '../components/ConnectWallet';
import { useAccount } from 'wagmi';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if the backend is running
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        console.error('Error checking backend status:', error);
        setBackendStatus('offline');
      }
    };

    checkBackendStatus();
    // Check backend status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>GrowBit - Achieve Your Goals</title>
        <meta name="description" content="Set growth goals, complete tasks, and earn ETH rewards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-growbit-green">GrowBit</h1>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              backendStatus === 'online' ? 'bg-green-500' : 
              backendStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              Backend: {backendStatus}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {backendStatus === 'offline' ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">
              The backend server is currently offline. Please start the backend server to use all features.
            </p>
          </div>
        ) : null}

        {/* Wallet connection components */}
        <WalletStatus />
        <ConnectWallet />
        
        {isConnected && (
          <div className="mb-6">
            <SmartWalletInfo />
          </div>
        )}

        {/* Desktop View - Two-column layout with 70/30 split */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-7 gap-6">
            {/* Main Content (70%) */}
            <div className="md:col-span-5">
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  {/* Left column for balances and rewards */}
                  <div className="col-span-2">
                    <div className="space-y-6">
                      <TokenBalance />
                      <ClaimReward />
                    </div>
                  </div>
                  
                  {/* Middle/right for dashboard and goal setting */}
                  <div className="col-span-4">
                    <div className="space-y-6">
                      <GrowthDashboard />
                      <GoalSettingForm />
                    </div>
                  </div>
                </div>
                
                {/* Goals list spans full width of main content */}
                <GoalsList />
                <GoalsHistory />
              </div>
            </div>
            
            {/* Community Section (30%) */}
            <div className="md:col-span-2">
              <div className="sticky top-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold mb-4">Community</h2>
                  
                  {/* Improved tab buttons with more space */}
                  <div className="flex border-b mb-4">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex-1 px-2 py-2 text-sm font-medium ${
                        activeTab === 'dashboard' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Badges
                    </button>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className={`flex-1 px-2 py-2 text-sm font-medium ${
                        activeTab === 'leaderboard' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Leaderboard
                    </button>
                    <button
                      onClick={() => setActiveTab('challenges')}
                      className={`flex-1 px-2 py-2 text-sm font-medium ${
                        activeTab === 'challenges' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Challenges
                    </button>
                  </div>
                  
                  {/* Content area with controlled height and scrolling */}
                  <div className="overflow-hidden">
                    {activeTab === 'dashboard' && (
                      <div className="max-h-[600px] overflow-y-auto pr-1">
                        <BadgeCollection />
                      </div>
                    )}
                    {activeTab === 'leaderboard' && (
                      <div className="max-h-[600px] overflow-y-auto pr-1">
                        <Leaderboard />
                      </div>
                    )}
                    {activeTab === 'challenges' && (
                      <div className="max-h-[600px] overflow-y-auto pr-1">
                        <FriendChallenges />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Improved tabbed layout */}
        <div className="md:hidden">
          <NavTabs labels={['Dashboard', 'Goals', 'New Goal', 'Wallet', 'Community']}>
            <div>
              <GrowthDashboard />
            </div>
            <div>
              <GoalsList />
              <div className="mt-6">
                <GoalsHistory />
              </div>
            </div>
            <div>
              <GoalSettingForm />
            </div>
            <div className="space-y-6">
              <TokenBalance />
              <ClaimReward />
              <WalletStatus />
              <ConnectWallet />
            </div>
            {/* Community tab with inner tab navigation */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-semibold mb-4">Community</h2>
                <div className="flex justify-between border-b mb-4">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      activeTab === 'dashboard' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Badges
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      activeTab === 'leaderboard' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      activeTab === 'challenges' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Challenges
                  </button>
                </div>
                
                <div className="overflow-hidden">
                  {activeTab === 'dashboard' && (
                    <div className="max-h-[450px] overflow-y-auto pr-1">
                      <BadgeCollection />
                    </div>
                  )}
                  {activeTab === 'leaderboard' && (
                    <div className="max-h-[450px] overflow-y-auto pr-1">
                      <Leaderboard />
                    </div>
                  )}
                  {activeTab === 'challenges' && (
                    <div className="max-h-[450px] overflow-y-auto pr-1">
                      <FriendChallenges />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </NavTabs>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">
              GrowBit &copy; {new Date().getFullYear()} - Achieve your personal growth goals
            </p>
            <div className="flex mt-4 md:mt-0 space-x-4">
              <a href="#" className="text-gray-400 hover:text-growbit-green">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-growbit-green">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-growbit-green">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 