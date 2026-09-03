import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "sfh_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getAdminKey() {
  return process.env.ADMIN_ACCESS_KEY ?? "";
}

function getAllowedEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getAdminKey()).update(payload).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminConfigured() {
  return Boolean(getAdminKey() && getAllowedEmails().size);
}

export function createAdminSession(email: string, now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = `${email.toLowerCase()}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(value: string | undefined, now = Date.now()) {
  if (!value || !isAdminConfigured()) return null;
  const signatureSeparator = value.lastIndexOf(".");
  const expiresSeparator = value.lastIndexOf(".", signatureSeparator - 1);
  const email = expiresSeparator > 0 ? value.slice(0, expiresSeparator) : "";
  const expiresAtValue = expiresSeparator > 0 && signatureSeparator > expiresSeparator
    ? value.slice(expiresSeparator + 1, signatureSeparator)
    : "";
  const signature = signatureSeparator > expiresSeparator ? value.slice(signatureSeparator + 1) : "";
  const expiresAt = Number(expiresAtValue);
  if (
    !email ||
    !Number.isInteger(expiresAt) ||
    expiresAt < Math.floor(now / 1000) ||
    !signature ||
    !getAllowedEmails().has(email.toLowerCase()) ||
    !safeEqual(signature, sign(`${email}.${expiresAt}`))
  ) {
    return null;
  }
  return { email: email.toLowerCase(), expiresAt };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export function isAllowedAdminEmail(email: string) {
  return getAllowedEmails().has(email.trim().toLowerCase());
}

export function isValidAdminKey(value: string) {
  const configured = getAdminKey();
  return Boolean(configured) && safeEqual(value, configured);
}
