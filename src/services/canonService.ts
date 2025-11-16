// src/services/canonService.ts
import {
  polkadotHubWalletClient,
  polkadotHubAccount,
} from "@/lib/polkadotHubClient";
import { keccak256, toHex, stringToBytes } from "viem";

type CanonizeNoteInput = {
  entityKey: `0x${string}`;
  boardId: string;
  sceneId: string;
  text: string;
};

export type CanonizedNote = {
  entityKey: `0x${string}`;
  boardId: string;
  sceneId: string;
  textHash: `0x${string}`;
  txHash: `0x${string}`;
  rawPayload: string;
  dataHex: `0x${string}`;
};

export async function canonizeNote(
  input: CanonizeNoteInput
): Promise<CanonizedNote> {
  // Hash the text so we're not dumping full content if we don't want to
  const textHash = keccak256(stringToBytes(input.text)) as `0x${string}`;

  const payloadObj = {
    t: "ARTEFACT_CANON",
    entityKey: input.entityKey,
    boardId: input.boardId,
    sceneId: input.sceneId,
    textHash,
  };

  const rawPayload = JSON.stringify(payloadObj);
  const dataHex = toHex(stringToBytes(rawPayload)) as `0x${string}`;

  const txHash = await polkadotHubWalletClient.sendTransaction({
    to: polkadotHubAccount.address,
    value: 0n,
    data: dataHex,
  });

  return {
    entityKey: input.entityKey,
    boardId: input.boardId,
    sceneId: input.sceneId,
    textHash,
    txHash,
    rawPayload,
    dataHex,
  };
}
