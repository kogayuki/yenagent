import { defineTool } from "openclaw/plugin-sdk";

/**
 * 請求書発行: ユーザーが指定した案件・金額・期日から請求書データを生成する。
 * MVP段階では PDFは出さず、構造化JSONを返す（後段の createEscrow への入力に使う）。
 */
export const createInvoiceTool = defineTool({
  name: "createInvoice",
  description:
    "案件の請求書を発行する。フリーランサーが「請求書出して」と依頼した時に呼ぶ。" +
    "案件名・金額（JPY）・支払期日・クライアント名を入力に取り、請求書ID付きの構造化データを返す。",
  parameters: {
    type: "object",
    properties: {
      projectName: { type: "string", description: "案件名" },
      amountJpy: { type: "number", description: "請求金額（円）" },
      dueDate: { type: "string", description: "支払期日 (YYYY-MM-DD)" },
      clientName: { type: "string", description: "クライアント名 or 会社名" },
      milestones: {
        type: "number",
        description: "マイルストーン分割数（1=一括、3=3分割など）",
        default: 1,
      },
    },
    required: ["projectName", "amountJpy", "dueDate", "clientName"],
  },
  async execute({ projectName, amountJpy, dueDate, clientName, milestones = 1 }) {
    if (amountJpy <= 0) {
      return { error: "金額は1円以上を指定してください" };
    }
    if (milestones < 1 || milestones > 10) {
      return { error: "マイルストーン分割数は1〜10で指定してください" };
    }

    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const perMilestone = Math.floor(amountJpy / milestones);

    return {
      invoiceId,
      projectName,
      clientName,
      amountJpy,
      dueDate,
      milestones,
      perMilestoneJpy: perMilestone,
      status: "draft",
      next: "クライアント承認後 createEscrow を実行できます",
    };
  },
});
