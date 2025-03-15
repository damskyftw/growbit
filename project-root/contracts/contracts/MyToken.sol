// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    // Constructor sets the name and symbol of the token and mints initial supply to the deployer
    constructor(uint256 initialSupply) ERC20("GrowBit Token", "GBT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Only owner can mint more tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 