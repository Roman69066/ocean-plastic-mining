# LCOCR v0.1-draft

**Unit: EUR per verified dry tonne permanently removed.** No verified numerical baseline exists.

```
LCOCR = (annualized CAPEX + residual OPEX + search + energy + logistics
         + maintenance + processing + disposal + compliance)
        / annual verified tonnes permanently removed
```

For initial capital K, service life n, annual discount rate r:

`annualized CAPEX = K × r / (1 − (1+r)^−n)`; at r=0 use `K/n`.

The calculator uses a stable `expm1/log1p` form. It is an annual steady-state model, not a complete discounted multi-year cash-flow simulator. Major replacements, decommissioning and residual value require explicit annual equivalent allocations in the ledger. State currency price year, region, utilization and risk provisions. Gross LCOCR never subtracts sales, public payments or speculative carbon credits.

## Mutually exclusive costs

Assign each expense once. Residual OPEX contains crew/admin/insurance costs not already allocated elsewhere. Search excludes energy already booked under Energy. Maintenance includes scheduled and unscheduled service and required replacement provisions. Logistics includes transport and shared support with documented allocation. Processing and disposal must include rejected material and lawful final fate. Compliance includes monitoring, permits and environmental review where applicable. Allocation decisions need an auditable ledger, not just a final number.

## Denominator

Track dry plastic mass using calibrated instruments, moisture correction, chain of custody and final disposition. Subtract losses, untracked transfers and environmental leakage. Capture alone is insufficient. Declare storage horizons, rejects and verification uncertainty. Thermal conversion is not permanent carbon sequestration: emissions, residue and environmental impacts must be separately assessed. Do not present fuel energy as carbon removal.

## Viability

- T1 operating: resource revenue + public payment ≥ full operating cost.
- T1 full cost (homepage criterion): resource revenue + public payment ≥ full cost including capital replacement.
- T2: resource revenue ≥ full cost.
- T3: long-term offshore living cost < shore living + rotation + transport (distant research).

Report both T1 boundaries. Positive operating cash flow with unrecovered capital is not durable commercial viability. The task specification contained both definitions; RFC-0001 proposes retaining both explicitly instead of silently choosing one.

## Uncertainty and changes

Blank inputs are unknown. The web calculator accepts complete explicit scenarios and labels them model-only. No scenario feeds the public leaderboard. A formal submission includes measured ranges, sensitivity, covariance where material, failure periods and adverse effects. Changes to boundaries or formulas require an RFC and method version change.
