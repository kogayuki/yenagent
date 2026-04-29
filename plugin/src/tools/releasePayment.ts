import { defineTool } from "openclaw/plugin-sdk";
import { getPublicClient, getWalletClient, txUrl } from "../chain/client.js";
import { ADDRESSES } from "../chain/addresses.js";
import { ESCROW_ABI } from "../chain/abi.js";

/**
 * 支払いrelease: マイルストーン達成後、エスクローから payee へ JPYC を解放する。
 * payer もしくは agent の権限で release tx を送信。
 */
export const releasePaymentTool = defineTool({
  name: "releasePayment",
  description:
    "Escrow contract の release を呼び出し、指定マイルストーン分の JPYC を payee に解放する。" +
    "monitorDelivery で delivered=true を確認した後に呼ぶこと。",
  parameters: {
    type: "object",
    properties: {
      payerPrivateKey: {
        type: "string",
        description: "release実行者の秘密鍵（通常 payer or agent）",
      },
      escrowId: { type: "number", description: "Escrow ID" },
      milestone: { type: "number", description: "解放するマイルストーン番号 (1始まり)" },
    },
    required: ["payerPrivateKey", "escrowId", "milestone"],
  },
  async execute({ payerPrivateKey, escrowId, milestone }) {
    const wallet = getWalletClient(payerPrivateKey);
    const pub = getPublicClient();

    const hash = await wallet.writeContract({
      address: ADDRESSES.escrow,
      abi: ESCROW_ABI,
      functionName: "release",
      args: [BigInt(escrowId), milestone],
    });
    const receipt = await pub.waitForTransactionReceipt({ hash });

    return {
      txUrl: txUrl(hash),
      escrowId,
      milestone,
      blockNumber: Number(receipt.blockNumber),
      status: receipt.status,
      message: `✅ マイルストーン ${milestone} を release しました`,
    };
  },
});
