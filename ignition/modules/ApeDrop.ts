import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AirdropModule = buildModule("AirdropModule", (m) => {
  const MerkleRoot =
    "0x6d9106301eb1d09d1724bddb97b5dcb6bdf6a0e405b7c82a46cebae5cc7e210e";

  // Dynamically retrieve parameters or use hardcoded defaults
  const tokenAddress = m.getParameter(
    "tokenAddress",
    "0xB5135a7ea4C11eB698CE930f00ce8F93c9b3B8d5"
  );
  const merkleRoot = m.getParameter("merkleRoot", MerkleRoot);

  // Deploy the Airdrop contract with the provided parameters
  const airdrop = m.contract("ApeDrop", [tokenAddress, merkleRoot]);

  // Return the deployed contract instance
  return { airdrop };
});

export default AirdropModule;
