// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ApeReward is ERC20, Ownable(msg.sender) {
    constructor() ERC20("ApeReward", "APR") {
        _mint(msg.sender, 100000e18); // Mint initial supply to the deployer
    }

    function mint(uint256 _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }
}
