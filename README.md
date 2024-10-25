# CryptoZombies DApp

## Group 
| Name |
| ------ |
| Anirudh Ramakrishnan |
| Dhanush Kortikere Jagadish |

## Features
- Create a zombie with random names
- Switch to any test network and contract at any time (URL and Contract address are not hard-coded)
- Displays created zombie with complete details
- Levels up the zombie in the current network
- Update user interface in real-time upon creation of zombie or any interaction (level up, listing)
- Front-end runs on ReactJS with the Remix framework. Webpage styling uses Bulma CSS
- Create kitties that can be fed to the zombies to mutate the DNA and change the zombie
- Zombies have their own image accroding to their DNA
- Each user account can create multiple zombies and kitties
- Zombies can fight other zombies and level up on winning
- Deployed on Optimism Sepolia net using Alchemy toolkit
  
## Execution
- Run `npm install` to download dependencies
- Enter test network details in the `truffle-config.js` file
- Run `truffle migrate` to compile and migrate contracts
- Ensure Metamask is setup with one of the test accounts in the Ganache test network
- Run `npm run start` to host the server
- Navigate to `localhost:3000` to open the DApp and use the contracts

## Optional (to deploy on test-nets)
- Ensure PRIVATE_KEY and ALCHEMY_URL environment variables are available with the private key of your wallet (MetaMask) account and Alchemy URL of the network you wish to deploy to
- Run the `truffle migrate --config truffle-config-test.js --network <network name>` to deploy to the network of your choice
