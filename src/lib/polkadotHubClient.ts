// src/lib/polkadotHubClient.ts
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const POLKADOT_HUB_RPC =
  process.env.POLKADOT_HUB_RPC ??
  "https://testnet-passet-hub-eth-rpc.polkadot.io";

const POLKADOT_HUB_CHAIN_ID = Number(
  process.env.POLKADOT_HUB_CHAIN_ID ?? "420420422"
);

const POLKADOT_HUB_PRIVATE_KEY = process.env
  .POLKADOT_HUB_PRIVATE_KEY as `0x${string}` | undefined;

if (!POLKADOT_HUB_RPC || !POLKADOT_HUB_CHAIN_ID) {
  throw new Error("Missing POLKADOT_HUB_RPC or POLKADOT_HUB_CHAIN_ID env var");
}

if (!POLKADOT_HUB_PRIVATE_KEY) {
  throw new Error("Missing POLKADOT_HUB_PRIVATE_KEY env var");
}

export const polkadotHubChain = {
  id: POLKADOT_HUB_CHAIN_ID,
  name: "Polkadot Hub TestNet",
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [POLKADOT_HUB_RPC] },
    public: { http: [POLKADOT_HUB_RPC] },
  },
} as const;

export const polkadotHubAccount = privateKeyToAccount(POLKADOT_HUB_PRIVATE_KEY);

// Read-only client
export const polkadotHubPublicClient = createPublicClient({
  chain: polkadotHubChain,
  transport: http(POLKADOT_HUB_RPC),
});

// Read/write client
export const polkadotHubWalletClient = createWalletClient({
  chain: polkadotHubChain,
  transport: http(POLKADOT_HUB_RPC),
  account: polkadotHubAccount,
});
