import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { secretEnv } from "./env";

const port = Number(secretEnv.SMTP_PORT) || 587;
const secure = String(secretEnv.SMTP_SECURE) === "true";

const options: SMTPTransport.Options = {
  host: secretEnv.SMTP_HOST,
  port,
  secure,
  auth: {
    user: secretEnv.SMTP_USER,
    pass: secretEnv.SMTP_PASS,
  },
  connectionTimeout: 8_000,
  greetingTimeout: 8_000,
  socketTimeout: 15_000,
  dnsTimeout: 5_000,
  ...({ family: 4 } as object),
};

export const transporter = secretEnv.SMTP_HOST
  ? nodemailer.createTransport(options)
  : null;

if (transporter && process.env.NODE_ENV !== "production") {
  transporter.verify().then(
    () => console.log("[mail] SMTP ready"),
    (err) => console.error("[mail] SMTP verify failed:", err),
  );
}

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string,
) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured");
    }
    console.log(`[mail:dev] to=${to} subject="${subject}"\n${text}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || secretEnv.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}