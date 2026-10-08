import { sendMail } from "@/lib/config/mailer";
const BRAND = {
  name: "Brgy. San Isidro",
  location: "Taytay, Rizal",
  tagline: "LOCAL GOVERNMENT UNIT",
  eyebrow: "REPUBLIC OF THE PHILIPPINES · PROVINCE OF RIZAL",
  navy: "#0f172a",
  navySoft: "#1e293b",
  gold: "#c9972b",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  bg: "#f1f5f9",
  // Must be a public https URL (emails can't load local files)
  logoUrl: process.env.MAIL_LOGO_URL ?? "",
  siteUrl: process.env.APP_URL ?? "https://example.com",
  contact: process.env.BARANGAY_CONTACT ?? "barangay.sanisidro@example.com",
};

const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export interface EmailContent {
  preheader?: string;
  title: string;
  greeting?: string;
  paragraphs: string[];
  details?: { label: string; value: string }[];
  cta?: { label: string; url: string };
  highlight?: string; // e.g. OTP code or reference number
  footnote?: string;
}

export function renderEmail(c: EmailContent): { html: string; text: string } {
  const logo = BRAND.logoUrl
    ? `<img src="${BRAND.logoUrl}" width="48" height="48" alt="${BRAND.name}" style="display:block;border:0;border-radius:50%;" />`
    : "";

  const details = c.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid ${BRAND.border};border-radius:8px;border-collapse:separate;">
        ${c.details
          .map(
            (d, i) => `<tr>
          <td style="padding:12px 16px;font-size:13px;color:${BRAND.muted};width:40%;${i ? `border-top:1px solid ${BRAND.border};` : ""}">${esc(d.label)}</td>
          <td style="padding:12px 16px;font-size:14px;font-weight:600;color:${BRAND.text};${i ? `border-top:1px solid ${BRAND.border};` : ""}">${esc(d.value)}</td>
        </tr>`,
          )
          .join("")}
      </table>`
    : "";

  const highlight = c.highlight
    ? `<div style="margin:24px 0;padding:20px;text-align:center;background:${BRAND.bg};border-left:4px solid ${BRAND.gold};border-radius:6px;">
        <span style="font-size:30px;font-weight:700;letter-spacing:6px;color:${BRAND.navy};">${esc(c.highlight)}</span>
      </div>`
    : "";

  const cta = c.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
        <tr><td style="background:${BRAND.navy};border-radius:8px;">
          <a href="${c.cta.url}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${esc(c.cta.label)}</a>
        </td></tr>
      </table>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${esc(c.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:${FONT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(c.preheader ?? c.title)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">

    <!-- Header -->
    <tr><td style="background:${BRAND.navy};padding:28px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        ${logo ? `<td style="padding-right:14px;">${logo}</td>` : ""}
        <td style="font-family:${FONT};">
          <div style="font-size:18px;font-weight:700;color:#ffffff;">${BRAND.name} <span style="font-size:12px;font-weight:400;color:#94a3b8;">${BRAND.location}</span></div>
          <div style="font-size:10px;letter-spacing:2px;color:#94a3b8;margin-top:2px;">${BRAND.tagline}</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="height:3px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Body -->
    <tr><td style="padding:36px 32px 12px;font-family:${FONT};color:${BRAND.text};">
      <div style="font-size:11px;font-weight:600;letter-spacing:2px;color:${BRAND.gold};margin-bottom:10px;">${BRAND.eyebrow}</div>
      <h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:${BRAND.navy};">${esc(c.title)}</h1>
      ${c.greeting ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;">${esc(c.greeting)}</p>` : ""}
      ${c.paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;">${esc(p)}</p>`).join("")}
      ${highlight}
      ${details}
      ${cta}
      ${c.footnote ? `<p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:${BRAND.muted};">${esc(c.footnote)}</p>` : ""}
      <p style="margin:24px 0 0;font-size:15px;line-height:1.7;">Respectfully,<br /><strong>Office of the Barangay Captain</strong><br />${BRAND.name}, ${BRAND.location}</p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:24px 32px 32px;font-family:${FONT};">
      <div style="border-top:1px solid ${BRAND.border};padding-top:20px;font-size:12px;line-height:1.7;color:${BRAND.muted};">
        This is an automated message from the ${BRAND.name} online services portal. Please do not reply directly to this email.<br />
        Questions? Contact us at <a href="mailto:${BRAND.contact}" style="color:${BRAND.navySoft};">${BRAND.contact}</a>
        or visit <a href="${BRAND.siteUrl}" style="color:${BRAND.navySoft};">${BRAND.siteUrl.replace(/^https?:\/\//, "")}</a>.
      </div>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  // Plain-text fallback
  const text = [
    `${BRAND.name}, ${BRAND.location} — ${BRAND.tagline}`,
    "",
    c.title,
    "",
    c.greeting ?? "",
    ...c.paragraphs,
    c.highlight ? `\n${c.highlight}\n` : "",
    ...(c.details?.map((d) => `${d.label}: ${d.value}`) ?? []),
    c.cta ? `\n${c.cta.label}: ${c.cta.url}` : "",
    c.footnote ? `\n${c.footnote}` : "",
    "",
    "Respectfully,",
    "Office of the Barangay Captain",
    `${BRAND.name}, ${BRAND.location}`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  return { html, text };
}

/** Send any branded email through your existing sendMail(). */
export async function sendBrandedMail(
  to: string,
  subject: string,
  content: EmailContent,
) {
  const { html, text } = renderEmail(content);
  return sendMail(to, subject, text, html);
}

// ---------- Ready-made presets ----------

export function certificateRequestReceived(
  to: string,
  name: string,
  refNo: string,
  type: string,
) {
  return sendBrandedMail(to, `Request received — ${refNo}`, {
    preheader: `We received your request for ${type}.`,
    title: "We received your certificate request",
    greeting: `Good day, ${name},`,
    paragraphs: [
      "Thank you for using the Barangay San Isidro online services. Your request has been received and is now being reviewed by our staff.",
    ],
    details: [
      { label: "Reference No.", value: refNo },
      { label: "Document", value: type },
      { label: "Status", value: "Under review" },
      { label: "Average processing", value: "Within 24 hours" },
    ],
    cta: {
      label: "Track my request",
      url: `${BRAND.siteUrl}/requests/${encodeURIComponent(refNo)}`,
    },
    footnote: "You will receive another email once your certificate is ready.",
  });
}

export function certificateReady(
  to: string,
  name: string,
  refNo: string,
  type: string,
) {
  return sendBrandedMail(to, `Your ${type} is ready`, {
    preheader: `Your ${type} is ready for release.`,
    title: "Your certificate is ready",
    greeting: `Good day, ${name},`,
    paragraphs: [
      `Your ${type} has been approved. Please present a valid ID and your reference number at the Barangay Hall to claim it.`,
    ],
    details: [
      { label: "Reference No.", value: refNo },
      { label: "Document", value: type },
      { label: "Status", value: "Ready for release" },
    ],
    cta: {
      label: "View request",
      url: `${BRAND.siteUrl}/requests/${encodeURIComponent(refNo)}`,
    },
  });
}

export function verificationCode(
  to: string,
  name: string | undefined,
  code: string,
  minutes = 10,
) {
  return sendBrandedMail(to, "Your verification code", {
    preheader: `Your code is ${code}.`,
    title: "Verify your account",
    greeting: name ? `Good day, ${name},` : "Good day,",
    paragraphs: [
      "Use the code below to complete your registration. Never share this code with anyone.",
    ],
    highlight: code,
    footnote: `This code expires in ${minutes} minutes. If you didn't request it, you can safely ignore this email.`,
  });
}


export function registrationApproved(to: string, name?: string) {
  return sendBrandedMail(to, "Your registration has been approved", {
    preheader: "Your Barangay San Isidro account is now active.",
    title: "Your registration has been approved",
    greeting: name ? `Good day, ${name},` : "Good day,",
    paragraphs: [
      "We are pleased to inform you that your registration with the Barangay San Isidro online services portal has been verified and approved.",
      "You may now sign in to request certificates, track your requests, and use other barangay services online.",
    ],
    details: [
      ...(name ? [{ label: "Account holder", value: name }] : []),
      { label: "Status", value: "Approved" },
    ],
    cta: {
      label: "Sign in to your account",
      url: `${BRAND.siteUrl}/login`,
    },
    footnote:
      "Please keep your login credentials private and never share them with anyone.",
  });
}
export function registrationRejected(
  to: string,
  name: string,
  reason?: string,
) {
  return sendBrandedMail(to, "Update on your registration", {
    preheader: "We were unable to approve your registration.",
    title: "Your registration could not be approved",
    greeting: `Good day, ${name},`,
    paragraphs: [
      "Thank you for your interest in the Barangay San Isidro online services portal. After reviewing your submission, we were unable to approve your registration at this time.",
      "You may correct the concern below and submit a new registration, or visit the Barangay Hall with a valid ID so our staff can assist you.",
    ],
    details: [
      { label: "Account holder", value: name },
      { label: "Status", value: "Not approved" },
      ...(reason ? [{ label: "Reason", value: reason }] : []),
    ],
    cta: {
      label: "Register again",
      url: `${BRAND.siteUrl}/register`,
    },
    footnote: `If you believe this was a mistake, please contact us at ${BRAND.contact}.`,
  });
}