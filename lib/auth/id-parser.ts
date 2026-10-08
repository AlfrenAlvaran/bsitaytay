export interface ParsedIdFields {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  address: string | null;
  dateOfBirth: string | null;
  idNumber: string | null;
}

type Key = keyof ParsedIdFields;

const LABELS: Array<[Key, RegExp]> = [
  ["middleName", /(gitnang\s*apelyido|middle\s*names?)/i],
  ["lastName", /(apelyido|last\s*names?|surname)/i],
  ["firstName", /(mga\s*pangalan|given\s*names?|first\s*names?)/i],
  [
    "dateOfBirth",
    /(petsa\s*ng\s*kapanganakan|date\s*of\s*birth|birth\s*date|birthday|\bdob\b)/i,
  ],
  ["address", /(tirahan|address|residence)/i],
  ["idNumber", /(license\s*no|id\s*(?:no|number)|control\s*no|pcn|philsys)/i],
];

const COMBINED_NAME_HEADER = /last\s*name.*first\s*name/i;

// PhilSys cards print the 16-digit number with no label
const PHILSYS_NUMBER = /\b\d{4}-\d{4}-\d{4}-\d{4}\b/;

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

const letterCount = (text: string) => (text.match(/\p{L}/gu) ?? []).length;

// Leftover bits of bilingual labels. OCR often splits "Mga Pangalan/Given Names"
// across lines and leaves "Given" / "Names|" behind.
const LABEL_WORDS =
  /\b(?:given|names?|last|first|middle|surname|date|of|birth|mga|pangalan|apelyido|gitnang|petsa|ng|kapanganakan|tirahan|address)\b/gi;

const withoutLabelWords = (text: string) => text.replace(LABEL_WORDS, " ");

function labelOf(line: string): Key | null {
  for (const [key, pattern] of LABELS) if (pattern.test(line)) return key;
  return null;
}

function stripLabels(text: string): string {
  let result = text;
  for (const [, pattern] of LABELS)
    result = result.replace(new RegExp(pattern.source, "gi"), " ");
  return result.replace(/^[\s/:|.,-]+/, "").trim();
}

function cleanName(raw: string | null): string | null {
  if (!raw) return null;

  // drop label leftovers and symbol-only noise like "~~", "=", "—"
  const text = withoutLabelWords(stripLabels(raw))
    .split(/\s+/)
    .filter((token) => /\p{L}/u.test(token))
    .join(" ")
    .trim();

  if (letterCount(text) < 3) return null;
  if (/[^\p{L}\p{M}\s'.,-]/u.test(text)) return null;

  const tokens = text.split(/\s+/).filter(Boolean);
  const words = tokens.filter((token) => letterCount(token) >= 2);
  if (tokens.length === 0 || words.length / tokens.length < 0.6) return null;

  const cleaned = words
    .join(" ")
    .replace(/[,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return letterCount(cleaned) >= 3 ? cleaned : null;
}

type ValueKind = "name" | "text" | "any";

function nextValueLines(
  lines: string[],
  index: number,
  count: number,
  kind: ValueKind = "any",
): string[] {
  const found: string[] = [];
  // names can sit several noisy lines below their label; the loop still
  // stops at the next label, so a larger reach is safe
  const reach = kind === "name" ? 10 : 3;

  for (
    let j = index + 1;
    j < lines.length && found.length < count && j <= index + reach;
    j++
  ) {
    const line = lines[j];
    if (labelOf(line) || COMBINED_NAME_HEADER.test(line)) break;

    if (kind === "name") {
      if (/\d/.test(line)) continue; // ID numbers, dates
      if (letterCount(withoutLabelWords(line)) < 3) continue; // "Names|", noise
      found.push(line);
    } else if (kind === "text") {
      if (PHILSYS_NUMBER.test(line)) continue; // don't pull the card number into an address
      if (letterCount(line) >= 3) found.push(line);
    } else if (letterCount(line) >= 3 || /\d/.test(line)) {
      found.push(line);
    }
  }
  return found;
}

function toIso(year: string, month: string, day: string): string | null {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (
    y < 1900 ||
    y > new Date().getFullYear() ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  )
    return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1) return null;
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseDate(text: string): string | null {
  const iso = text.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (iso) return toIso(iso[1], iso[2], iso[3]);

  const monthFirst = text.match(/([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (monthFirst) {
    const month = MONTHS[monthFirst[1].slice(0, 3).toLowerCase()];
    if (month) return toIso(monthFirst[3], month, monthFirst[2]);
  }

  const dayFirst = text.match(/(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})/);
  if (dayFirst) {
    const month = MONTHS[dayFirst[2].slice(0, 3).toLowerCase()];
    if (month) return toIso(dayFirst[3], month, dayFirst[1]);
  }

  const numeric = text.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (numeric) {
    const a = Number(numeric[1]);
    const b = Number(numeric[2]);
    if (a > 12 && b <= 12) return toIso(numeric[3], numeric[2], numeric[1]);
    if (b > 12 && a <= 12) return toIso(numeric[3], numeric[1], numeric[2]);
  }
  return null;
}

function splitFullName(
  raw: string,
): Pick<ParsedIdFields, "firstName" | "lastName" | "middleName"> {
  const text = raw.trim().replace(/\s{2,}/g, " ");

  if (text.includes(",")) {
    const [lastPart, restPart = ""] = text
      .split(",")
      .map((part) => part.trim());
    const words = restPart.split(" ").filter(Boolean);
    return {
      lastName: cleanName(lastPart),
      firstName: cleanName(words[0] ?? null),
      middleName: cleanName(words.slice(1).join(" ")),
    };
  }

  const words = text.split(" ").filter(Boolean);
  if (words.length === 0)
    return { firstName: null, lastName: null, middleName: null };
  if (words.length === 1)
    return { firstName: cleanName(words[0]), lastName: null, middleName: null };
  if (words.length === 2)
    return {
      firstName: cleanName(words[0]),
      lastName: cleanName(words[1]),
      middleName: null,
    };
  return {
    firstName: cleanName(words[0]),
    middleName: cleanName(words.slice(1, -1).join(" ")),
    lastName: cleanName(words[words.length - 1]),
  };
}

export function parseIdText(rawText: string): {
  fields: ParsedIdFields;
  confidence: number;
} {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fields: ParsedIdFields = {
    firstName: null,
    lastName: null,
    middleName: null,
    address: null,
    dateOfBirth: null,
    idNumber: null,
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (COMBINED_NAME_HEADER.test(line)) {
      const [value] = nextValueLines(lines, i, 1);
      if (value) {
        const [last, ...rest] = value.split(",");
        fields.lastName ??= cleanName(last);
        fields.firstName ??= cleanName(rest.join(" "));
      }
      continue;
    }

    const key = labelOf(line);
    if (!key || fields[key]) continue;

    const sameLine = stripLabels(line);
    const kind: ValueKind =
      key === "firstName" || key === "lastName" || key === "middleName"
        ? "name"
        : key === "address"
          ? "text"
          : "any";
    const next = nextValueLines(lines, i, key === "address" ? 2 : 1, kind);

    switch (key) {
      case "firstName":
      case "lastName":
      case "middleName":
        fields[key] = cleanName(sameLine) ?? cleanName(next[0] ?? null);
        break;
      case "address": {
        const parts = letterCount(sameLine) >= 3 ? [sameLine, ...next] : next;
        const joined = parts.join(", ").replace(/\s+/g, " ").trim();
        fields.address = letterCount(joined) >= 5 ? joined : null;
        break;
      }
      case "dateOfBirth":
        fields.dateOfBirth = parseDate(`${sameLine} ${next[0] ?? ""}`);
        break;
      case "idNumber": {
        const token = `${sameLine} ${next[0] ?? ""}`.match(
          /[A-Z0-9][A-Z0-9-]{5,}/i,
        );
        fields.idNumber = token ? token[0] : null;
        break;
      }
    }
  }

  if (!fields.firstName && !fields.lastName) {
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(?:full\s*)?name\b\s*[:\-]?\s*(.*)$/i);
      if (!match) continue;
      const value = match[1].trim() || nextValueLines(lines, i, 1, "name")[0];
      if (value) {
        const split = splitFullName(value);
        fields.firstName = split.firstName;
        fields.lastName = split.lastName;
        fields.middleName ??= split.middleName;
      }
      break;
    }
  }

  if (!fields.idNumber) {
    fields.idNumber = rawText.match(PHILSYS_NUMBER)?.[0] ?? null;
  }

  const found = Object.values(fields).filter(Boolean).length;
  return { fields, confidence: found / 6 };
}