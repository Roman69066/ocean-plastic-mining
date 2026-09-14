import { test } from "node:test";
import assert from "node:assert/strict";
import {
  countVisitors,
  defaultCounterNamespace,
  visitorHash,
} from "../lib/site-stats.ts";
import {
  localizedPublicLaunchDate,
  PUBLIC_LAUNCH_DATE,
  runningDays,
} from "../lib/uptime.ts";
const id = "bde26d09-2d11-42b1-85e9-208c7975a9c1";
test("public running time always uses the canonical launch date", () => {
  assert.equal(PUBLIC_LAUNCH_DATE, "2026-09-13");
  assert.equal(runningDays(Date.parse("2026-09-13T23:59:59Z")), 0);
  assert.equal(runningDays(Date.parse("2026-09-14T00:00:00Z")), 1);
  assert.equal(runningDays(Date.parse("2026-10-10T12:00:00Z")), 27);
  assert.equal(localizedPublicLaunchDate("en"), "September 13, 2026");
  assert.match(localizedPublicLaunchDate("zh"), /2026.*9.*13/);
  assert.throws(() => runningDays(Number.NaN));
});
test("default counter namespaces isolate deployment environments", () => {
  assert.equal(defaultCounterNamespace("production"), "opm-production");
  assert.equal(defaultCounterNamespace("preview"), "opm-preview");
  assert.equal(defaultCounterNamespace("development"), "opm-development");
  assert.equal(defaultCounterNamespace(), "opm-local");
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
test("the same anonymous browser ID is deduplicated", async () => {
  const hashes = new Set<string>();
  const fetcher: typeof fetch = async (_url, init) => {
    const command = JSON.parse(String(init?.body)) as string[];
    hashes.add(command.at(-1)!);
    return Response.json({ result: hashes.size });
  };
  const config = { url: "https://counter.example.test", token: "test-only" };
  assert.equal(await countVisitors(config, id, fetcher), 1);
  assert.equal(await countVisitors(config, id, fetcher), 1);
  assert.equal(
    await countVisitors(
      config,
      "0edc5ca5-7481-4f5d-97d7-d39e29156cf8",
      fetcher,
    ),
    2,
  );
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
