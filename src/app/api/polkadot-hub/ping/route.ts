// src/app/api/polkadot-hub/ping/route.ts
import { jsonResponse } from "@/utils/http";
import {
  polkadotHubChain,
  polkadotHubPublicClient,
  polkadotHubAccount,
} from "@/lib/polkadotHubClient";

export async function GET(): Promise<Response> {
  try {
    const [chainId, blockNumber, balance] = await Promise.all([
      polkadotHubPublicClient.getChainId(),
      polkadotHubPublicClient.getBlockNumber(),
      polkadotHubPublicClient.getBalance({
        address: polkadotHubAccount.address,
      }),
    ]);

    return jsonResponse(
      {
        ok: true,
        chainId,
        expectedChainId: polkadotHubChain.id,
        blockNumber: blockNumber.toString(),
        address: polkadotHubAccount.address,
        balance: balance.toString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("polkadot-hub ping error", err);
    return jsonResponse(
      { ok: false, error: "Failed to query Polkadot Hub", details: String(err) },
      { status: 500 }
    );
  }
}
