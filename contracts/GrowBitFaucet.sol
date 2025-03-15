// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GrowBitFaucet
 * @dev Contract for distributing small amounts of ETH to new users
 */
contract GrowBitFaucet {
    address public owner;
    uint256 public dripsPerUser;
    uint256 public dripAmount;
    uint256 public dripCooldown;
    
    mapping(address => uint256) public lastDripTime;
    
    event DripSent(address indexed recipient, uint256 amount);
    event FaucetFunded(address indexed funder, uint256 amount);
    event DripConfigUpdated(uint256 newAmount, uint256 newCooldown);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(uint256 _dripAmount, uint256 _dripCooldown) {
        owner = msg.sender;
        dripAmount = _dripAmount;
        dripCooldown = _dripCooldown;
        dripsPerUser = 1; // Default is 1 drip per user
    }
    
    /**
     * @dev Request ETH from the faucet
     */
    function requestDrip() external {
        require(address(this).balance >= dripAmount, "Faucet is empty");
        
        // Check if user has exceeded the maximum allowed drips
        uint256 userDrips = (lastDripTime[msg.sender] == 0) ? 0 : 1;
        require(userDrips < dripsPerUser, "Maximum drip limit reached");
        
        // Check if cooldown period has elapsed
        if (lastDripTime[msg.sender] > 0) {
            require(
                block.timestamp >= lastDripTime[msg.sender] + dripCooldown, 
                "Please wait for cooldown period"
            );
        }
        
        // Update last drip time
        lastDripTime[msg.sender] = block.timestamp;
        
        // Send ETH to the user
        (bool success, ) = payable(msg.sender).call{value: dripAmount}("");
        require(success, "Transfer failed");
        
        emit DripSent(msg.sender, dripAmount);
    }
    
    /**
     * @dev Fund the faucet with ETH
     */
    function fundFaucet() external payable {
        require(msg.value > 0, "Must send ETH to fund faucet");
        emit FaucetFunded(msg.sender, msg.value);
    }
    
    /**
     * @dev Update drip configuration
     * @param _dripAmount New amount to send per drip
     * @param _dripCooldown New cooldown period between drips
     */
    function setDripConfig(uint256 _dripAmount, uint256 _dripCooldown) external onlyOwner {
        dripAmount = _dripAmount;
        dripCooldown = _dripCooldown;
        emit DripConfigUpdated(_dripAmount, _dripCooldown);
    }
    
    /**
     * @dev Update maximum drips per user
     * @param _dripsPerUser New maximum drips per user
     */
    function setDripsPerUser(uint256 _dripsPerUser) external onlyOwner {
        dripsPerUser = _dripsPerUser;
    }
    
    /**
     * @dev Allow owner to withdraw ETH if needed
     * @param _amount Amount to withdraw
     */
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Check if a user is eligible for a drip
     * @param _user Address to check
     * @return True if user is eligible for a drip
     */
    function isEligibleForDrip(address _user) external view returns (bool) {
        if (lastDripTime[_user] == 0) {
            return true;
        }
        
        uint256 userDrips = 1; // They've received at least one drip
        
        return (userDrips < dripsPerUser) && 
               (block.timestamp >= lastDripTime[_user] + dripCooldown);
    }
} 