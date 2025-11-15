// src/lib/arkivClient.ts
import { createWalletClient, createPublicClient, http } from "@arkiv-network/sdk";
import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";
import { mendoza } from "@arkiv-network/sdk/chains";
import { ExpirationTime } from "@arkiv-network/sdk/utils";

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.RPC_URL!;

if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("Missing PRIVATE_KEY or RPC_URL");
}

// Read/write client
export const walletClient = createWalletClient({
  chain: mendoza,
  transport: http(RPC_URL),
  account: privateKeyToAccount(PRIVATE_KEY),
});

// Read-only client
export const publicClient = createPublicClient({
  chain: mendoza,
  transport: http(RPC_URL),
});

// Helper: 24h default
export const ONE_DAY = ExpirationTime.fromSeconds(86400); // 24h

export const minutesToExpiration = (minutes: number) =>
  ExpirationTime.fromMinutes(minutes);
