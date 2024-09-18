import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {
  impersonateAccount,
  setBalance,
} from "@nomicfoundation/hardhat-network-helpers";

function safeStringify(obj: any) {
  return JSON.stringify(obj, (_, v) =>
    typeof v === "bigint" ? v.toString() : v
  );
}

describe("ApeDrop", function () {
  async function deployApeDropFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const ApeReward = await ethers.getContractFactory("ApeReward");
    const token = await ApeReward.deploy();

    const BAYC_ADDRESS = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
    const BAYC_HOLDER = "0x76C1cFe708ED1d2FF2073490727f3301117767e9";

    // Create Merkle tree including the BAYC holder
    const leaves = [
      [addr1.address, ethers.parseEther("100")],
      [addr2.address, ethers.parseEther("100")],
      [BAYC_HOLDER, ethers.parseEther("100")],
    ];
    const tree = StandardMerkleTree.of(leaves, ["address", "uint256"]);
    const merkleRoot = tree.root;

    // Deploy ApeDrop contract
    const ApeDrop = await ethers.getContractFactory("ApeDrop");
    const apeDrop = await ApeDrop.deploy(await token.getAddress(), merkleRoot);

    // Transfer tokens to ApeDrop contract
    await token.transfer(await apeDrop.getAddress(), ethers.parseEther("1000"));

    // Get BAYC contract instance
    const BAYC = await ethers.getContractAt("IERC721", BAYC_ADDRESS);

    return { apeDrop, token, owner, addr1, addr2, BAYC_HOLDER, tree, BAYC };
  }

  describe("Airdrop Claim", function () {
    it("Should allow BAYC owner to claim tokens", async function () {
      const { apeDrop, token, BAYC_HOLDER, tree, BAYC } = await loadFixture(
        deployApeDropFixture
      );

      await impersonateAccount(BAYC_HOLDER);
      const baycOwner = await ethers.getSigner(BAYC_HOLDER);
      await setBalance(BAYC_HOLDER, ethers.parseEther("10"));

      const amount = ethers.parseEther("100");
      const proof = tree.getProof([BAYC_HOLDER, amount]);

      // Check BAYC balance
      const baycBalance = await BAYC.balanceOf(baycOwner.address);
      expect(baycBalance).to.be.gt(0);

      // Claim tokens
      await apeDrop.connect(baycOwner).claimAirdrop(proof, amount);

      // Check if tokens were transferred
      const balance = await token.balanceOf(baycOwner.address);
      expect(balance).to.equal(amount);
    });

    it("Should not allow non-BAYC holder to claim airdrop", async function () {
      const { apeDrop, addr1, tree } = await loadFixture(deployApeDropFixture);

      const claimAmount = ethers.parseEther("100");
      const proof = tree.getProof([addr1.address, claimAmount]);

      await expect(
        apeDrop.connect(addr1).claimAirdrop(proof, claimAmount)
      ).to.be.revertedWith("Must own a BAYC NFT to claim");
    });

    it("Should not allow double claiming", async function () {
      const { apeDrop, BAYC_HOLDER, tree } = await loadFixture(
        deployApeDropFixture
      );

      await impersonateAccount(BAYC_HOLDER);
      const baycOwner = await ethers.getSigner(BAYC_HOLDER);
      await setBalance(BAYC_HOLDER, ethers.parseEther("10"));

      const claimAmount = ethers.parseEther("100");
      const proof = tree.getProof([BAYC_HOLDER, claimAmount]);

      // First claim should succeed
      await apeDrop.connect(baycOwner).claimAirdrop(proof, claimAmount);

      // Second claim should fail
      await expect(
        apeDrop.connect(baycOwner).claimAirdrop(proof, claimAmount)
      ).to.be.revertedWith("Address has already claimed");
    });
  });

  describe("Deployment", function () {
    it("Should set the right token address", async function () {
      const { apeDrop, token } = await loadFixture(deployApeDropFixture);
      expect(await apeDrop.token()).to.equal(await token.getAddress());
    });

    it("Should set the correct BAYC NFT address", async function () {
      const { apeDrop } = await loadFixture(deployApeDropFixture);
      expect(await apeDrop.BAYC_NFT()).to.equal(
        "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
      );
    });
  });

  describe("Token Withdrawal", function () {
    it("Should allow owner to withdraw remaining tokens", async function () {
      const { apeDrop, token, owner } = await loadFixture(deployApeDropFixture);

      const initialBalance = await token.balanceOf(owner.address);
      const contractBalance = await token.balanceOf(await apeDrop.getAddress());

      await apeDrop.connect(owner).withdrawRemainingTokens();

      expect(await token.balanceOf(owner.address)).to.equal(
        initialBalance + contractBalance
      );
      expect(await token.balanceOf(await apeDrop.getAddress())).to.equal(0);
    });

    it("Should not allow non-owner to withdraw tokens", async function () {
      const { apeDrop } = await loadFixture(deployApeDropFixture);
      const [_, nonOwner] = await ethers.getSigners();

      await expect(apeDrop.connect(nonOwner).withdrawRemainingTokens())
        .to.be.revertedWithCustomError(apeDrop, "OwnableUnauthorizedAccount")
        .withArgs(nonOwner.address);
    });
  });
});
