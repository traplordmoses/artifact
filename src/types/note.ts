// src/types/note.ts
// Shared note-related types so service and route handlers stay in sync.
import type { Attribute } from "@arkiv-network/sdk";
import type { Hex } from "viem";

export type NoteTier = "free" | "extended";

// JSON payload that is stored inside Arkiv entities.
export interface NotePayload {
  boardId: string;
  sceneId: string;
  text: string;
  lat?: number;
  lng?: number;
  ttlMinutes: number;
  tier: NoteTier;
  source: "snap_lens" | "web";
}

// Input used when opening/creating a new note entity.
export interface OpenNoteInput {
  boardId: string;
  sceneId: string;
  text: string;
  lat?: number;
  lng?: number;
  tier?: NoteTier;
  ttlMinutes?: number;
  source?: "snap_lens" | "web";
}

// Input used when extending an existing entity.
export interface ExtendNoteInput {
  entityKey: Hex;
  ttlMinutes?: number;
}

// Note plus the Arkiv metadata that wraps the JSON payload.
export interface StoredNote extends NotePayload {
  entityKey: Hex;
  owner?: Hex;
  attributes: Attribute[];
  expiresAtBlock?: bigint;
  createdAtBlock?: bigint;
  lastModifiedAtBlock?: bigint;
}
