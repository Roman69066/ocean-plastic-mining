import { test } from "node:test";
import assert from "node:assert/strict";
import { annualize, calculateCost, type CostInput } from "../lib/cost-model.ts";
const scenario: CostInput = {
  capex: 1000,
  lifetime: 10,
  rate: 0,
  opex: 80,
  search: 20,
  energy: 30,
  logistics: 40,
  maintenance: 10,
  processing: 10,
  disposal: 5,
  compliance: 5,
  tonnes: 10,
  resourceRevenue: 240,
  publicPayment: 30,
};
test("known ledger produces gross cost and distinct viability boundaries", () => {
  const r = calculateCost(scenario);
  assert.equal(r.capital, 100);
  assert.equal(r.operating, 200);
  assert.equal(r.lcocr, 30);
  assert.equal(r.t1Operating, 70);
  assert.equal(r.t1Full, -30);
  assert.equal(r.t2, -60);
  assert.equal(calculateCost({ ...scenario, publicPayment: 10000 }).lcocr, 30);
});
test("discounting handles zero and near-zero rates continuously", () => {
  assert.equal(annualize(1000, 10, 0), 100);
  assert.ok(Math.abs(annualize(1000, 10, 5) - 129.5045749654566) < 1e-9);
  assert.ok(Math.abs(annualize(1000, 10, 1e-10) - 100) < 1e-6);
});
test("unknown, negative, zero denominator and overflow never produce published costs", () => {
  for (const patch of [
    { tonnes: 0 },
    { lifetime: 0 },
    { energy: NaN },
    { capex: -1 },
    { rate: 101 },
    { opex: Infinity },
    { capex: Number.MAX_VALUE, energy: Number.MAX_VALUE },
  ])
    assert.throws(() => calculateCost({ ...scenario, ...patch }));
});
