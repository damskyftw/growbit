import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const TransferToken = () => {
  const { isConnected } = useAccount();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !window.ethereum) {
      setError('MetaMask not available or not connected');
      return;
    }

    if (!recipient || !amount) {
      setError('Recipient address and amount are required');
      return;
    }

    // Check if recipient is a valid address
    if (!ethers.utils.isAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      
      // Convert amount to wei (ETH's smallest unit)
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Check if transaction was successful
      if (receipt.status === 1) {
        setSuccessMsg(`Successfully transferred ${amount} ETH to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`);
        
        // Reset form
        setAmount('');
        setRecipient('');
      } else {
        setError('Transaction failed');
      }
    } catch (err: any) {
      console.error('Error transferring ETH:', err);
      setError(err.message || 'Failed to transfer ETH. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="transfer-token">
      <h2>Transfer ETH</h2>
      
      {successMsg && (
        <div className="success-message">{successMsg}</div>
      )}
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount (ETH)</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => {
              // Only allow numbers and decimals
              const value = e.target.value;
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            placeholder="0.0"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="transfer-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Transfer'}
        </button>
      </form>
      
      <style jsx>{`
        .transfer-token {
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 400px;
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.5rem;
          color: #1e293b;
        }
        
        .success-message {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ecfdf5;
          color: #10b981;
          border-radius: 5px;
          border-left: 4px solid #10b981;
        }
        
        .error-message {
          margin-bottom: 15px;
          padding: 10px;
          background-color: #fef2f2;
          color: #ef4444;
          border-radius: 5px;
          border-left: 4px solid #ef4444;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }
        
        input {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }
        
        .transfer-button {
          margin-top: 10px;
          padding: 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .transfer-button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        .transfer-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TransferToken; 