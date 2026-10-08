import { verifySchema } from "@/features/residents/schema/resident.schema";
import { handle, ok, readJson } from "@/lib/http/handler";
import { verifyRegistration } from "@/server/services/registration.service";
import { ApiError } from "@/utils/api-error";

export const POST = handle(async (req) => {
  const parsed = verifySchema.safeParse(await readJson(req));

  if (!parsed.success) {
    throw ApiError.badRequest("Please check your details and try again");
  }
  const { email, otp } = parsed.data;

  const res = await verifyRegistration(email, otp);

  return ok(res, "OTP Successfully Verified", 200);
});
