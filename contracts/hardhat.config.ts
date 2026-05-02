import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const PRIV = process.env.DEPLOYER_PRIVATE_KEY;
const RPC = process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    // size優先：deployコスト最小化のため runs=1
    settings: { optimizer: { enabled: true, runs: 1 } },
  },
  networks: {
    hardhat: {},
    amoy: {
      url: RPC,
      chainId: 80002,
      accounts: PRIV ? [PRIV] : [],
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    artifacts: "./artifacts",
    cache: "./cache",
  },
};

export default config;
