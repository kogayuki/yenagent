// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
}

/**
 * @title EscrowLite
 * @notice Escrow.solのデプロイ最小サイズ版（hackathon MVP用）
 *         agent権限・ReentrancyGuard・SafeERC20を削減
 *         payer のみが release 可能
 */
contract EscrowLite {
    struct EscrowData {
        address payer;
        address payee;
        address token;
        uint256 amount;
        uint256 released;
        uint8 milestoneCount;
        uint8 milestonesPaid;
    }

    uint256 public nextEscrowId;
    mapping(uint256 => EscrowData) public escrows;
    mapping(uint256 => string) public memos;

    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed payee,
        address token,
        uint256 amount,
        uint8 milestoneCount,
        string memo
    );
    event Released(uint256 indexed escrowId, uint8 milestone, uint256 amount, address indexed payee);

    function createEscrow(
        address payer,
        address payee,
        address token,
        uint256 amount,
        uint8 milestoneCount,
        string calldata memo
    ) external returns (uint256 escrowId) {
        require(payer == msg.sender, "payer mismatch");
        require(milestoneCount > 0 && milestoneCount <= 10, "milestone range");
        require(amount > 0, "zero amount");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transferFrom fail");

        escrowId = nextEscrowId++;
        escrows[escrowId] = EscrowData({
            payer: payer,
            payee: payee,
            token: token,
            amount: amount,
            released: 0,
            milestoneCount: milestoneCount,
            milestonesPaid: 0
        });
        memos[escrowId] = memo;

        emit EscrowCreated(escrowId, payer, payee, token, amount, milestoneCount, memo);
    }

    function release(uint256 escrowId, uint8 milestone) external {
        EscrowData storage e = escrows[escrowId];
        require(e.payer == msg.sender, "not payer");
        require(milestone > 0 && milestone <= e.milestoneCount, "milestone range");
        require(milestone == e.milestonesPaid + 1, "out of order");

        uint256 perMilestone = e.amount / e.milestoneCount;
        uint256 payout = (milestone == e.milestoneCount) ? (e.amount - e.released) : perMilestone;

        e.released += payout;
        e.milestonesPaid = milestone;

        require(IERC20(e.token).transfer(e.payee, payout), "transfer fail");
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
        return (e.payer, e.payee, e.amount, e.released, e.milestoneCount, e.milestonesPaid);
    }
}
