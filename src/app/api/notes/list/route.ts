// app/api/notes/list/route.ts
// GET /api/notes/list – returns the notes for a given board/scene combination.
import { listNotes } from "@/services/noteService";
import { jsonResponse } from "@/utils/http";

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId") ?? "sub0";
    const sceneId = searchParams.get("sceneId") ?? undefined;

    const notes = await listNotes(boardId, sceneId);

    return jsonResponse({ boardId, sceneId, notes }, { status: 200 });
  } catch (err) {
    console.error("listNotes error", err);
    return jsonResponse({ error: "internal error" }, { status: 500 });
  }
}
