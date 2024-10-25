require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		optimism_sepolia: {
			provider: () =>
				new HDWalletProvider(
					process.env.PRIVATE_KEY,       // Private key from .env
					process.env.ALCHEMY_URL        // Alchemy URL from .env
				),
			network_id: 11155420,              // Chain ID for Optimism Sepolia
			gas: 6000000,                      // Gas limit (adjust as needed)
			gasPrice: 1500000                  // 1.5 Gwei
		}
	},
	compilers: {
		solc: {
			version: "0.4.25",                 // Match your Solidity version
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		}
	}
};