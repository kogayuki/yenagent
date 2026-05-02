import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const RPC_URL = process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology";
export const EXPLORER = "https://amoy.polygonscan.com";
export const ADDRESSES = {
  mockJPYC: (process.env.MOCK_JPYC_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  escrow: (process.env.ESCROW_CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export function pub() {
  return createPublicClient({ chain: polygonAmoy, transport: http(RPC_URL) });
}

export function wallet(privateKey?: string) {
  const key = (privateKey ?? process.env.DEPLOYER_PRIVATE_KEY) as Hex | undefined;
  if (!key) throw new Error("DEPLOYER_PRIVATE_KEY not set");
  const account = privateKeyToAccount(key.startsWith("0x") ? (key as Hex) : (`0x${key}` as Hex));
  return createWalletClient({ account, chain: polygonAmoy, transport: http(RPC_URL) });
}

export const txUrl = (h: string) => `${EXPLORER}/tx/${h}`;
export const addrUrl = (a: string) => `${EXPLORER}/address/${a}`;

export const ERC20_ABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }] },
  { type: "function", name: "balanceOf", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "transfer", stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }] },
  { type: "function", name: "faucet", stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
] as const;

export const ESCROW_ABI = [
  { type: "function", name: "createEscrow", stateMutability: "nonpayable",
    inputs: [
      { name: "payer", type: "address" }, { name: "payee", type: "address" },
      { name: "token", type: "address" }, { name: "amount", type: "uint256" },
      { name: "milestoneCount", type: "uint8" }, { name: "memo", type: "string" },
    ],
    outputs: [{ type: "uint256" }] },
  { type: "function", name: "release", stateMutability: "nonpayable",
    inputs: [{ name: "escrowId", type: "uint256" }, { name: "milestone", type: "uint8" }],
    outputs: [] },
  { type: "function", name: "getEscrow", stateMutability: "view",
    inputs: [{ name: "escrowId", type: "uint256" }],
    outputs: [
      { name: "payer", type: "address" }, { name: "payee", type: "address" },
      { name: "amount", type: "uint256" }, { name: "released", type: "uint256" },
      { name: "milestoneCount", type: "uint8" }, { name: "milestonesPaid", type: "uint8" },
    ] },
  { type: "event", name: "EscrowCreated",
    inputs: [
      { indexed: true, name: "escrowId", type: "uint256" },
      { indexed: true, name: "payer", type: "address" },
      { indexed: true, name: "payee", type: "address" },
      { indexed: false, name: "token", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "milestoneCount", type: "uint8" },
      { indexed: false, name: "memo", type: "string" },
    ] },
] as const;

/** Read JSON from argv[2] or stdin. Throws on parse error. */
export async function readArgs<T = Record<string, unknown>>(): Promise<T> {
  const argv = process.argv[2];
  if (argv) return JSON.parse(argv);
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(Buffer.from(c));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {} as T;
  return JSON.parse(raw);
}

export function emit(obj: unknown): never {
  process.stdout.write(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2));
  process.stdout.write("\n");
  process.exit(0);
}

export function fail(msg: string, extra?: Record<string, unknown>): never {
  process.stderr.write(JSON.stringify({ error: msg, ...extra }) + "\n");
  process.exit(1);
}
