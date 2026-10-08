import { setAuthCookies } from "@/lib/auth/auth.cookie";
import { handle, ok, readJson, sessionMeta } from "@/lib/http/handler";
import { loginSchema } from "@/lib/validators/auth.validator";
import { loginUser } from "@/server/services/session.service";
import { ApiError } from "@/utils/api-error";


export const POST = handle(async (req) => {
  const parsed = loginSchema.safeParse({ body: await readJson(req) });

  if (!parsed.success)
    throw ApiError.badRequest("Enter a valid email and password");


  
  const { user, accessToken, refreshToken } = await loginUser(
     parsed.data.body,
    sessionMeta(req),
  )

  await setAuthCookies(accessToken, refreshToken);

  return ok(user, "Authenticated successfully");
});
