import { cookies } from "next/headers";
import { handle, ok } from "@/lib/http/handler";
import { logoutSession } from "@/server/services/session.service";
import { clearAuthCookies } from "@/lib/auth/auth.cookie";

export const POST = handle(async () => {
  await logoutSession((await cookies()).get("refresh_token")?.value);
  await clearAuthCookies();

  return ok(null, "Logout", 200);
});
