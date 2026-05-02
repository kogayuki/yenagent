#!/usr/bin/env tsx
/**
 * monitorDelivery — 納品検知 (GitHub PR or 任意URL)
 * Usage: tsx cli/monitorDelivery.ts '{"escrowId":"0","milestone":1,"proofUrl":"https://github.com/xxx/yyy/pull/123"}'
 */
import { readArgs, emit, fail } from "./_lib.js";

interface Args {
  escrowId: string;
  milestone: number;
  proofUrl: string;
}

const a = await readArgs<Args>();
if (!a.escrowId || !a.milestone || !a.proofUrl) {
  fail("missing required fields", { required: ["escrowId", "milestone", "proofUrl"] });
}

let delivered = false;
let detail = "未検知";

try {
  const url = new URL(a.proofUrl);

  if (url.hostname === "github.com" && url.pathname.includes("/pull/")) {
    const parts = url.pathname.split("/").filter(Boolean);
    const [owner, repo, , num] = parts;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${num}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = (await res.json()) as { merged?: boolean; state?: string };
      delivered = !!data.merged;
      detail = `GitHub PR state=${data.state}, merged=${data.merged}`;
    } else {
      detail = `GitHub API ${res.status}`;
    }
  } else {
    const res = await fetch(a.proofUrl, { method: "HEAD" });
    delivered = res.ok;
    detail = `HTTP ${res.status}`;
  }
} catch (e) {
  detail = `error: ${(e as Error).message}`;
}

emit({
  escrowId: a.escrowId,
  milestone: a.milestone,
  proofUrl: a.proofUrl,
  delivered,
  detail,
  next: delivered
    ? "releasePayment を呼び出して支払いを確定してください"
    : "未完了のため待機 or ユーザーに確認してください",
});
