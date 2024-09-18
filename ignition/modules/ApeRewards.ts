import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC20TokenModule = buildModule("ERC20TokenModule", (m) => {
  const erc20Token = m.contract("ERC", []);

  return { erc20Token };
});

export default ERC20TokenModule;

// 0xEC824d6122f5D63A41Cb6AB8839362f342e2b35F   contract address for the token
