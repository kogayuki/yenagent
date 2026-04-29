import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { CHAIN } from "./addresses.js";

export function getPublicClient() {
  return createPublicClient({
    chain: polygonAmoy,
    transport: http(CHAIN.rpcUrl),
  });
}

export function getWalletClient(privateKey?: string) {
  const key = (privateKey ?? process.env.DEPLOYER_PRIVATE_KEY) as Hex | undefined;
  if (!key) {
    throw new Error("DEPLOYER_PRIVATE_KEY is not set in env");
  }
  const account = privateKeyToAccount(key);
  return createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(CHAIN.rpcUrl),
  });
}

export function txUrl(hash: string): string {
  return `${CHAIN.explorer}/tx/${hash}`;
}
