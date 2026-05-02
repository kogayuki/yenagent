#!/usr/bin/env tsx
/**
 * MockJPYCの faucet を呼んで自分にJPYCをmintする（デモ準備用）
 * Usage: tsx cli/mintJpyc.ts '{"amountJpyc":100000}'
 */
import { parseUnits } from "viem";
import { readArgs, emit, pub, wallet, ADDRESSES, ERC20_ABI, txUrl } from "./_lib.js";

interface Args {
  amountJpyc?: number;
  privateKey?: string;
}

const a = await readArgs<Args>();
const amount = parseUnits(String(a.amountJpyc ?? 100000), 18);

const w = wallet(a.privateKey);
const p = pub();

const hash = await w.writeContract({
  address: ADDRESSES.mockJPYC,
  abi: ERC20_ABI,
  functionName: "faucet",
  args: [amount],
  gas: 80000n,
  maxFeePerGas: 30_000_000_000n,
  maxPriorityFeePerGas: 25_000_000_000n,
});
const receipt = await p.waitForTransactionReceipt({ hash });

const balance = await p.readContract({
  address: ADDRESSES.mockJPYC,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [w.account.address],
}) as bigint;

emit({
  ok: true,
  txUrl: txUrl(hash),
  status: receipt.status,
  mintedAmount: amount.toString(),
  balanceAfter: balance.toString(),
  balanceJpyc: Number(balance / 10n ** 18n),
});
