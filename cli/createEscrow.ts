#!/usr/bin/env tsx
/**
 * createEscrow — JPYC をエスクローにロック (approve → createEscrow の2tx)
 * Usage: tsx cli/createEscrow.ts '{"payerPrivateKey":"0x...","payeeAddress":"0x...","amountJpyc":30000,"milestones":3,"memo":"INV-xxx"}'
 *
 * payerPrivateKey 省略時は .env の DEPLOYER_PRIVATE_KEY を使用（デモ用）
 */
import { parseUnits, decodeEventLog } from "viem";
import { readArgs, emit, fail, pub, wallet, ADDRESSES, ERC20_ABI, ESCROW_ABI, txUrl } from "./_lib.js";

interface Args {
  payerPrivateKey?: string;
  payeeAddress: string;
  amountJpyc: number;
  milestones?: number;
  memo: string;
}

const a = await readArgs<Args>();
if (!a.payeeAddress || !a.amountJpyc || !a.memo) {
  fail("missing required fields", { required: ["payeeAddress", "amountJpyc", "memo"] });
}

const w = wallet(a.payerPrivateKey);
const p = pub();
const amount = parseUnits(String(a.amountJpyc), 18);
const milestones = a.milestones ?? 1;

// Amoy向け低ガス設定（viemデフォルトは盛りすぎ）
const gasOpts = {
  maxFeePerGas: 30_000_000_000n,           // 30 gwei
  maxPriorityFeePerGas: 25_000_000_000n,   // 25 gwei
};

// 1. approve
const approveHash = await w.writeContract({
  address: ADDRESSES.mockJPYC,
  abi: ERC20_ABI,
  functionName: "approve",
  args: [ADDRESSES.escrow, amount],
  gas: 60000n,
  ...gasOpts,
});
await p.waitForTransactionReceipt({ hash: approveHash });

// 2. createEscrow
const createHash = await w.writeContract({
  address: ADDRESSES.escrow,
  abi: ESCROW_ABI,
  functionName: "createEscrow",
  args: [
    w.account.address,
    a.payeeAddress as `0x${string}`,
    ADDRESSES.mockJPYC,
    amount,
    milestones,
    a.memo,
  ],
  gas: 250000n,
  ...gasOpts,
});
const receipt = await p.waitForTransactionReceipt({ hash: createHash });

// EscrowCreated イベントから escrowId を取得
let escrowId: string | null = null;
for (const log of receipt.logs) {
  try {
    const parsed = decodeEventLog({ abi: ESCROW_ABI, data: log.data, topics: log.topics });
    if (parsed.eventName === "EscrowCreated") {
      escrowId = (parsed.args as { escrowId: bigint }).escrowId.toString();
      break;
    }
  } catch { /* not our event */ }
}

emit({
  ok: true,
  escrowId,
  approveTxUrl: txUrl(approveHash),
  createEscrowTxUrl: txUrl(createHash),
  blockNumber: receipt.blockNumber.toString(),
  status: receipt.status,
  amountJpyc: a.amountJpyc,
  milestones,
  memo: a.memo,
  next: "納品検知後 releasePayment を呼び出してください（escrowIdを引数に渡す）",
});
