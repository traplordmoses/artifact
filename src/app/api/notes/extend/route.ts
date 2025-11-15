// app/api/notes/extend/route.ts
// POST /api/notes/extend – extends the lifespan of an existing note entity.
import { extendNote } from "@/services/noteService";
import { jsonResponse } from "@/utils/http";

type ExtendNoteBody = {
  entityKey?: `0x${string}`;
  ttlMinutes?: number;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ExtendNoteBody = await req.json();

    if (!body.entityKey) {
      return jsonResponse({ error: "entityKey required" }, { status: 400 });
    }

    const ttlMinutes =
      typeof body.ttlMinutes === "number" && body.ttlMinutes > 0
        ? body.ttlMinutes
        : undefined;

    const result = await extendNote({
      entityKey: body.entityKey,
      ttlMinutes,
    });

    return jsonResponse({ ok: true, ...result }, { status: 200 });
  } catch (err) {
    console.error("extendNote error", err);
    return jsonResponse({ error: "internal error" }, { status: 500 });
  }
}
