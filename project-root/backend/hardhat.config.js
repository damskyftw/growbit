require('dotenv').config();
const { WALLET_PRIVATE_KEY, PROVIDER_URL } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: PROVIDER_URL || 'https://sepolia.base.org',
      accounts: WALLET_PRIVATE_KEY ? [WALLET_PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 31337
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  }
}; 