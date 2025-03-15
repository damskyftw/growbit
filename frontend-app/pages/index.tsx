import { useState, useEffect } from 'react';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import TokenBalance from '../components/TokenBalance';
import GoalSettingForm from '../components/GoalSettingForm';
import GoalsList from '../components/GoalsList';
import NavTabs from '../components/NavTabs';
import SmartWalletInfo from '../components/SmartWalletInfo';
import ClaimReward from '../components/ClaimReward';
import GrowthDashboard from '../components/GrowthDashboard';
import { useAccount } from 'wagmi';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const { isConnected } = useAccount();

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

        <div className="mb-6">
          <WalletConnect />
        </div>
        
        {isConnected && (
          <div className="mb-6">
            <SmartWalletInfo />
          </div>
        )}

        {/* Desktop View - 3 column layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {/* Left Sidebar - Wallet & Rewards */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <TokenBalance />
              <ClaimReward />
            </div>
          </div>
          
          {/* Middle - Goals List */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              <GrowthDashboard />
              <GoalsList />
            </div>
          </div>
          
          {/* Right Sidebar - Goal Form */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <GoalSettingForm />
            </div>
          </div>
        </div>

        {/* Mobile View - Tabbed layout */}
        <div className="md:hidden">
          <NavTabs labels={['Dashboard', 'Goals', 'New Goal', 'Wallet']}>
            <div>
              <GrowthDashboard />
            </div>
            <div>
              <GoalsList />
            </div>
            <div>
              <GoalSettingForm />
            </div>
            <div className="space-y-6">
              <TokenBalance />
              <ClaimReward />
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