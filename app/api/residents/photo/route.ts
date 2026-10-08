import { handle, ok } from "@/lib/http/handler";
import { readImage } from "@/lib/http/read-image";
import { checkRateLimit, clientIp } from "@/lib/limiter/rate-limit";
import { uploadProfilePhoto } from "@/server/services/registration.service";
import { ApiError } from "@/utils/api-error";

export const POST = handle(async (req) => {
  try {
    if (!(await checkRateLimit(`photo:${clientIp(req)}`, 20, 600))) {
      throw ApiError.tooMany("Too many request. Try again later");
    }

    const { buffer } = await readImage(req, "photoFile");

    return ok(await uploadProfilePhoto(buffer));
  } catch (error) {
    console.error("photo upload failed", error);
    throw error;
  }
});
