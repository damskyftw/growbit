// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy GrowBitStake contract
  console.log("Deploying GrowBitStake...");
  const GrowBitStake = await hre.ethers.getContractFactory("GrowBitStake");
  const growBitStake = await GrowBitStake.deploy();
  await growBitStake.waitForDeployment();
  const growBitStakeAddress = await growBitStake.getAddress();
  console.log("GrowBitStake deployed to:", growBitStakeAddress);

  // Deploy GrowBitFaucet contract with parameters:
  // 0.01 ETH drip amount and 1 day cooldown
  console.log("Deploying GrowBitFaucet...");
  const dripAmount = hre.ethers.parseEther("0.01"); // 0.01 ETH
  const dripCooldown = 24 * 60 * 60; // 1 day in seconds
  
  const GrowBitFaucet = await hre.ethers.getContractFactory("GrowBitFaucet");
  const growBitFaucet = await GrowBitFaucet.deploy(dripAmount, dripCooldown);
  await growBitFaucet.waitForDeployment();
  const growBitFaucetAddress = await growBitFaucet.getAddress();
  console.log("GrowBitFaucet deployed to:", growBitFaucetAddress);

  // Fund the faucet with some initial ETH (if deployer has funds)
  const faucetFunding = hre.ethers.parseEther("0.1"); // Fund with 0.1 ETH
  const deployerBalance = await deployer.provider.getBalance(deployer.address);
  
  if (deployerBalance > faucetFunding + hre.ethers.parseEther("0.05")) {
    console.log(`Funding the faucet with ${hre.ethers.formatEther(faucetFunding)} ETH...`);
    const fundTx = await deployer.sendTransaction({
      to: growBitFaucetAddress,
      value: faucetFunding
    });
    await fundTx.wait();
    console.log("Faucet funded successfully!");
  } else {
    console.log("Deployer doesn't have enough ETH to fund the faucet automatically.");
    console.log("Please fund the faucet manually after deployment.");
  }

  // Output the contract addresses for easy updating of the .env file
  console.log("\nCopy these values to your .env file:");
  console.log(`STAKE_CONTRACT_ADDRESS=${growBitStakeAddress}`);
  console.log(`FAUCET_CONTRACT_ADDRESS=${growBitFaucetAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 