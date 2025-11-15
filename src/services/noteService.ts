// src/services/noteService.ts
// Shared business logic for working with Arkiv notes. Routes call into these helpers.
import {
  publicClient,
  walletClient,
  ONE_DAY,
  minutesToExpiration,
} from "@/lib/arkivClient";
import { eq } from "@arkiv-network/sdk/query";
import { jsonToPayload } from "@arkiv-network/sdk/utils";
import type { Entity } from "@arkiv-network/sdk";
import type {
  ExtendNoteInput,
  NotePayload,
  OpenNoteInput,
  StoredNote,
} from "@/types/note";

const NOTE_TTL_MINUTES = 60 * 24; // 24 hours
const NOTE_ATTRIBUTE_TYPE = "note";

/**
 * Creates a new Arkiv entity that stores our note payload plus useful attributes.
 */
export async function openNote(input: OpenNoteInput) {
  const note: NotePayload = {
    boardId: input.boardId,
    sceneId: input.sceneId,
    text: input.text.slice(0, 500),
    lat: input.lat,
    lng: input.lng,
    ttlMinutes: input.ttlMinutes ?? NOTE_TTL_MINUTES,
    tier: input.tier ?? "free",
    source: input.source ?? "snap_lens",
  };

  const attributes = [
    { key: "type", value: NOTE_ATTRIBUTE_TYPE },
    { key: "boardId", value: note.boardId },
    { key: "sceneId", value: note.sceneId },
    { key: "tier", value: note.tier },
  ];

  const payload = jsonToPayload(note);

  const expiresIn =
    note.ttlMinutes === NOTE_TTL_MINUTES
      ? ONE_DAY
      : minutesToExpiration(note.ttlMinutes);

  const { entityKey, txHash } = await walletClient.createEntity({
    payload,
    contentType: "application/json",
    attributes,
    expiresIn,
  });

  return { entityKey, txHash, note };
}

/**
 * Returns the decoded notes for a board/scene pair, including Arkiv metadata.
 */
export async function listNotes(boardId: string, sceneId?: string) {
  const predicates = [
    eq("type", NOTE_ATTRIBUTE_TYPE),
    eq("boardId", boardId),
  ];

  if (sceneId) {
    predicates.push(eq("sceneId", sceneId));
  }

  const result = await publicClient
    .buildQuery()
    .where(predicates)
    .withAttributes(true)
    .withPayload(true)
    .limit(100)
    .fetch();

  return result.entities.map(mapEntityToStoredNote);
}

/**
 * Extends the lifetime of an existing note entity (defaults to another day).
 */
export async function extendNote(input: ExtendNoteInput) {
  const expiresIn = input.ttlMinutes
    ? minutesToExpiration(input.ttlMinutes)
    : ONE_DAY;

  const { entityKey, txHash } = await walletClient.extendEntity({
    entityKey: input.entityKey,
    expiresIn,
  });

  return {
    entityKey,
    txHash,
    ttlMinutes: input.ttlMinutes ?? NOTE_TTL_MINUTES,
  };
}

const mapEntityToStoredNote = (entity: Entity): StoredNote => {
  const payload = entity.toJson() as Partial<NotePayload>;
  const boardId =
    payload.boardId ??
    attributeToString(getAttributeValue(entity, "boardId")) ??
    "";
  const sceneId =
    payload.sceneId ??
    attributeToString(getAttributeValue(entity, "sceneId")) ??
    "";

  return {
    boardId,
    sceneId,
    text: payload.text ?? "",
    lat: payload.lat,
    lng: payload.lng,
    ttlMinutes: payload.ttlMinutes ?? NOTE_TTL_MINUTES,
    tier: payload.tier ?? "free",
    source: payload.source ?? "snap_lens",
    entityKey: entity.key,
    owner: entity.owner,
    attributes: entity.attributes,
    expiresAtBlock: entity.expiresAtBlock,
    createdAtBlock: entity.createdAtBlock,
    lastModifiedAtBlock: entity.lastModifiedAtBlock,
  };
};

const getAttributeValue = (entity: Entity, key: string) =>
  entity.attributes.find((attribute) => attribute.key === key)?.value;

const attributeToString = (value?: string | number) =>
  value === undefined ? undefined : String(value);
