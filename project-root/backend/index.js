require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { OpenAI } = require('openai');
const path = require('path');

// Import blockchain service
const blockchainService = require('./blockchain');

// Import the AI verification module
const { verifyTaskEvidence } = require('./ai-verification');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Get provider from environment variable or default to Base Sepolia
const PROVIDER_URL = process.env.PROVIDER_URL || 'https://sepolia.base.org';
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize provider and wallet
let provider;
let wallet;

try {
  provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  if (WALLET_PRIVATE_KEY) {
    wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    console.log('Wallet initialized successfully with address:', wallet.address);
  } else {
    console.log('No wallet private key provided. Running with limited functionality.');
  }
} catch (error) {
  console.error('Error initializing provider or wallet:', error);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'growbit.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
    // Create tables if they don't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_address TEXT NOT NULL,
        description TEXT NOT NULL,
        blockchain_goal_id INTEGER,
        blockchain_tx_hash TEXT,
        staked_amount TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT,
        completed_at TEXT,
        evidence TEXT,
        verification_data TEXT,
        FOREIGN KEY (goal_id) REFERENCES goals (id)
      )
    `);
    
    // Check if evidence column exists, add if not
    db.all("PRAGMA table_info(tasks);", (err, rows) => {
      if (err) {
        console.error('Error checking tasks table schema:', err);
        return;
      }
      
      const hasEvidence = rows.some(row => row.name === 'evidence');
      const hasVerificationData = rows.some(row => row.name === 'verification_data');
      
      if (!hasEvidence) {
        db.run("ALTER TABLE tasks ADD COLUMN evidence TEXT", err => {
          if (err) {
            console.error('Error adding evidence column to tasks table:', err);
          } else {
            console.log('Added evidence column to tasks table');
          }
        });
      }
      
      if (!hasVerificationData) {
        db.run("ALTER TABLE tasks ADD COLUMN verification_data TEXT", err => {
          if (err) {
            console.error('Error adding verification_data column to tasks table:', err);
          } else {
            console.log('Added verification_data column to tasks table');
          }
        });
      }
    });
    
    // Check if updated_at and completed_at columns exist, add if not
    db.all("PRAGMA table_info(tasks);", (err, rows) => {
      if (err) {
        console.error('Error checking tasks table schema:', err);
        return;
      }
      
      const hasUpdatedAt = rows.some(row => row.name === 'updated_at');
      const hasCompletedAt = rows.some(row => row.name === 'completed_at');
      
      if (!hasUpdatedAt) {
        db.run("ALTER TABLE tasks ADD COLUMN updated_at TEXT", err => {
          if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding updated_at column to tasks table:', err);
          } else {
            console.log('Added updated_at column to tasks table');
          }
        });
      }
      
      if (!hasCompletedAt) {
        db.run("ALTER TABLE tasks ADD COLUMN completed_at TEXT", err => {
          if (err && !err.message.includes('duplicate column')) {
            console.error('Error adding completed_at column to tasks table:', err);
          } else {
            console.log('Added completed_at column to tasks table');
          }
        });
      }
    });
  }
});

// Helper function to generate tasks using OpenAI
async function generateTasksWithAI(goalDescription) {
  try {
    const prompt = `Given the goal: "${goalDescription}", generate a sequence of 3-5 specific, actionable tasks to achieve it. Format each task as a separate line.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates actionable tasks for personal goals. Create 3-5 specific and measurable tasks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    // Parse tasks from the response
    const tasksText = completion.choices[0].message.content.trim();
    // Split by newlines to get individual tasks
    const tasks = tasksText.split('\n').filter(task => task.trim() !== '');
    
    return tasks;
  } catch (error) {
    console.error('Error generating tasks with AI:', error);
    throw error;
  }
}

// Routes

// Root route to show available endpoints
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>GrowBit API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            color: #3b82f6;
          }
          h2 {
            margin-top: 30px;
            color: #1e40af;
          }
          .endpoint {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            border-left: 4px solid #3b82f6;
          }
          .method {
            font-weight: bold;
            display: inline-block;
            width: 60px;
          }
          .url {
            font-family: monospace;
            background-color: #e2e8f0;
            padding: 2px 5px;
            border-radius: 3px;
          }
          .description {
            margin-top: 5px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <h1>GrowBit API</h1>
        <p>Welcome to the GrowBit API server! Below are the available endpoints:</p>
        
        <h2>Health</h2>
        <div class="endpoint">
          <div><span class="method">GET</span> <span class="url">/api/health</span></div>
          <div class="description">Check if the API server is running</div>
        </div>

        <h2>Wallet</h2>
        <div class="endpoint">
          <div><span class="method">GET</span> <span class="url">/api/wallet/balance</span></div>
          <div class="description">Get the balance of the server's wallet</div>
        </div>
        
        <div class="endpoint">
          <div><span class="method">GET</span> <span class="url">/api/balance/:address</span></div>
          <div class="description">Get the balance of a specific Ethereum address</div>
        </div>
        
        <div class="endpoint">
          <div><span class="method">POST</span> <span class="url">/api/transfer</span></div>
          <div class="description">Transfer ETH to another address</div>
        </div>

        <h2>Goals</h2>
        <div class="endpoint">
          <div><span class="method">POST</span> <span class="url">/api/goals</span></div>
          <div class="description">Create a new goal with AI-generated tasks</div>
        </div>
        
        <div class="endpoint">
          <div><span class="method">GET</span> <span class="url">/api/goals/:userAddress</span></div>
          <div class="description">Get all goals and tasks for a user</div>
        </div>

        <h2>Tasks</h2>
        <div class="endpoint">
          <div><span class="method">PUT</span> <span class="url">/api/tasks/:taskId</span></div>
          <div class="description">Update the status of a task</div>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'online' });
});

// Wallet balance endpoint
app.get('/api/wallet/balance', async (req, res) => {
  try {
    if (!wallet) {
      return res.status(500).json({ error: 'Wallet not initialized' });
    }
    
    const balance = await provider.getBalance(wallet.address);
    
    res.json({
      address: wallet.address,
      balance: ethers.utils.formatEther(balance),
      symbol: 'ETH'
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get balance of a specific address
app.get('/api/balance/:address', async (req, res) => {
  try {
    if (!provider) {
      return res.status(500).json({ error: 'Provider not initialized' });
    }
    
    const { address } = req.params;
    
    if (!ethers.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    const balance = await provider.getBalance(address);
    
    res.json({
      address,
      balance: ethers.utils.formatEther(balance),
      symbol: 'ETH'
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new goal with AI-generated tasks
app.post('/api/goals', async (req, res) => {
  try {
    const { userAddress, description, stakeAmount } = req.body;
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Goal description is required' });
    }
    
    // Store in SQLite database
    db.run(
      'INSERT INTO goals (user_address, description) VALUES (?, ?)',
      [userAddress, description],
      async function(err) {
        if (err) {
          console.error('Error inserting goal:', err);
          return res.status(500).json({ error: 'Failed to create goal' });
        }
        
        const goalId = this.lastID;
        
        try {
          // Generate tasks using AI
          const tasks = await generateTasksWithAI(description);
          
          // Insert tasks into the database
          const insertTasksPromises = tasks.map(taskDescription => {
            return new Promise((resolve, reject) => {
              db.run(
                'INSERT INTO tasks (goal_id, description) VALUES (?, ?)',
                [goalId, taskDescription],
                function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(this.lastID);
                  }
                }
              );
            });
          });
          
          await Promise.all(insertTasksPromises);
          
          // If stakeAmount is provided, create the goal on blockchain too
          let blockchainGoalId = null;
          let blockchainTxHash = null;
          
          if (stakeAmount && blockchainService.isReady() && blockchainService.stakeContract) {
            try {
              // Create goal on blockchain with the task count
              const result = await blockchainService.createGoal(
                userAddress, 
                description, 
                tasks.length, 
                0, // No deadline for now
                stakeAmount
              );
              
              if (result.success) {
                blockchainGoalId = result.goalId;
                blockchainTxHash = result.txHash;
                
                // Update the goal in the database with blockchain info
                db.run(
                  'UPDATE goals SET blockchain_goal_id = ?, blockchain_tx_hash = ?, staked_amount = ? WHERE id = ?',
                  [blockchainGoalId, blockchainTxHash, stakeAmount, goalId]
                );
              }
            } catch (blockchainErr) {
              console.error('Error creating goal on blockchain:', blockchainErr);
              // Continue even if blockchain creation fails
            }
          }
          
          // Return the created goal and tasks
          db.get(
            'SELECT * FROM goals WHERE id = ?',
            [goalId],
            (err, goal) => {
              if (err) {
                console.error('Error retrieving goal:', err);
                return res.status(500).json({ error: 'Failed to retrieve goal' });
              }
              
              db.all(
                'SELECT * FROM tasks WHERE goal_id = ?',
                [goalId],
                (err, tasks) => {
                  if (err) {
                    console.error('Error retrieving tasks:', err);
                    return res.status(500).json({ error: 'Failed to retrieve tasks' });
                  }
                  
                  res.json({
                    goal: {
                      ...goal,
                      blockchain_goal_id: blockchainGoalId,
                      blockchain_tx_hash: blockchainTxHash
                    },
                    tasks
                  });
                }
              );
            }
          );
        } catch (error) {
          console.error('Error generating tasks with AI:', error);
          res.status(500).json({ error: 'Failed to generate tasks with AI' });
        }
      }
    );
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all goals and tasks for a user
app.get('/api/goals/:userAddress', (req, res) => {
  try {
    const { userAddress } = req.params;
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    db.all(
      'SELECT * FROM goals WHERE user_address = ? ORDER BY created_at DESC',
      [userAddress],
      (err, goals) => {
        if (err) {
          console.error('Error retrieving goals:', err);
          return res.status(500).json({ error: 'Failed to retrieve goals' });
        }
        
        // If no goals found, return empty array
        if (!goals || goals.length === 0) {
          return res.json({ goals: [] });
        }
        
        // Get tasks for each goal
        const goalIds = goals.map(goal => goal.id);
        const placeholders = goalIds.map(() => '?').join(',');
        
        db.all(
          `SELECT * FROM tasks WHERE goal_id IN (${placeholders}) ORDER BY created_at ASC`,
          goalIds,
          (err, tasks) => {
            if (err) {
              console.error('Error retrieving tasks:', err);
              return res.status(500).json({ error: 'Failed to retrieve tasks' });
            }
            
            // Group tasks by goal
            const goalsWithTasks = goals.map(goal => {
              const goalTasks = tasks.filter(task => task.goal_id === goal.id);
              return {
                ...goal,
                tasks: goalTasks
              };
            });
            
            res.json({ goals: goalsWithTasks });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error retrieving goals and tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task status
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, evidence } = req.body;
    
    if (!taskId || !status) {
      return res.status(400).json({ error: 'Task ID and status are required' });
    }
    
    if (!['pending', 'completed', 'verified'].includes(status)) {
      return res.status(400).json({ error: 'Status must be one of: pending, completed, verified' });
    }
    
    // If the user is trying to mark a task as completed, require evidence
    if (status === 'completed' && !evidence) {
      return res.status(400).json({ 
        error: 'Evidence is required to mark a task as completed',
        requiresEvidence: true
      });
    }
    
    // Get task details first
    db.get(
      'SELECT t.*, g.blockchain_goal_id, g.user_address FROM tasks t JOIN goals g ON t.goal_id = g.id WHERE t.id = ?',
      [taskId],
      async (err, task) => {
        if (err) {
          console.error('Error retrieving task:', err);
          return res.status(500).json({ error: 'Failed to retrieve task' });
        }
        
        if (!task) {
          return res.status(404).json({ error: 'Task not found' });
        }
        
        // Check if the task is part of a goal with staked ETH
        const hasStake = task.blockchain_goal_id !== null;
        
        // For staked goals, require AI verification of evidence
        let verificationResult = null;
        if (status === 'completed' && hasStake) {
          try {
            verificationResult = await verifyTaskEvidence(task.description, evidence);
            
            // Only allow completion if the AI verifies it
            if (!verificationResult.verified) {
              return res.status(400).json({ 
                error: 'AI verification failed. Please provide better evidence.',
                aiVerification: verificationResult
              });
            }
            
            // Save the verification result
            const verificationJson = JSON.stringify(verificationResult);
            db.run(
              'UPDATE tasks SET verification_data = ? WHERE id = ?',
              [verificationJson, taskId],
              function(err) {
                if (err) {
                  console.error('Error saving verification data:', err);
                }
              }
            );
          } catch (error) {
            console.error('Error during AI verification:', error);
            return res.status(500).json({ error: 'Failed to verify evidence with AI' });
          }
        }
        
        // Set completed_at timestamp if the status is changing to completed
        const now = new Date().toISOString();
        const completed_at = status === 'completed' ? now : null;
        
        // Update the task status and add completed_at timestamp
        db.run(
          'UPDATE tasks SET status = ?, evidence = ?, updated_at = ?, completed_at = ? WHERE id = ?',
          [status, evidence || null, now, completed_at, taskId],
          function(err) {
            if (err) {
              console.error('Error updating task:', err);
              return res.status(500).json({ error: 'Failed to update task' });
            }
            
            if (this.changes === 0) {
              return res.status(404).json({ error: 'Task not found' });
            }
            
            // For completed tasks with blockchain goals, update completion status
            if (status === 'completed' && hasStake) {
              // Check if all tasks for this goal are now completed
              db.get(
                'SELECT g.id, g.blockchain_goal_id, COUNT(t.id) as total_tasks, ' +
                'SUM(CASE WHEN t.status = "completed" OR t.status = "verified" THEN 1 ELSE 0 END) as completed_tasks ' +
                'FROM goals g JOIN tasks t ON g.id = t.goal_id ' +
                'WHERE g.id = ?',
                [task.goal_id],
                async (err, result) => {
                  if (err || !result) {
                    console.error('Error checking goal tasks:', err);
                    return;
                  }
                  
                  // If all tasks are completed, update the blockchain
                  if (result.completed_tasks === result.total_tasks && blockchainService.isReady()) {
                    try {
                      await blockchainService.completeTask(
                        result.blockchain_goal_id, 
                        result.total_tasks
                      );
                      console.log(`Updated blockchain for goal ${result.blockchain_goal_id}: ${result.completed_tasks}/${result.total_tasks} tasks completed`);
                    } catch (error) {
                      console.error('Error updating blockchain task completion:', error);
                    }
                  }
                }
              );
            }
            
            db.get(
              'SELECT * FROM tasks WHERE id = ?',
              [taskId],
              (err, updatedTask) => {
                if (err) {
                  console.error('Error retrieving updated task:', err);
                  return res.status(500).json({ error: 'Failed to retrieve updated task' });
                }
                
                // Add the verification result to the response if available
                const response = { 
                  task: updatedTask,
                  hasStake: hasStake
                };
                
                if (verificationResult) {
                  response.aiVerification = verificationResult;
                }
                
                res.json(response);
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add blockchain-specific API routes
// Get blockchain info
app.get('/api/blockchain/info', (req, res) => {
  try {
    res.json({
      ready: blockchainService.isReady(),
      walletAddress: blockchainService.wallet ? blockchainService.wallet.address : null,
      contracts: {
        stake: blockchainService.addresses.stake || null,
        faucet: blockchainService.addresses.faucet || null
      }
    });
  } catch (error) {
    console.error('Error getting blockchain info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Request ETH from faucet
app.post('/api/blockchain/faucet', async (req, res) => {
  try {
    const { userAddress } = req.body;
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    if (!blockchainService.isReady() || !blockchainService.faucetContract) {
      return res.status(503).json({ error: 'Blockchain service or faucet not available' });
    }
    
    const isEligible = await blockchainService.isEligibleForDrip(userAddress);
    
    if (!isEligible) {
      return res.status(400).json({ 
        error: 'Not eligible for ETH from faucet. Please wait for the cooldown period or try with a different address.' 
      });
    }
    
    const result = await blockchainService.requestDrip(userAddress);
    
    if (result.success) {
      res.json({
        success: true,
        amount: result.amount,
        txHash: result.txHash
      });
    } else {
      res.status(400).json({ 
        error: result.error || 'Failed to send ETH from faucet' 
      });
    }
  } catch (error) {
    console.error('Error requesting ETH from faucet:', error);
    res.status(500).json({ error: error.message });
  }
});

// Claim goal reward
app.post('/api/blockchain/claim-reward', async (req, res) => {
  try {
    const { userAddress, goalId } = req.body;
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }
    
    if (!blockchainService.isReady() || !blockchainService.stakeContract) {
      return res.status(503).json({ error: 'Blockchain service or stake contract not available' });
    }
    
    // Check if all tasks are completed for the goal
    db.get(
      'SELECT g.id, g.blockchain_goal_id, COUNT(t.id) as total_tasks, ' +
      'SUM(CASE WHEN t.status = "completed" OR t.status = "verified" THEN 1 ELSE 0 END) as completed_tasks ' +
      'FROM goals g JOIN tasks t ON g.id = t.goal_id ' +
      'WHERE g.id = ? AND g.user_address = ?',
      [goalId, userAddress],
      async (err, result) => {
        if (err) {
          console.error('Error checking goal tasks:', err);
          return res.status(500).json({ error: 'Failed to check goal tasks' });
        }
        
        if (!result) {
          return res.status(404).json({ error: 'Goal not found' });
        }
        
        if (result.completed_tasks < result.total_tasks) {
          return res.status(400).json({ 
            error: 'Not all tasks are completed. Please complete all tasks before claiming reward.',
            completedTasks: result.completed_tasks,
            totalTasks: result.total_tasks
          });
        }
        
        // If blockchain_goal_id exists, use it. Otherwise use the local goalId
        const blockchainGoalId = result.blockchain_goal_id || goalId;
        
        // Update task completion status in the blockchain
        await blockchainService.completeTask(blockchainGoalId, result.total_tasks);
        
        // Claim reward
        const claimResult = await blockchainService.claimReward(userAddress, blockchainGoalId);
        
        if (claimResult.success) {
          res.json({
            success: true,
            amount: claimResult.amount,
            txHash: claimResult.txHash
          });
        } else {
          res.status(400).json({ 
            error: claimResult.error || 'Failed to claim reward' 
          });
        }
      }
    );
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get blockchain goals for a user
app.get('/api/blockchain/goals/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    if (!blockchainService.isReady() || !blockchainService.stakeContract) {
      return res.status(503).json({ error: 'Blockchain service or stake contract not available' });
    }
    
    const goals = await blockchainService.getUserGoals(userAddress);
    
    res.json({ goals });
  } catch (error) {
    console.error('Error getting blockchain goals:', error);
    res.status(500).json({ error: error.message });
  }
});

// Deploy contracts (admin only)
app.post('/api/blockchain/deploy', async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    // Simple admin authentication (should be improved in production)
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Run the deployment script
    const { exec } = require('child_process');
    exec('npx hardhat run scripts/deploy.js --network baseSepolia', 
      {cwd: __dirname}, 
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Deployment error: ${error}`);
          return res.status(500).json({ error: error.message });
        }
        
        console.log(`Deployment stdout: ${stdout}`);
        
        if (stderr) {
          console.error(`Deployment stderr: ${stderr}`);
        }
        
        // Try to parse contract addresses from stdout
        let stakeAddress = null;
        let faucetAddress = null;
        
        const stakeMatch = stdout.match(/GrowBitStake deployed to: (0x[a-fA-F0-9]{40})/);
        if (stakeMatch && stakeMatch[1]) {
          stakeAddress = stakeMatch[1];
        }
        
        const faucetMatch = stdout.match(/GrowBitFaucet deployed to: (0x[a-fA-F0-9]{40})/);
        if (faucetMatch && faucetMatch[1]) {
          faucetAddress = faucetMatch[1];
        }
        
        // Update the contract addresses in the blockchain service
        if (stakeAddress && faucetAddress) {
          blockchainService.updateContractAddresses(stakeAddress, faucetAddress);
          
          // Update .env file with new contract addresses
          const fs = require('fs');
          const envPath = path.join(__dirname, '.env');
          
          fs.readFile(envPath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading .env file: ${err}`);
              return;
            }
            
            let updatedData = data;
            
            // Update or add STAKE_CONTRACT_ADDRESS
            if (data.includes('STAKE_CONTRACT_ADDRESS=')) {
              updatedData = updatedData.replace(
                /STAKE_CONTRACT_ADDRESS=.*/,
                `STAKE_CONTRACT_ADDRESS=${stakeAddress}`
              );
            } else {
              updatedData += `\nSTAKE_CONTRACT_ADDRESS=${stakeAddress}`;
            }
            
            // Update or add FAUCET_CONTRACT_ADDRESS
            if (data.includes('FAUCET_CONTRACT_ADDRESS=')) {
              updatedData = updatedData.replace(
                /FAUCET_CONTRACT_ADDRESS=.*/,
                `FAUCET_CONTRACT_ADDRESS=${faucetAddress}`
              );
            } else {
              updatedData += `\nFAUCET_CONTRACT_ADDRESS=${faucetAddress}`;
            }
            
            fs.writeFile(envPath, updatedData, 'utf8', (err) => {
              if (err) {
                console.error(`Error writing .env file: ${err}`);
              } else {
                console.log('.env file updated with contract addresses');
              }
            });
          });
        }
        
        res.json({
          success: true,
          stakeAddress,
          faucetAddress,
          output: stdout
        });
      }
    );
  } catch (error) {
    console.error('Error deploying contracts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a goal (only if it doesn't have ETH staked)
app.delete('/api/goals/:goalId', (req, res) => {
  try {
    const { goalId } = req.params;
    const { userAddress } = req.body;
    
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }
    
    if (!ethers.utils.isAddress(userAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    // Check if the goal exists and belongs to the user
    db.get(
      'SELECT * FROM goals WHERE id = ? AND user_address = ?',
      [goalId, userAddress],
      (err, goal) => {
        if (err) {
          console.error('Error retrieving goal:', err);
          return res.status(500).json({ error: 'Failed to retrieve goal' });
        }
        
        if (!goal) {
          return res.status(404).json({ error: 'Goal not found or does not belong to the user' });
        }
        
        // Check if the goal has ETH staked
        if (goal.staked_amount && goal.staked_amount !== '0') {
          return res.status(400).json({ 
            error: 'Cannot delete a goal with ETH staked. Complete all tasks to claim your stake.' 
          });
        }
        
        // Delete the goal and its tasks
        db.run(
          'DELETE FROM tasks WHERE goal_id = ?',
          [goalId],
          (err) => {
            if (err) {
              console.error('Error deleting tasks:', err);
              return res.status(500).json({ error: 'Failed to delete tasks' });
            }
            
            db.run(
              'DELETE FROM goals WHERE id = ?',
              [goalId],
              function(err) {
                if (err) {
                  console.error('Error deleting goal:', err);
                  return res.status(500).json({ error: 'Failed to delete goal' });
                }
                
                if (this.changes === 0) {
                  return res.status(404).json({ error: 'Goal not found' });
                }
                
                res.status(200).json({ success: true });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 