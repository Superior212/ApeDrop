## Merkle Airdrop Smart Contract with BAYC Ownership Requirement

### Overview
This project implements a Merkle Airdrop smart contract where eligible users can claim ERC20 tokens if and only if they own a Bored Ape Yacht Club (BAYC) NFT. The airdrop is governed by a Merkle tree, ensuring that only valid users can claim tokens, with the added restriction that they must hold a BAYC NFT during the claim process.

### Key Features
- **Merkle Tree Eligibility**: The Merkle tree is generated from a list of addresses and claim amounts stored in a CSV file. Only addresses included in the Merkle tree can claim the airdrop tokens.
- **BAYC Ownership Verification**: In addition to being part of the Merkle tree, users must own a Bored Ape Yacht Club (BAYC) NFT to successfully claim their tokens.
- **ERC20 Airdrop**: The smart contract accepts an ERC20 token address during deployment. This token will be distributed to eligible users through the airdrop.
- **Single Claim**: Each eligible user can only claim their airdrop once.

### Prerequisites
1. **ERC20 Token**: The smart contract accepts the address of an ERC20 token that will be distributed as part of the airdrop.
2. **Merkle Root**: The smart contract is initialized with a Merkle root, which is derived from the list of eligible addresses and claim amounts.
3. **BAYC NFT Ownership**: Users must own a BAYC NFT to claim their airdrop.

### Tools Used
- **Hardhat**: For contract development and testing.
- **OpenZeppelin Libraries**: Used for ERC20 and ERC721 interfaces, cryptography (Merkle Proof), and access control (Ownable).
- **Merkle.js**: To generate the Merkle tree from the CSV file containing airdrop information.
- **BAYC NFT**: The smart contract checks the Ethereum mainnet Bored Ape Yacht Club (BAYC) contract to verify ownership during the claim process.

### How It Works
1. **Merkle Tree Creation**: A Merkle tree is generated using the eligible addresses and their respective airdrop amounts. This list is stored in a CSV file and processed using Merkle.js to create the Merkle root.
2. **Contract Deployment**: The smart contract is deployed with three parameters:
   - ERC20 token address (the token being airdropped).
   - The Merkle root (derived from the CSV file).
   - The address of the BAYC NFT contract (to check ownership).
3. **Claim Process**:
   - Users submit a Merkle proof, amount, and their address to claim tokens.
   - The contract verifies that:
     - The user is part of the Merkle tree.
     - The user owns at least one BAYC NFT.
     - The user has not already claimed their tokens.
   - If all conditions are met, the user receives their airdrop tokens.

### Unit Testing
Unit tests cover the following:
- **Claiming Tokens**: Tests ensure that eligible users with valid Merkle proofs and BAYC NFTs can successfully claim their tokens.
- **Double Claim Prevention**: Tests verify that users can only claim their tokens once.
- **Invalid Claims**: Tests ensure that users without BAYC NFTs or invalid Merkle proofs are unable to claim tokens.

### Setup and Instructions
1. **Install Dependencies**: 
   ```bash
   npm install
   ```

2. **Compile the Contracts**:
   ```bash
   npx hardhat compile
   ```

3. **Run Unit Tests**:
   ```bash
   npx hardhat test
   ```

4. **Merkle Tree Generation**:
   - Prepare a CSV file with the list of eligible addresses and their respective airdrop amounts.
   - Use `merkle.js` to generate the Merkle tree and root.
   - The Merkle root will be passed as a parameter when deploying the smart contract.

### Considerations
- **Mainnet BAYC Contract**: This contract references the Bored Ape Yacht Club (BAYC) NFT on the Ethereum mainnet. Ensure the BAYC contract address is correctly set when deploying the smart contract.
- **Gas Fees**: Claiming the airdrop will involve interacting with both ERC20 and ERC721 contracts, so users should be aware of gas fees associated with these transactions.



