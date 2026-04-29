// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @notice マイルストーン型エスクロー。
 *         payer が createEscrow で資金をロックし、
 *         納品確認後に release(milestoneId) で payee に解放する。
 *         release 権限は payer または agent（任意設定）。
 */
contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct EscrowData {
        address payer;
        address payee;
        IERC20 token;
        uint256 amount;          // 総額
        uint256 released;        // 解放済み額
        uint8 milestoneCount;    // 分割数
        uint8 milestonesPaid;    // 解放済みマイルストーン数
        string memo;
        bool exists;
    }

    uint256 public nextEscrowId;
    mapping(uint256 => EscrowData) public escrows;
    /// @notice agent アドレス（agent も release 可能）。0 にすれば payer のみ。
    mapping(uint256 => address) public agents;

    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        uint8 milestoneCount,
        string memo
    );
    event Released(
        uint256 indexed escrowId,
        uint8 milestone,
        uint256 amount,
        address indexed payee
    );
    event AgentSet(uint256 indexed escrowId, address agent);

    error NotAuthorized();
    error EscrowMissing();
    error AlreadyPaid();
    error InvalidMilestone();

    /// @notice payer 側で approve してから呼ぶ。
    function createEscrow(
        address payer,
        address payee,
        address token,
        uint256 amount,
        uint8 milestoneCount,
        string calldata memo
    ) external nonReentrant returns (uint256 escrowId) {
        require(payer == msg.sender, "payer mismatch");
        require(milestoneCount > 0 && milestoneCount <= 10, "milestone range");
        require(amount > 0, "zero amount");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        escrowId = nextEscrowId++;
        escrows[escrowId] = EscrowData({
            payer: payer,
            payee: payee,
            token: IERC20(token),
            amount: amount,
            released: 0,
            milestoneCount: milestoneCount,
            milestonesPaid: 0,
            memo: memo,
            exists: true
        });

        emit EscrowCreated(escrowId, payer, payee, token, amount, milestoneCount, memo);
    }

    function setAgent(uint256 escrowId, address agent) external {
        EscrowData storage e = escrows[escrowId];
        if (!e.exists) revert EscrowMissing();
        if (msg.sender != e.payer) revert NotAuthorized();
        agents[escrowId] = agent;
        emit AgentSet(escrowId, agent);
    }

    function release(uint256 escrowId, uint8 milestone) external nonReentrant {
        EscrowData storage e = escrows[escrowId];
        if (!e.exists) revert EscrowMissing();
        if (msg.sender != e.payer && msg.sender != agents[escrowId]) revert NotAuthorized();
        if (milestone == 0 || milestone > e.milestoneCount) revert InvalidMilestone();
        if (milestone <= e.milestonesPaid) revert AlreadyPaid();

        // 順番通り（1,2,3...）の release を強制
        require(milestone == e.milestonesPaid + 1, "out of order");

        uint256 perMilestone = e.amount / e.milestoneCount;
        // 最終 milestone は端数を含める
        uint256 payout = (milestone == e.milestoneCount)
            ? (e.amount - e.released)
            : perMilestone;

        e.released += payout;
        e.milestonesPaid = milestone;

        e.token.safeTransfer(e.payee, payout);
        emit Released(escrowId, milestone, payout, e.payee);
    }

    function getEscrow(uint256 escrowId)
        external
        view
        returns (
            address payer,
            address payee,
            uint256 amount,
            uint256 released,
            uint8 milestoneCount,
            uint8 milestonesPaid
        )
    {
        EscrowData storage e = escrows[escrowId];
        if (!e.exists) revert EscrowMissing();
        return (e.payer, e.payee, e.amount, e.released, e.milestoneCount, e.milestonesPaid);
    }
}
