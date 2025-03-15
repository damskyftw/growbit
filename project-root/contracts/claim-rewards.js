const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Claiming rewards from wallet:", signer.address);
  
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
  console.log(`Staked Amount: ${hre.ethers.formatEther(goal.stakedAmount)} ETH`);
  console.log(`Claimed: ${goal.claimed ? 'Yes' : 'No'}`);
  
  if (goal.claimed) {
    console.log("Rewards already claimed for this goal.");
    return;
  }
  
  if (goal.completedTaskCount < goal.taskCount) {
    console.log("Not all tasks completed yet. Complete all tasks first.");
    return;
  }
  
  // Claim rewards
  console.log(`\nClaiming rewards for goal ID ${goalId}...`);
  const balanceBefore = await signer.provider.getBalance(signer.address);
  
  const tx = await stakeContract.claimReward(goalId);
  console.log(`Transaction hash: ${tx.hash}`);
  const receipt = await tx.wait();
  
  const balanceAfter = await signer.provider.getBalance(signer.address);
  const gasCost = receipt.gasUsed * receipt.gasPrice;
  
  // Calculate net gain (account for gas costs)
  const netGain = balanceAfter - balanceBefore + gasCost;
  
  console.log("Rewards claimed successfully!");
  console.log(`Received approximately: ${hre.ethers.formatEther(netGain)} ETH`);
  
  // Check updated goal status
  const updatedGoal = await stakeContract.getGoalDetails(goalId);
  console.log(`\nUpdated status:`);
  console.log(`Claimed: ${updatedGoal.claimed ? 'Yes' : 'No'}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 