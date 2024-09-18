it("Should set the correct merkle root", async function () {
  const { apeDrop, tree } = await loadFixture(deployApeDropFixture);
  expect(await apeDrop.merkleRoot()).to.equal(tree.root);
});

it("Should have the correct token balance", async function () {
  const { apeDrop, token } = await loadFixture(deployApeDropFixture);
  expect(await token.balanceOf(await apeDrop.getAddress())).to.equal(
    ethers.parseEther("1000")
  );
});


describe("Claiming", function () {
  it("Should allow eligible users to claim", async function () {
    const { apeDrop, token, addr1, tree } = await loadFixture(
      deployApeDropFixture
    );
    const proof = tree.getProof([addr1.address, ethers.parseEther("100")]);

    await expect(
      apeDrop.connect(addr1).claimAirdrop(proof, ethers.parseEther("100"))
    )
      .to.emit(apeDrop, "AirdropClaimed")
      .withArgs(addr1.address, ethers.parseEther("100"));

    expect(await token.balanceOf(addr1.address)).to.equal(
      ethers.parseEther("100")
    );
  });

  it("Should not allow claiming twice", async function () {
    const { apeDrop, addr1, tree } = await loadFixture(deployApeDropFixture);
    const proof = tree.getProof([addr1.address, ethers.parseEther("100")]);

    await apeDrop
      .connect(addr1)
      .claimAirdrop(proof, ethers.parseEther("100"));

    await expect(
      apeDrop.connect(addr1).claimAirdrop(proof, ethers.parseEther("100"))
    ).to.be.revertedWith("Already claimed");
  });

  it("Should not allow claiming with invalid proof", async function () {
    const { apeDrop, addr1, addr2, tree } = await loadFixture(
      deployApeDropFixture
    );
    const invalidProof = tree.getProof([
      addr2.address,
      ethers.parseEther("200"),
    ]);

    await expect(
      apeDrop
        .connect(addr1)
        .claimAirdrop(invalidProof, ethers.parseEther("100"))
    ).to.be.revertedWith("Invalid proof");
  });
});

describe("Withdrawing", function () {
  it("Should allow owner to withdraw remaining tokens", async function () {
    const { apeDrop, token, owner } = await loadFixture(deployApeDropFixture);

    const initialBalance = await token.balanceOf(owner.address);
    await apeDrop.connect(owner).withdrawRemainingTokens();
    const finalBalance = await token.balanceOf(owner.address);

    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1000"));
  });

  it("Should not allow non-owner to withdraw", async function () {
    const { apeDrop, addr1 } = await loadFixture(deployApeDropFixture);

    await expect(
      apeDrop.connect(addr1).withdrawRemainingTokens()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});