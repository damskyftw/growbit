const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Creating goal from wallet:", signer.address);
  
  // Get the stake contract
  const stakeAddress = "0x9c8cBFf73ABeB918BeF90432e84EA13f5ff4ba6c";
  const stakeABI = require('./artifacts/contracts/GrowBitStake.sol/GrowBitStake.json').abi;
  const stakeContract = new hre.ethers.Contract(stakeAddress, stakeABI, signer);
  
  // Create a new goal with ETH staking
  const goalDescription = "Complete 5 tasks for testing";
  const taskCount = 5;
  const deadline = 0; // No deadline
  const stakeAmount = hre.ethers.parseEther("0.001"); // Stake 0.001 ETH
  
  console.log(`Creating goal "${goalDescription}" with ${taskCount} tasks and staking ${hre.ethers.formatEther(stakeAmount)} ETH...`);
  
  const tx = await stakeContract.createGoal(
    goalDescription,
    taskCount,
    deadline,
    { value: stakeAmount }
  );
  
  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  
  console.log("Goal created successfully!");
  
  // Verify goal creation
  const goalIds = await stakeContract.getUserGoals(signer.address);
  console.log(`You now have ${goalIds.length} goal(s) on the blockchain.`);
  
  // Display goal details
  for (let i = 0; i < goalIds.length; i++) {
    const goalId = goalIds[i];
    const goal = await stakeContract.getGoalDetails(goalId);
    
    console.log(`\nGoal #${i+1} (ID: ${goal.id}):`);
    console.log(`Description: ${goal.description}`);
    console.log(`Staked Amount: ${hre.ethers.formatEther(goal.stakedAmount)} ETH`);
    console.log(`Tasks: ${goal.completedTaskCount}/${goal.taskCount} completed`);
    console.log(`Created At: ${new Date(Number(goal.createdAt) * 1000).toLocaleString()}`);
    console.log(`Claimed: ${goal.claimed ? 'Yes' : 'No'}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 