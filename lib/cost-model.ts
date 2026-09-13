export const buckets = [
  "opex",
  "search",
  "energy",
  "logistics",
  "maintenance",
  "processing",
  "disposal",
  "compliance",
] as const;
export type Bucket = (typeof buckets)[number];
export type CostInput = Record<Bucket, number> & {
  capex: number;
  lifetime: number;
  rate: number;
  tonnes: number;
  resourceRevenue: number;
  publicPayment: number;
};
export function annualize(capex: number, years: number, ratePercent: number) {
  if (
    ![capex, years, ratePercent].every(Number.isFinite) ||
    capex < 0 ||
    years <= 0 ||
    ratePercent < 0 ||
    ratePercent > 100
  )
    throw new Error("Invalid capital inputs");
  const r = ratePercent / 100;
  return (
    capex * (r === 0 ? 1 / years : r / -Math.expm1(-years * Math.log1p(r)))
  );
}
export function calculateCost(input: CostInput) {
  const required = [
    ...buckets,
    "capex",
    "lifetime",
    "rate",
    "tonnes",
    "resourceRevenue",
    "publicPayment",
  ] as const;
  if (
    !required.every((key) => Number.isFinite(input[key]) && input[key] >= 0) ||
    input.tonnes <= 0 ||
    input.lifetime <= 0 ||
    input.rate > 100
  )
    throw new Error("Invalid model inputs");
  const capital = annualize(input.capex, input.lifetime, input.rate);
  const operating = buckets.reduce((sum, key) => sum + input[key], 0);
  const fullCost = capital + operating;
  const result = {
    capital,
    operating,
    fullCost,
    lcocr: fullCost / input.tonnes,
    t1Operating: input.resourceRevenue + input.publicPayment - operating,
    t1Full: input.resourceRevenue + input.publicPayment - fullCost,
    t2: input.resourceRevenue - fullCost,
  };
  if (!Object.values(result).every(Number.isFinite))
    throw new Error("Model overflow");
  return result;
}
