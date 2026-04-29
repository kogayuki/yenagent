/**
 * Polygon Amoy testnet にデプロイされた契約アドレス。
 * デプロイ後に scripts/deploy.ts の出力を反映する or 環境変数で上書き。
 */
export const CHAIN = {
  id: 80002,
  name: "polygon-amoy",
  rpcUrl: process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
  explorer: "https://amoy.polygonscan.com",
} as const;

export const ADDRESSES = {
  mockJPYC: (process.env.MOCK_JPYC_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  escrow: (process.env.ESCROW_CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
} as const;
