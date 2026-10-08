import { handle, ok } from "@/lib/http/handler";
import { readImage } from "@/lib/http/read-image";
import { extractIdFields } from "@/server/services/id-extract.service";


export const maxDuration = 60;

export const POST = handle(async (req) => {
  const { buffer } = await readImage(req, "idFile");
  return ok(await extractIdFields(buffer), "ID Scanned");
});
