/**
 * PPC Data Service — Abstraction layer for PPC data fetching.
 *
 * Currently uses mock data + enrichment from calculationEngine.
 * When real APIs arrive, replace the body of each function with a fetch() call.
 * The return shape (flat row arrays) stays the same, so table components need zero changes.
 */

import { getWeeksForPreset } from './filterService'
import { fmt } from './calculationEngine'

// ─── Helper: flatten nested objects for TanStack column binding ────────────────

const flattenWeekRow = row => ({
  ...row,

  // Part 3 — Campaign Breakdown (flatten sp/sb/sd)
  spClicks: row.sp?.clicks ?? 0,
  spSpend: row.sp?.spend ?? 0,
  spOrders: row.sp?.orders ?? 0,
  spRevenue: row.sp?.revenue ?? 0,
  spRoas: row.sp?.roas ?? null,

  sbClicks: row.sb?.clicks ?? 0,
  sbSpend: row.sb?.spend ?? 0,
  sbOrders: row.sb?.orders ?? 0,
  sbRevenue: row.sb?.revenue ?? 0,
  sbRoas: row.sb?.roas ?? null,

  sdClicks: row.sd?.clicks ?? 0,
  sdSpend: row.sd?.spend ?? 0,
  sdOrders: row.sd?.orders ?? 0,
  sdRevenue: row.sd?.revenue ?? 0,
  sdRoas: row.sd?.roas ?? null,

  // Part 5 — SP Segmentation (flatten nonBranded/branded)
  nonBrandedSpend: row.nonBranded?.spend ?? 0,
  nonBrandedSales: row.nonBranded?.sales ?? 0,
  nonBrandedRoas: row.nonBranded?.roas ?? null,

  brandedSpend: row.branded?.spend ?? 0,
  brandedSales: row.branded?.sales ?? 0,
  brandedRoas: row.branded?.roas ?? null
})

// ─── Data Fetching Functions ──────────────────────────────────────────────────
// Each returns a flat array of rows ready for TanStack Table.
// When real APIs come:
//   1. Replace the body with `const res = await fetch('/api/v1/ppc/...')`
//   2. Return `res.json()` (ensure server returns the same flat shape)
//   3. No changes needed in the table components.

/**
 * Part 1 — Sales, Customer & Organic
 */
export const fetchSalesOrganicData = (preset = 'last8') => {
  const weeks = getWeeksForPreset(preset)

  return weeks.map(flattenWeekRow)
}

/**
 * Part 2 — High-Level Advertising Metrics
 */
export const fetchAdMetricsData = (preset = 'last8') => {
  const weeks = getWeeksForPreset(preset)

  return weeks.map(flattenWeekRow)
}

/**
 * Part 3 — Campaign Breakdown by Type (SP, SB, SD)
 */
export const fetchCampaignBreakdownData = (preset = 'last8') => {
  const weeks = getWeeksForPreset(preset)

  return weeks.map(flattenWeekRow)
}

/**
 * Part 5 — SP Segmentation (Branded vs Non-Branded)
 */
export const fetchSPSegmentationData = (preset = 'last8') => {
  const weeks = getWeeksForPreset(preset)

  return weeks.map(flattenWeekRow)
}

// Re-export fmt for convenience in table components
export { fmt }
