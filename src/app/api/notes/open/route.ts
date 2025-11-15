// app/api/notes/open/route.ts
// POST /api/notes/open – creates a new Arkiv entity that represents a note on the board.
import { openNote } from "@/services/noteService";
import { jsonResponse } from "@/utils/http";

type OpenNoteBody = {
  boardId?: string;
  sceneId?: string;
  text?: string;
  lat?: number;
  lng?: number;
  ttlMinutes?: number;
  tier?: "free" | "extended";
  source?: "snap_lens" | "web";
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: OpenNoteBody = await req.json();

    if (!body.text || !body.boardId || !body.sceneId) {
      return jsonResponse(
        { error: "text, boardId, sceneId required" },
        { status: 400 }
      );
    }

    const { entityKey, txHash, note } = await openNote({
      boardId: body.boardId,
      sceneId: body.sceneId,
      text: body.text,
      lat: body.lat,
      lng: body.lng,
      ttlMinutes: body.ttlMinutes,
      tier: body.tier,
      source: body.source,
    });

    return jsonResponse({ ok: true, entityKey, txHash, note }, { status: 200 });
  } catch (err) {
    console.error("openNote error", err);
    return jsonResponse({ error: "internal error" }, { status: 500 });
  }
}
