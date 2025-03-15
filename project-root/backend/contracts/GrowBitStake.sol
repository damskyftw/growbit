// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GrowBitStake
 * @dev Contract for staking ETH against personal growth goals
 */
contract GrowBitStake {
    // Struct to track goal information
    struct Goal {
        uint256 id;
        address user;
        string description;
        uint256 stakedAmount;
        uint256 taskCount;
        uint256 completedTaskCount;
        uint256 createdAt;
        uint256 deadline; // Optional deadline
        bool claimed;
    }

    // Contract state variables
    address public owner;
    uint256 public goalIdCounter;
    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;
    mapping(address => bool) public verifiers;
    
    // Events
    event GoalCreated(uint256 indexed goalId, address indexed user, uint256 stakedAmount);
    event TaskCompleted(uint256 indexed goalId, address indexed user, uint256 completedCount, uint256 totalCount);
    event RewardClaimed(uint256 indexed goalId, address indexed user, uint256 amount);
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only authorized verifiers can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true;
        goalIdCounter = 1;
    }

    /**
     * @dev Creates a new goal with staked ETH
     * @param _description Description of the goal
     * @param _taskCount Number of tasks for this goal
     * @param _deadline Optional deadline for the goal (0 for no deadline)
     */
    function createGoal(string memory _description, uint256 _taskCount, uint256 _deadline) external payable {
        require(msg.value > 0, "Must stake some ETH");
        require(_taskCount > 0, "Goal must have at least one task");
        
        uint256 goalId = goalIdCounter;
        goalIdCounter++;
        
        goals[goalId] = Goal({
            id: goalId,
            user: msg.sender,
            description: _description,
            stakedAmount: msg.value,
            taskCount: _taskCount,
            completedTaskCount: 0,
            createdAt: block.timestamp,
            deadline: _deadline,
            claimed: false
        });
        
        userGoals[msg.sender].push(goalId);
        
        emit GoalCreated(goalId, msg.sender, msg.value);
    }

    /**
     * @dev Marks tasks as complete for a goal (can only be called by verifier)
     * @param _goalId ID of the goal
     * @param _completedCount Number of tasks completed
     */
    function completeTask(uint256 _goalId, uint256 _completedCount) external onlyVerifier {
        Goal storage goal = goals[_goalId];
        require(goal.user != address(0), "Goal does not exist");
        require(!goal.claimed, "Goal already claimed");
        require(_completedCount <= goal.taskCount, "Cannot complete more tasks than exist");
        
        goal.completedTaskCount = _completedCount;
        
        emit TaskCompleted(_goalId, goal.user, _completedCount, goal.taskCount);
    }

    /**
     * @dev Claims rewards for a completed goal
     * @param _goalId ID of the goal to claim rewards for
     */
    function claimReward(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(msg.sender == goal.user, "Only goal creator can claim");
        require(goal.completedTaskCount == goal.taskCount, "All tasks must be completed");
        require(!goal.claimed, "Reward already claimed");
        
        goal.claimed = true;
        
        // Calculate reward (base amount is what they staked)
        uint256 rewardAmount = goal.stakedAmount;
        
        // Add bonus from contract if available
        uint256 contractBalance = address(this).balance;
        if (contractBalance > rewardAmount) {
            uint256 bonus = (rewardAmount * 5) / 100; // 5% bonus
            if (bonus <= contractBalance - rewardAmount) {
                rewardAmount += bonus;
            }
        }
        
        emit RewardClaimed(_goalId, msg.sender, rewardAmount);
        
        (bool success, ) = payable(msg.sender).call{value: rewardAmount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Allow goal creator to withdraw if deadline passed without completion
     * @param _goalId ID of the goal
     */
    function withdrawExpiredStake(uint256 _goalId) external {
        Goal storage goal = goals[_goalId];
        require(msg.sender == goal.user, "Only goal creator can withdraw");
        require(goal.deadline > 0, "Goal has no deadline");
        require(block.timestamp > goal.deadline, "Deadline not yet passed");
        require(!goal.claimed, "Reward already claimed");
        
        goal.claimed = true;
        
        // Return only 90% of stake if withdrawn before completion
        uint256 returnAmount = (goal.stakedAmount * 90) / 100;
        
        (bool success, ) = payable(msg.sender).call{value: returnAmount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Add a verifier address
     * @param _verifier Address to add as verifier
     */
    function addVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Invalid address");
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }

    /**
     * @dev Remove a verifier address
     * @param _verifier Address to remove as verifier
     */
    function removeVerifier(address _verifier) external onlyOwner {
        require(verifiers[_verifier], "Not a verifier");
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }

    /**
     * @dev Fund contract with ETH for rewards
     */
    function fundRewards() external payable {
        // Just receive ETH
    }

    /**
     * @dev Get all goals for a user
     * @param _user Address of the user
     * @return Array of goal IDs for the user
     */
    function getUserGoals(address _user) external view returns (uint256[] memory) {
        return userGoals[_user];
    }

    /**
     * @dev Get goal details by ID
     * @param _goalId ID of the goal
     * @return Goal struct with all details
     */
    function getGoalDetails(uint256 _goalId) external view returns (Goal memory) {
        return goals[_goalId];
    }
} 