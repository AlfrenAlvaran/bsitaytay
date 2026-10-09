
import { connection } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { handle, ok } from "@/lib/http/handler";
import { getCurrentUser } from "@/server/services/session.service";

const handler = handle(async (req) => {
  const { id } = await requireSession(req);
  const res = await getCurrentUser(id);

  return ok(res, "", 200);
});

export async function GET(req: Request) {
  await connection();
  return handler(req, undefined);
}