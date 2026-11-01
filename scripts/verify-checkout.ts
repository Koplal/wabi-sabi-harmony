/**
 * Checks the checkout function's cart rules with Stripe stubbed and a fake key.
 * Nothing leaves this process, so this proves our own behaviour and not Stripe's.
 *
 *   npm run verify:checkout
 *
 * Exit codes: 0 pass, 1 failures.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { POST } from "../api/create-checkout";
import { CLOSED_PACKAGES, PRICE_FILES } from "./verify/rules";

const CLOSED_ADD_ON = "cozy-cabin-candles";
const CLOSED_ADD_ON_NAME = "Additional LED Candles (4) (add-on for The Cozy Cabin)";
const CLOSED_FALL_ADD_ON = "quiet-grace-arrangement";
const CLOSED_FALL_ADD_ON_NAME = "Professional Arrangement (add-on for The Quiet Grace)";
const OPEN_PACKAGE = "fresh-start";
/** Winter's 20 items, plus fall's 21: five packages at four rows each and a fifth add-on on The Quiet Grace. */
const CLOSED_ITEM_COUNT = 41;

/** Every catalogue id, read from the source so an add-on can't be missed. */
const catalogueIds = [...readFileSync(PRICE_FILES.catalogue, "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{ name:/gm)].map((match) => match[1]);
const inClosedSeason = (id: string) => CLOSED_PACKAGES.some((pack) => id === pack || id.startsWith(`${pack}-`));
const closedIds = catalogueIds.filter(inClosedSeason);
const openIds = catalogueIds.filter((id) => !inClosedSeason(id));

process.env.STRIPE_SECRET_KEY = "test-not-a-real-key";
console.error = () => undefined;

let stripeCalls = 0;
globalThis.fetch = (async () => {
  stripeCalls++;
  return Response.json({ id: "stubbed", url: "https://example.test/pay" });
}) as typeof fetch;

let passed = 0;
const failures: string[] = [];

async function check(name: string, run: () => Promise<void>) {
  stripeCalls = 0;
  try {
    await run();
    passed++;
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const buy = (ids: string[]) =>
  POST(
    new Request("https://wabisabiservices.ca/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ids.map((id) => ({ id })), customerInfo: { name: "Ann", email: "ann@example.ca" } }),
    })
  );

async function expectClosed(ids: string[], ...named: string[]) {
  const response = await buy(ids);
  assert.equal(response.status, 400);
  const { error } = await response.json();
  assert.match(error, /^Closed for 2026, please remove: /);
  for (const name of named) assert.ok(error.includes(name), `${name} is not in "${error}"`);
  assert.equal(stripeCalls, 0);
}

async function main() {
  await check("finds every closed item in the catalogue", async () => assert.equal(closedIds.length, CLOSED_ITEM_COUNT));
  for (const id of closedIds) {
    await check(`refuses ${id}`, () => expectClosed([id]));
  }
  await check("names a closed add-on the way the cart shows it", () => expectClosed([CLOSED_ADD_ON], CLOSED_ADD_ON_NAME));
  await check("names a closed fall add-on the way the cart shows it", () => expectClosed([CLOSED_FALL_ADD_ON], CLOSED_FALL_ADD_ON_NAME));
  await check("names every closed item at once", () => expectClosed(["cozy-cabin", CLOSED_ADD_ON], "The Cozy Cabin,", CLOSED_ADD_ON_NAME));
  await check("refuses a closed item beside an open one", () => expectClosed([OPEN_PACKAGE, "cozy-cabin"], "The Cozy Cabin"));
  for (const id of openIds) {
    await check(`sends ${id} to Stripe`, async () => {
      const response = await buy([id]);
      assert.equal(response.status, 200);
      assert.equal(stripeCalls, 1);
    });
  }

  for (const failure of failures) console.log(`FAIL  ${failure}`);
  console.log(`verify:checkout: ${passed} passed, ${failures.length} failed.`);
  process.exitCode = failures.length > 0 ? 1 : 0;
}

await main();
