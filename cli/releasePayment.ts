#!/usr/bin/env tsx
/**
 * releasePayment — マイルストーン分の JPYC を payee に解放
 * Usage: tsx cli/releasePayment.ts '{"escrowId":0,"milestone":1,"payerPrivateKey":"0x..."}'
 *
 * payerPrivateKey 省略時は .env の DEPLOYER_PRIVATE_KEY を使用（デモ用）
 */
import { readArgs, emit, fail, pub, wallet, ADDRESSES, ESCROW_ABI, txUrl } from "./_lib.js";

interface Args {
  escrowId: number;
  milestone: number;
  payerPrivateKey?: string;
}

const a = await readArgs<Args>();
if (a.escrowId === undefined || !a.milestone) {
  fail("missing required fields", { required: ["escrowId", "milestone"] });
}

const w = wallet(a.payerPrivateKey);
const p = pub();

// Amoy はbaseFeeがほぼゼロのためガス料金を控えめに（viemデフォルトは盛りすぎ）
const hash = await w.writeContract({
  address: ADDRESSES.escrow,
  abi: ESCROW_ABI,
  functionName: "release",
  args: [BigInt(a.escrowId), a.milestone],
  gas: 130000n,
  maxFeePerGas: 30_000_000_000n,           // 30 gwei
  maxPriorityFeePerGas: 25_000_000_000n,   // 25 gwei (Amoyの最低ライン)
});
const receipt = await p.waitForTransactionReceipt({ hash });

// 状態確認
const state = (await p.readContract({
  address: ADDRESSES.escrow,
  abi: ESCROW_ABI,
  functionName: "getEscrow",
  args: [BigInt(a.escrowId)],
})) as readonly [string, string, bigint, bigint, number, number];

emit({
  ok: true,
  escrowId: a.escrowId,
  milestone: a.milestone,
  txUrl: txUrl(hash),
  blockNumber: receipt.blockNumber.toString(),
  status: receipt.status,
  totalAmount: state[2].toString(),
  releasedAmount: state[3].toString(),
  milestonesPaid: state[5],
  message: `✅ マイルストーン ${a.milestone} を release しました`,
});
