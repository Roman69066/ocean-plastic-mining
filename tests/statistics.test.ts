import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countVisitors,
  configuredLaunchDate,
  visitorHash,
} from "../lib/site-stats.ts";
import { uptimeParts } from "../lib/uptime.ts";
const id = "bde26d09-2d11-42b1-85e9-208c7975a9c1";
test("uptime uses first launch, never invents a launch date", () => {
  const now = Date.parse("2026-09-12T12:31:00Z");
  assert.equal(configuredLaunchDate(undefined, now), null);
  assert.equal(configuredLaunchDate("2027-01-01T00:00:00Z", now), null);
  assert.equal(configuredLaunchDate("invalid", now), null);
  assert.deepEqual(uptimeParts("2026-09-10T10:00:00Z", now), {
    days: 2,
    hours: 2,
    minutes: 31,
  });
});
test("counter is unavailable without backend, never a fabricated zero", async () => {
  assert.equal(await countVisitors({}), null);
});
test("only anonymous ID hashes leave the application and atomic set count is used", async () => {
  const sent: unknown[] = [];
  const fetcher: typeof fetch = async (_url, init) => {
    sent.push(JSON.parse(String(init?.body)));
    return Response.json({ result: 7 });
  };
  assert.equal(
    await countVisitors(
      { url: "https://counter.example.test", token: "test-only" },
      id,
      fetcher,
    ),
    7,
  );
  const command = sent[0] as string[];
  assert.equal(command[0], "EVAL");
  assert.equal(command.at(-1), visitorHash(id));
  assert.ok(!JSON.stringify(command).includes(id));
  assert.equal(visitorHash(id).length, 64);
  assert.throws(() => visitorHash("not-an-id"));
});
test("bad backend data and service failure remain unknown", async () => {
  for (const body of [
    { error: "failed" },
    { result: -1 },
    { result: "8" },
    {},
  ]) {
    await assert.rejects(
      countVisitors(
        { url: "https://counter.example.test", token: "test-only" },
        undefined,
        async () => Response.json(body),
      ),
    );
  }
  await assert.rejects(
    countVisitors({ url: "http://counter.example.test", token: "test-only" }),
  );
});
