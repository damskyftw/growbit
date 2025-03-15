import { useState } from 'react';
import { useAccount } from 'wagmi';

const SmartWalletInfo = () => {
  const { connector } = useAccount();
  const [expanded, setExpanded] = useState(false);
  
  // Determine if using a smart wallet
  const isSmartWallet = connector?.id === 'coinbaseWallet';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Smart Wallet Support</h2>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-500 text-sm hover:underline"
        >
          {expanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>
      
      <div className={`${expanded ? 'block' : 'hidden'}`}>
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="font-medium text-blue-800 mb-2">What is a Smart Wallet?</h3>
          <p className="text-sm text-blue-700">
            Smart wallets use account abstraction (ERC-4337) to provide enhanced features beyond 
            traditional Ethereum wallets. With GrowBit, these features include:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
            <li>Gas-free reward claims (paid by GrowBit)</li>
            <li>Simplified transaction approvals</li>
            <li>Enhanced security features</li>
            <li>Better recovery options</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-green-200 rounded-md p-3 bg-green-50">
            <h4 className="font-medium text-green-800 mb-1">Smart Wallet</h4>
            <p className="text-xs text-green-700">Coinbase Wallet on Base Sepolia</p>
            <ul className="mt-2 text-xs text-green-800 space-y-1">
              <li>✅ Gas-free reward claims</li>
              <li>✅ Batched transactions</li>
              <li>✅ Enhanced security</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-1">Standard Wallet</h4>
            <p className="text-xs text-gray-700">MetaMask, Rabby Wallet, etc.</p>
            <ul className="mt-2 text-xs text-gray-800 space-y-1">
              <li>❌ Requires gas for all operations</li>
              <li>❌ Single transactions only</li>
              <li>✅ Widely available</li>
            </ul>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          GrowBit supports both wallet types, but you'll enjoy enhanced features when using 
          Coinbase Wallet with its smart wallet capabilities on Base Sepolia.
        </p>
      </div>
      
      <div className={`${expanded ? 'hidden' : 'block'}`}>
        <p className="text-sm text-gray-700">
          {isSmartWallet 
            ? "You're currently using a smart wallet! This means you can claim rewards without paying gas fees." 
            : "Connect with Coinbase Wallet to utilize smart wallet features including gas-free reward claims."}
        </p>
      </div>
    </div>
  );
};

export default SmartWalletInfo; 