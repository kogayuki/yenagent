#!/usr/bin/env tsx
/**
 * createInvoice — 請求書を発行（オフチェーン構造化）
 * Usage: tsx cli/createInvoice.ts '{"projectName":"ABC案件","amountJpy":30000,"dueDate":"2026-05-31","clientName":"ABC社","milestones":3}'
 */
import { readArgs, emit, fail } from "./_lib.js";

interface Args {
  projectName: string;
  amountJpy: number;
  dueDate: string;
  clientName: string;
  milestones?: number;
}

const a = await readArgs<Args>();

if (!a.projectName || !a.amountJpy || !a.dueDate || !a.clientName) {
  fail("missing required fields", { required: ["projectName", "amountJpy", "dueDate", "clientName"] });
}
if (a.amountJpy <= 0) fail("amountJpy must be > 0");
const milestones = a.milestones ?? 1;
if (milestones < 1 || milestones > 10) fail("milestones must be 1..10");

const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const perMilestone = Math.floor(a.amountJpy / milestones);

emit({
  invoiceId,
  projectName: a.projectName,
  clientName: a.clientName,
  amountJpy: a.amountJpy,
  dueDate: a.dueDate,
  milestones,
  perMilestoneJpy: perMilestone,
  status: "draft",
  next: "クライアント承認後 createEscrow を実行できます",
});
