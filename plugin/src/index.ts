import { definePlugin } from "openclaw/plugin-sdk";
import { SYSTEM_PROMPT } from "./prompts/system.js";
import { createInvoiceTool } from "./tools/createInvoice.js";
import { createEscrowTool } from "./tools/createEscrow.js";
import { monitorDeliveryTool } from "./tools/monitorDelivery.js";
import { releasePaymentTool } from "./tools/releasePayment.js";

export default definePlugin({
  name: "yenagent",
  displayName: "YenAgent (円ジェント)",
  description:
    "日本のフリーランス向け自律決済AIエージェント。請求書発行→JPYCエスクロー→納品検知→自動release を一気通貫で実行する。",
  systemPrompt: SYSTEM_PROMPT,
  tools: [createInvoiceTool, createEscrowTool, monitorDeliveryTool, releasePaymentTool],
});
