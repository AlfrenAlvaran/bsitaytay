import { requireSession } from "@/lib/auth/session";
import { handle, ok } from "@/lib/http/handler";
import { getCurrentUser } from "@/server/services/session.service";

export const GET = handle(async () => {
  const { id } = await requireSession();
  const res = await getCurrentUser(id);

  return ok(res, "", 200);
});
