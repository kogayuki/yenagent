// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockJPYC
 * @notice Polygon Amoy testnet 用の JPYC モックトークン。
 *         本番（mainnet）では実 JPYC（電子決済手段）を採用する前提。
 *         任意のアドレスへの mint を許可（誰でもfaucet可能）。
 */
contract MockJPYC is ERC20, Ownable {
    constructor() ERC20("Mock JPYC", "mJPYC") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    /// @notice Faucet: 誰でも自分のアドレスに mint できる（テスト用途）。
    function faucet(uint256 amount) external {
        require(amount <= 100_000 * 10 ** decimals(), "max 100k per call");
        _mint(msg.sender, amount);
    }

    /// @notice Owner 用の任意 mint。
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
