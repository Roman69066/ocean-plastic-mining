import { createHash } from "node:crypto";
export type CounterConfig = {
  url?: string;
  token?: string;
  namespace?: string;
};
export function configuredLaunchDate(
  value: string | undefined,
  now = Date.now(),
): string | null {
  if (
    !value ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  )
    return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= now
    ? new Date(timestamp).toISOString()
    : null;
}
export function visitorHash(id: string) {
  if (
    !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      id,
    )
  )
    throw new Error("Invalid anonymous ID");
  return createHash("sha256").update(id).digest("hex");
}
// SADD and SCARD execute atomically. Only random-browser-ID hashes are persisted.
export const incrementScript =
  "redis.call('SADD', KEYS[1], ARGV[1]); return redis.call('SCARD', KEYS[1])";
export async function countVisitors(
  config: CounterConfig,
  id?: string,
  fetcher: typeof fetch = fetch,
): Promise<number | null> {
  if (!config.url || !config.token) return null;
  const url = new URL(config.url);
  if (url.protocol !== "https:") throw new Error("Counter requires HTTPS");
  const namespace = config.namespace || "opm-production";
  if (!/^[a-zA-Z0-9:_-]{1,80}$/.test(namespace))
    throw new Error("Invalid counter namespace");
  const key = `${namespace}:visitors`;
  const command = id
    ? ["EVAL", incrementScript, "1", key, visitorHash(id)]
    : ["SCARD", key];
  const response = await fetcher(url.origin, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Counter service unavailable");
  const body = await response.json();
  if (body.error || !Number.isSafeInteger(body.result) || body.result < 0)
    throw new Error("Invalid counter response");
  return body.result;
}
