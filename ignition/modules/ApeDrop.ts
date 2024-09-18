import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const AirdropModule = buildModule("AirdropModule", (m) => {
  const MerkleRoot =
    "0x6d9106301eb1d09d1724bddb97b5dcb6bdf6a0e405b7c82a46cebae5cc7e210e";

  // Define the parameters for the contract deployment
  const tokenAddress = m.getParameter(
    "tokenAddress",
    "0x25759b9E5a6f3789852072F2B8fea19C116fEd27"
  );
  const merkleRoot = m.getParameter("merkleRoot", MerkleRoot);

  // Deploy the Airdrop contract with the provided parameters
  const airdrop = m.contract("Airdrop", [tokenAddress, merkleRoot]);

  // Return the deployed contract instance
  return { airdrop };
});

export default AirdropModule;
