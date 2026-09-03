import crypto from "node:crypto";

const ACCESS_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

function getAccessSecret() {
  return process.env.ORDER_ACCESS_SECRET || process.env.RAZORPAY_KEY_SECRET || "development-order-access-secret";
}

export function createOrderAccessToken(orderNumber: string, now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + ACCESS_TOKEN_TTL_SECONDS;
  const payload = `${orderNumber}.${expiresAt}`;
  const signature = crypto.createHmac("sha256", getAccessSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyOrderAccessToken(orderNumber: string, token: string, now = Date.now()) {
  const [tokenOrderNumber, expiresAtValue, signature] = token.split(".");
  const expiresAt = Number(expiresAtValue);
  if (tokenOrderNumber !== orderNumber || !Number.isInteger(expiresAt) || expiresAt < Math.floor(now / 1000) || !signature) {
    return false;
  }

  const payload = `${tokenOrderNumber}.${expiresAt}`;
  const expected = crypto.createHmac("sha256", getAccessSecret()).update(payload).digest("hex");
  const providedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return providedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}
