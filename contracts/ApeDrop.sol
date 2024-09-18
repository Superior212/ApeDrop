// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ApeDrop is Ownable {
    bytes32 public merkleRoot;
    IERC20 public token;
    IERC721 public BAYC_NFT;

    mapping(address => bool) public hasClaimed;

    event AirdropClaimed(address indexed claimant, uint256 amount);
    event LeafComputed(bytes32 leaf);
    event ProofVerificationResult(bool isValid);

    constructor(address _token, bytes32 _merkleRoot) Ownable(msg.sender) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
        BAYC_NFT = IERC721(0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D);
    }

    function setBAYCAddress(address _baycAddress) external onlyOwner {
        BAYC_NFT = IERC721(_baycAddress);
    }

    function claimAirdrop(bytes32[] memory proof, uint256 amount) public {
        require(!hasClaimed[msg.sender], "Address has already claimed");
        require(
            BAYC_NFT.balanceOf(msg.sender) > 0,
            "Must own a BAYC NFT to claim"
        );

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, amount)))
        );
        emit LeafComputed(leaf);

        bool isValid = MerkleProof.verify(proof, merkleRoot, leaf);
        emit ProofVerificationResult(isValid);

        require(isValid, "Invalid Merkle proof");

        hasClaimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        emit AirdropClaimed(msg.sender, amount);
    }

    function withdrawRemainingTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Token transfer failed");
    }
}
