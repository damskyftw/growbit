// Script to deploy the GrowBit smart contracts
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy GrowBitStake contract
  const GrowBitStake = await ethers.getContractFactory("GrowBitStake");
  const growBitStake = await GrowBitStake.deploy();
  await growBitStake.deployed();
  console.log("GrowBitStake deployed to:", growBitStake.address);

  // Deploy GrowBitFaucet contract with parameters:
  // 0.01 ETH drip amount and 1 day cooldown
  const dripAmount = ethers.utils.parseEther("0.01"); // 0.01 ETH
  const dripCooldown = 24 * 60 * 60; // 1 day in seconds
  
  const GrowBitFaucet = await ethers.getContractFactory("GrowBitFaucet");
  const growBitFaucet = await GrowBitFaucet.deploy(dripAmount, dripCooldown);
  await growBitFaucet.deployed();
  console.log("GrowBitFaucet deployed to:", growBitFaucet.address);

  // Fund the faucet with some initial ETH (if deployer has funds)
  const faucetFunding = ethers.utils.parseEther("0.1"); // Fund with 0.1 ETH
  const deployerBalance = await deployer.getBalance();
  
  if (deployerBalance.gt(faucetFunding.add(ethers.utils.parseEther("0.05")))) {
    console.log(`Funding the faucet with ${ethers.utils.formatEther(faucetFunding)} ETH...`);
    const fundTx = await deployer.sendTransaction({
      to: growBitFaucet.address,
      value: faucetFunding
    });
    await fundTx.wait();
    console.log("Faucet funded successfully!");
  } else {
    console.log("Deployer doesn't have enough ETH to fund the faucet automatically.");
    console.log("Please fund the faucet manually after deployment.");
  }

  // Return the contract addresses for use in the app
  return {
    growBitStakeAddress: growBitStake.address,
    growBitFaucetAddress: growBitFaucet.address
  };
}

// Execute deployment
main()
  .then((addresses) => {
    console.log("Deployment complete!");
    console.log("Contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 