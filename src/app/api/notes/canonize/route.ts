// src/app/api/notes/canonize/route.ts
import { jsonResponse } from "@/utils/http";
import { canonizeNote } from "@/services/canonService";

type CanonizeBody = {
  entityKey?: `0x${string}`;
  boardId?: string;
  sceneId?: string;
  text?: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: CanonizeBody = await req.json();

    if (!body.entityKey || !body.boardId || !body.sceneId || !body.text) {
      return jsonResponse(
        { error: "entityKey, boardId, sceneId, text required" },
        { status: 400 }
      );
    }

    const result = await canonizeNote({
      entityKey: body.entityKey,
      boardId: body.boardId,
      sceneId: body.sceneId,
      text: body.text,
    });

    return jsonResponse({ ok: true, ...result }, { status: 200 });
  } catch (err) {
    console.error("canonizeNote error", err);
    return jsonResponse(
      { error: "internal error", details: String(err) },
      { status: 500 }
    );
  }
}
