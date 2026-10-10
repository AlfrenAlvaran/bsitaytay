import "server-only";
import os from "os";
import path from "path";
import { createWorker } from "tesseract.js";

export function createOcrWorker() {
  return createWorker("eng", 1, {
    workerPath: path.join(
      process.cwd(),
      "node_modules/tesseract.js/src/worker-script/node/index.js",
    ),
    corePath: path.join(process.cwd(), "node_modules/tesseract.js-core"),
    langPath: path.join(process.cwd(), "tessdata"),
    cachePath: os.tmpdir(),
    logger: (m) => console.log("[tesseract]", m.status, m.progress),
    errorHandler: (err) => console.error("[tesseract error]", err),
  });
}