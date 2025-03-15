require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Private key from environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // For local development
    hardhat: {
      chainId: 31337
    },
    // Base Sepolia testnet
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 84532,
      gasPrice: 1000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 