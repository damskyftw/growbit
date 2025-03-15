const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Completing tasks from wallet:", signer.address);
  
  // Get the stake contract
  const stakeAddress = "0x9c8cBFf73ABeB918BeF90432e84EA13f5ff4ba6c";
  const stakeABI = require('./artifacts/contracts/GrowBitStake.sol/GrowBitStake.json').abi;
  const stakeContract = new hre.ethers.Contract(stakeAddress, stakeABI, signer);
  
  // Get all goals for the user
  const goalIds = await stakeContract.getUserGoals(signer.address);
  console.log(`Found ${goalIds.length} goals on the blockchain.`);
  
  if (goalIds.length === 0) {
    console.log("No goals found. Please create a goal first.");
    return;
  }
  
  // Get the first goal
  const goalId = goalIds[0];
  const goal = await stakeContract.getGoalDetails(goalId);
  
  console.log(`\nGoal (ID: ${goal.id}):`);
  console.log(`Description: ${goal.description}`);
  console.log(`Tasks: ${goal.completedTaskCount}/${goal.taskCount} completed`);
  
  // Update task completion - this would normally be done by the backend after AI verification
  console.log(`\nMarking all ${goal.taskCount} tasks as completed...`);
  const tx = await stakeContract.completeTask(goalId, goal.taskCount);
  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  
  console.log("Tasks marked as completed!");
  
  // Check updated goal status
  const updatedGoal = await stakeContract.getGoalDetails(goalId);
  console.log(`\nUpdated status:`);
  console.log(`Tasks: ${updatedGoal.completedTaskCount}/${updatedGoal.taskCount} completed`);
  console.log(`All tasks completed: ${updatedGoal.completedTaskCount === updatedGoal.taskCount ? 'Yes' : 'No'}`);
  console.log(`Ready to claim reward: ${updatedGoal.completedTaskCount === updatedGoal.taskCount ? 'Yes' : 'No'}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 