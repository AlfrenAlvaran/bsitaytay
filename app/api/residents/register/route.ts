import { registerResidentSchema } from "@/features/residents/schema/resident.schema";
import { handle, ok, readJson } from "@/lib/http/handler";
import { initiateRegistration } from "@/server/services/registration.service";
import { ApiError } from "@/utils/api-error";

export const POST = handle(async (req) => {
  const parsed = registerResidentSchema.safeParse(await readJson(req));

  if (!parsed.success) {
    throw ApiError.badRequest(
      "Please check your details and try again",
      // parsed.error.flatten().fieldErrors, // if ApiError supports details
    );
  }

  const res = await initiateRegistration(parsed.data);

  return ok(res, "Verification code sent", 201);
});