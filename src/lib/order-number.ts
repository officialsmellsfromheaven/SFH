import type { SupabaseClient } from "@supabase/supabase-js";

export function formatSFHOrderNumber(sequence: number | bigint, date: Date) {
  const value = typeof sequence === "bigint" ? sequence.toString() : String(sequence);
  if (!/^\d+$/.test(value) || value === "0") throw new Error("Invalid SFH order sequence.");
  const year = String(date.getUTCFullYear()).slice(-2);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `SFH-${year}-${month}${day}-${value.length < 3 ? value.padStart(3, "0") : value}`;
}

export async function allocateSFHOrderNumber(
  supabase: SupabaseClient,
  createdAt = new Date(),
) {
  const { data, error } = await supabase.rpc("next_sfh_order_number", {
    p_created_at: createdAt.toISOString(),
  });
  if (error || typeof data !== "string") throw error ?? new Error("Unable to allocate an order number.");
  console.info(`[OrderNumber] generated ${data}`);
  return data;
}

export function isValidOrderNumber(value: unknown): value is string {
  return typeof value === "string" && /^(?:SFH-\d{8}-[A-Za-z0-9]{4,12}|SFH-\d{2}-\d{4}-\d+)$/.test(value.trim());
}
