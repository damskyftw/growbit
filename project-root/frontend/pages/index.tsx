import type { NextPage } from 'next'
import Head from 'next/head'
import WalletConnect from '../components/WalletConnect'
import TokenBalance from '../components/TokenBalance'
import TransferToken from '../components/TransferToken'
import GoalSettingForm from '../components/GoalSettingForm'
import GoalsList from '../components/GoalsList'
import { useAccount } from 'wagmi'
import { useState } from 'react'

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'eth' | 'goals'>('eth');

  return (
    <div className="container">
      <Head>
        <title>GrowBit Platform</title>
        <meta name="description" content="GrowBit - Web3 Personal Growth Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          GrowBit Platform
        </h1>

        <p className="description">
          Connect your wallet to manage your ETH and track your personal growth
        </p>

        <div className="wallet-section">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'eth' ? 'active' : ''}`}
                onClick={() => setActiveTab('eth')}
              >
                ETH Dashboard
              </button>
              <button 
                className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveTab('goals')}
              >
                Growth Goals
              </button>
            </div>
            
            <div className="dashboard-section">
              {activeTab === 'eth' ? (
                <>
                  <TokenBalance />
                  <TransferToken />
                </>
              ) : (
                <>
                  <GoalSettingForm />
                  <GoalsList />
                </>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>
          Powered by Base Sepolia and OpenAI
        </p>
      </footer>

      <style jsx>{`
        .container {
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
        }
        
        .description {
          text-align: center;
          margin: 1rem 0;
          line-height: 1.5;
          font-size: 1.25rem;
        }
        
        .wallet-section {
          margin: 2rem 0;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
          width: 100%;
          max-width: 600px;
        }
        
        .tab {
          padding: 0.75rem 2rem;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        
        .tab.active {
          color: #3b82f6;
        }
        
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #3b82f6;
        }
        
        .tab:hover {
          color: #3b82f6;
        }
        
        .dashboard-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        
        .footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .footer p {
          color: #718096;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}

export default Home 