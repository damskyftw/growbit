// Blockchain service for interacting with smart contracts
const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABIs (will be populated after deployment)
const GrowBitStakeABI = require('./artifacts/contracts/GrowBitStake.sol/GrowBitStake.json').abi;
const GrowBitFaucetABI = require('./artifacts/contracts/GrowBitFaucet.sol/GrowBitFaucet.json').abi;

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.stakeContract = null;
    this.faucetContract = null;
    this.ready = false;
    this.addresses = {
      stake: process.env.STAKE_CONTRACT_ADDRESS || '',
      faucet: process.env.FAUCET_CONTRACT_ADDRESS || ''
    };
    
    this.initialize();
  }
  
  async initialize() {
    try {
      // Initialize the provider with Base Sepolia
      this.provider = new ethers.providers.JsonRpcProvider(
        process.env.PROVIDER_URL || 'https://sepolia.base.org'
      );
      
      // Initialize the wallet
      if (process.env.WALLET_PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, this.provider);
        console.log(`Blockchain wallet initialized with address: ${this.wallet.address}`);
      } else {
        console.error('No private key found in environment variables');
        return;
      }
      
      // Initialize contracts if addresses are available
      if (this.addresses.stake) {
        this.stakeContract = new ethers.Contract(
          this.addresses.stake,
          GrowBitStakeABI,
          this.wallet
        );
        console.log(`GrowBitStake contract initialized at ${this.addresses.stake}`);
      } else {
        console.warn('No stake contract address provided. Contract not initialized.');
      }
      
      if (this.addresses.faucet) {
        this.faucetContract = new ethers.Contract(
          this.addresses.faucet,
          GrowBitFaucetABI,
          this.wallet
        );
        console.log(`GrowBitFaucet contract initialized at ${this.addresses.faucet}`);
      } else {
        console.warn('No faucet contract address provided. Contract not initialized.');
      }
      
      this.ready = !!(this.wallet && (this.stakeContract || this.faucetContract));
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      this.ready = false;
    }
  }
  
  // Update contract addresses (e.g., after deployment)
  updateContractAddresses(stakeAddress, faucetAddress) {
    if (stakeAddress) {
      this.addresses.stake = stakeAddress;
      this.stakeContract = new ethers.Contract(
        stakeAddress,
        GrowBitStakeABI,
        this.wallet
      );
      console.log(`GrowBitStake contract updated to ${stakeAddress}`);
    }
    
    if (faucetAddress) {
      this.addresses.faucet = faucetAddress;
      this.faucetContract = new ethers.Contract(
        faucetAddress,
        GrowBitFaucetABI,
        this.wallet
      );
      console.log(`GrowBitFaucet contract updated to ${faucetAddress}`);
    }
    
    this.ready = !!(this.wallet && (this.stakeContract || this.faucetContract));
  }
  
  isReady() {
    return this.ready;
  }
  
  async getWalletBalance() {
    if (!this.wallet) throw new Error('Wallet not initialized');
    const balance = await this.wallet.getBalance();
    return ethers.utils.formatEther(balance);
  }
  
  // Stake Contract Methods
  
  async createGoal(userAddress, description, taskCount, deadline = 0, stakeAmount) {
    if (!this.stakeContract) throw new Error('Stake contract not initialized');
    
    try {
      // The contract owner creates the goal on behalf of the user (for demo purposes)
      // In a real app, the user would interact directly with the contract
      const tx = await this.stakeContract.createGoal(
        description,
        taskCount,
        deadline,
        { value: ethers.utils.parseEther(stakeAmount.toString()) }
      );
      
      const receipt = await tx.wait();
      console.log(`Goal created with tx: ${receipt.transactionHash}`);
      
      // Extract the goal ID from the event
      const event = receipt.events.find(e => e.event === 'GoalCreated');
      const goalId = event.args.goalId.toNumber();
      
      return { 
        success: true, 
        goalId,
        txHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async completeTask(goalId, completedCount) {
    if (!this.stakeContract) throw new Error('Stake contract not initialized');
    
    try {
      // Mark tasks as completed in the contract
      const tx = await this.stakeContract.completeTask(goalId, completedCount);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.transactionHash
      };
    } catch (error) {
      console.error(`Error marking tasks as complete for goal ${goalId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async claimReward(userAddress, goalId) {
    if (!this.stakeContract) throw new Error('Stake contract not initialized');
    
    try {
      // For demo purposes, we'll allow the backend to claim on behalf of the user
      // In a real app, the user would call this directly from their wallet
      const goalDetails = await this.stakeContract.getGoalDetails(goalId);
      
      if (goalDetails.user.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error('Only the goal creator can claim rewards');
      }
      
      if (goalDetails.completedTaskCount != goalDetails.taskCount) {
        throw new Error('All tasks must be completed before claiming');
      }
      
      if (goalDetails.claimed) {
        throw new Error('Reward already claimed');
      }
      
      const tx = await this.stakeContract.claimReward(goalId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.transactionHash,
        amount: ethers.utils.formatEther(goalDetails.stakedAmount)
      };
    } catch (error) {
      console.error(`Error claiming reward for goal ${goalId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getGoalDetails(goalId) {
    if (!this.stakeContract) throw new Error('Stake contract not initialized');
    
    try {
      const goal = await this.stakeContract.getGoalDetails(goalId);
      
      return {
        id: goal.id.toNumber(),
        user: goal.user,
        description: goal.description,
        stakedAmount: ethers.utils.formatEther(goal.stakedAmount),
        taskCount: goal.taskCount.toNumber(),
        completedTaskCount: goal.completedTaskCount.toNumber(),
        createdAt: new Date(goal.createdAt.toNumber() * 1000),
        deadline: goal.deadline.toNumber() ? new Date(goal.deadline.toNumber() * 1000) : null,
        claimed: goal.claimed
      };
    } catch (error) {
      console.error(`Error getting goal details for goal ${goalId}:`, error);
      return null;
    }
  }
  
  async getUserGoals(userAddress) {
    if (!this.stakeContract) throw new Error('Stake contract not initialized');
    
    try {
      const goalIds = await this.stakeContract.getUserGoals(userAddress);
      const goals = [];
      
      for (const goalId of goalIds) {
        const goal = await this.getGoalDetails(goalId.toNumber());
        if (goal) goals.push(goal);
      }
      
      return goals;
    } catch (error) {
      console.error(`Error getting goals for user ${userAddress}:`, error);
      return [];
    }
  }
  
  // Faucet Contract Methods
  
  async requestDrip(userAddress) {
    if (!this.faucetContract) throw new Error('Faucet contract not initialized');
    
    try {
      // Check if user is eligible
      const isEligible = await this.faucetContract.isEligibleForDrip(userAddress);
      
      if (!isEligible) {
        return {
          success: false,
          error: 'User is not eligible for a drip. Please check cooldown period or limit.'
        };
      }
      
      // Send the drip
      const dripAmount = await this.faucetContract.dripAmount();
      
      // For demo purposes, we'll send ETH directly from our wallet
      // In a real app, the user would need to call the faucet contract themselves
      const tx = await this.wallet.sendTransaction({
        to: userAddress,
        value: dripAmount
      });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.transactionHash,
        amount: ethers.utils.formatEther(dripAmount)
      };
    } catch (error) {
      console.error(`Error sending drip to ${userAddress}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async isEligibleForDrip(userAddress) {
    if (!this.faucetContract) throw new Error('Faucet contract not initialized');
    
    try {
      return await this.faucetContract.isEligibleForDrip(userAddress);
    } catch (error) {
      console.error(`Error checking drip eligibility for ${userAddress}:`, error);
      return false;
    }
  }
}

module.exports = new BlockchainService(); 