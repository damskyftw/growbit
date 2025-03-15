// API utility functions for GrowBit

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Task {
  id: number;
  goal_id: number;
  description: string;
  status: 'pending' | 'completed' | 'verified';
  created_at: string;
}

export interface Goal {
  id: number;
  user_address: string;
  description: string;
  created_at: string;
  tasks: Task[];
}

// Function to handle errors consistently
const handleError = (error: any, defaultMessage: string) => {
  console.error('API Error:', error);
  if (error.response && error.response.data && error.response.data.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error(defaultMessage);
};

// Check backend health
export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    if (!response.ok) {
      throw new Error('Backend service is unavailable');
    }
    return response.json();
  } catch (error) {
    handleError(error, 'Could not connect to backend service');
    throw error; // This is needed for TypeScript
  }
};

// Get wallet balance
export const getBalance = async (address: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/balance/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    const data = await response.json();
    return data.balance;
  } catch (error) {
    handleError(error, 'Could not fetch wallet balance');
    throw error;
  }
};

// Create a new goal
export const createGoal = async (userAddress: string, description: string): Promise<Goal> => {
  try {
    const response = await fetch(`${API_URL}/api/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAddress, description }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create goal');
    }
    
    return response.json();
  } catch (error) {
    handleError(error, 'Failed to create goal');
    throw error;
  }
};

// Get all goals for a user
export const getUserGoals = async (userAddress: string): Promise<Goal[]> => {
  try {
    const response = await fetch(`${API_URL}/api/goals/${userAddress}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch goals');
    }
    
    const data = await response.json();
    return data.goals || [];
  } catch (error) {
    handleError(error, 'Failed to fetch user goals');
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (
  taskId: number, 
  status: 'pending' | 'completed' | 'verified'
): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }
    
    return response.json();
  } catch (error) {
    handleError(error, 'Failed to update task status');
    throw error;
  }
}; 