import { defineTool } from "openclaw/plugin-sdk";
import { parseUnits } from "viem";
import { getPublicClient, getWalletClient, txUrl } from "../chain/client.js";
import { ADDRESSES } from "../chain/addresses.js";
import { ESCROW_ABI, ERC20_ABI } from "../chain/abi.js";

/**
 * JPYCエスクロー作成: クライアント側で承認後、JPYCを契約にロックする。
 * approve → createEscrow の2tx を行う。
 */
export const createEscrowTool = defineTool({
  name: "createEscrow",
  description:
    "Polygon Amoy上の Escrow contract に JPYC をロックする。クライアントが請求書を承認した後に呼ぶ。" +
    "amountJpyc は JPYC の最小単位ではなく整数（例: 30000 = 3万JPYC）で指定する。",
  parameters: {
    type: "object",
    properties: {
      payerPrivateKey: {
        type: "string",
        description: "クライアント（支払い側）の秘密鍵。MVPデモ用。本番ではwallet connect等に置き換え",
      },
      payeeAddress: { type: "string", description: "フリーランサーのEVMアドレス" },
      amountJpyc: { type: "number", description: "金額（JPYC整数単位）" },
      milestones: { type: "number", description: "マイルストーン分割数", default: 1 },
      memo: { type: "string", description: "案件名や請求書ID等のメモ" },
    },
    required: ["payerPrivateKey", "payeeAddress", "amountJpyc", "memo"],
  },
  async execute({ payerPrivateKey, payeeAddress, amountJpyc, milestones = 1, memo }) {
    const wallet = getWalletClient(payerPrivateKey);
    const pub = getPublicClient();
    const amount = parseUnits(String(amountJpyc), 18);

    // 1. approve
    const approveHash = await wallet.writeContract({
      address: ADDRESSES.mockJPYC,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ADDRESSES.escrow, amount],
    });
    await pub.waitForTransactionReceipt({ hash: approveHash });

    // 2. createEscrow
    const createHash = await wallet.writeContract({
      address: ADDRESSES.escrow,
      abi: ESCROW_ABI,
      functionName: "createEscrow",
      args: [
        wallet.account!.address,
        payeeAddress as `0x${string}`,
        ADDRESSES.mockJPYC,
        amount,
        milestones,
        memo,
      ],
    });
    const receipt = await pub.waitForTransactionReceipt({ hash: createHash });

    return {
      approveTxUrl: txUrl(approveHash),
      createEscrowTxUrl: txUrl(createHash),
      blockNumber: Number(receipt.blockNumber),
      status: receipt.status,
      memo,
      next: "納品検知後 releasePayment を呼び出してください",
    };
  },
});
