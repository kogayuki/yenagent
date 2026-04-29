import { defineTool } from "openclaw/plugin-sdk";

/**
 * 納品検知: GitHub PR マージ・Slack通知・URL監視等で完了を判定する。
 * MVP段階では「ユーザーが入力した URL or PR番号 から判定したことにする」スタブ。
 * 本番では Webhook / GitHub API / Slack API 等で自律監視する。
 */
export const monitorDeliveryTool = defineTool({
  name: "monitorDelivery",
  description:
    "案件の納品が完了したかを判定する。GitHub PR URL or 任意の URL を入力し、" +
    "現時点では merged / 200 OK 等のシグナルで完了とみなす。",
  parameters: {
    type: "object",
    properties: {
      escrowId: { type: "string", description: "対象 escrowId" },
      milestone: { type: "number", description: "確認するマイルストーン番号 (1始まり)" },
      proofUrl: { type: "string", description: "納品物URL (GitHub PR / 共有リンク等)" },
    },
    required: ["escrowId", "milestone", "proofUrl"],
  },
  async execute({ escrowId, milestone, proofUrl }) {
    let delivered = false;
    let detail = "未検知";

    try {
      const url = new URL(proofUrl);

      // GitHub PR URL の場合: API でstate=closed & merged をチェック
      if (url.hostname === "github.com" && url.pathname.includes("/pull/")) {
        const parts = url.pathname.split("/").filter(Boolean);
        const owner = parts[0];
        const repo = parts[1];
        const num = parts[3];
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${num}`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = (await res.json()) as { merged?: boolean; state?: string };
          delivered = !!data.merged;
          detail = `GitHub PR ${data.state}, merged=${data.merged}`;
        } else {
          detail = `GitHub API ${res.status}`;
        }
      } else {
        // 一般URL: 200で納品とみなす（MVP）
        const res = await fetch(proofUrl, { method: "HEAD" });
        delivered = res.ok;
        detail = `HTTP ${res.status}`;
      }
    } catch (e) {
      detail = `error: ${(e as Error).message}`;
    }

    return {
      escrowId,
      milestone,
      proofUrl,
      delivered,
      detail,
      next: delivered
        ? "releasePayment を呼び出して支払いを確定してください"
        : "未完了のため待機 or ユーザーに確認してください",
    };
  },
});
