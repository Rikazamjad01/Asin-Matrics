/**
 * PPC Calculation Engine
 * All KPI formulas are defined here. UI components must NEVER compute KPIs directly.
 * All functions return null (not NaN/Infinity) when division by zero would occur.
 */

// ─── Core Formula Functions ────────────────────────────────────────────────────

/**
 * Conversion Rate = Orders / Sessions
 * @returns {number|null} percentage (0–100) or null
 */
export const calcConversionRate = (orders, sessions) => {
  if (!sessions || sessions === 0) return null
  return (orders / sessions) * 100
}

/**
 * ROAS = Ad Sales / Ad Spend
 * @returns {number|null}
 */
export const calcROAS = (adSales, adSpend) => {
  if (!adSpend || adSpend === 0) return null
  return adSales / adSpend
}

/**
 * ACOS = Ad Spend / Ad Sales (as percentage)
 * @returns {number|null} percentage (0–100) or null
 */
export const calcACOS = (adSpend, adSales) => {
  if (!adSales || adSales === 0) return null
  return (adSpend / adSales) * 100
}

/**
 * TACOS = Ad Spend / Total Sales (as percentage)
 * @returns {number|null} percentage (0–100) or null
 */
export const calcTACOS = (adSpend, totalSales) => {
  if (!totalSales || totalSales === 0) return null
  return (adSpend / totalSales) * 100
}

/**
 * Improvement = (current - previous) / previous (as percentage)
 * Returns null if previous is 0 or null/undefined.
 * @returns {number|null} percentage change or null
 */
export const calcImprovement = (current, previous) => {
  if (previous === null || previous === undefined || previous === 0) return null
  return ((current - previous) / previous) * 100
}

/**
 * Rank Change = previous - current (positive = improved, negative = dropped)
 * @returns {number}
 */
export const calcRankChange = (currentRank, previousRank) => {
  return previousRank - currentRank
}

// ─── Row-Level Enrichment ──────────────────────────────────────────────────────

/**
 * Enriches a single week row with all calculated fields.
 * Accepts the raw week object and the previous week object (for improvement metrics).
 */
export const enrichWeekRow = (week, prevWeek = null) => {
  const conversionRate = calcConversionRate(week.totalOrders, week.sessions)
  const roas = calcROAS(week.adSales, week.adSpend)
  const acos = calcACOS(week.adSpend, week.adSales)
  const tacos = calcTACOS(week.adSpend, week.totalSales)

  const prevRoas = prevWeek ? calcROAS(prevWeek.adSales, prevWeek.adSpend) : null
  const prevAcos = prevWeek ? calcACOS(prevWeek.adSpend, prevWeek.adSales) : null
  const prevTacos = prevWeek ? calcTACOS(prevWeek.adSpend, prevWeek.totalSales) : null

  const spRoas = calcROAS(week.sp.revenue, week.sp.spend)
  const sbRoas = calcROAS(week.sb.revenue, week.sb.spend)
  const sdRoas = calcROAS(week.sd.revenue, week.sd.spend)
  const nonBrandedRoas = calcROAS(week.nonBranded.sales, week.nonBranded.spend)
  const brandedRoas = calcROAS(week.branded.sales, week.branded.spend)

  return {
    ...week,
    // Calculated
    conversionRate,
    roas,
    acos,
    tacos,
    improvementOrganicOrders: prevWeek ? calcImprovement(week.organicOrders, prevWeek.organicOrders) : null,
    improvementROAS: calcImprovement(roas, prevRoas),
    improvementACOS: calcImprovement(acos, prevAcos),
    improvementTACOS: calcImprovement(tacos, prevTacos),
    // Campaign breakdown ROAS
    sp: { ...week.sp, roas: spRoas },
    sb: { ...week.sb, roas: sbRoas },
    sd: { ...week.sd, roas: sdRoas },
    // Segmentation ROAS
    nonBranded: { ...week.nonBranded, roas: nonBrandedRoas },
    branded: { ...week.branded, roas: brandedRoas }
  }
}

/**
 * Enriches all weeks in an array, computing improvements against previous week.
 */
export const enrichAllWeeks = weeks => {
  return weeks.map((week, idx) => {
    const prevWeek = idx > 0 ? weeks[idx - 1] : null
    return enrichWeekRow(week, prevWeek)
  })
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

/**
 * Aggregates a list of enriched week rows into a single summary object.
 * Recalculates derived KPIs from aggregated raw values.
 */
export const aggregateWeeks = weeks => {
  if (!weeks || weeks.length === 0) return null

  const sum = key => weeks.reduce((acc, w) => acc + (w[key] || 0), 0)
  const sumNested = (parent, key) => weeks.reduce((acc, w) => acc + (w[parent]?.[key] || 0), 0)

  const totalSessions = sum('sessions')
  const totalOrders = sum('totalOrders')
  const totalSales = sum('totalSales')
  const adSpend = sum('adSpend')
  const adSales = sum('adSales')
  const adOrders = sum('adOrders')
  const adClicks = sum('adClicks')
  const organicOrders = sum('organicOrders')
  const ntbCustomers = sum('ntbCustomers')
  const ntbOrders = sum('ntbOrders')
  const ntbSales = sum('ntbSales')
  const repeatCustomers = sum('repeatCustomers')
  const repeatOrders = sum('repeatOrders')
  const repeatSales = sum('repeatSales')

  const spSpend = sumNested('sp', 'spend')
  const spRevenue = sumNested('sp', 'revenue')
  const spOrders = sumNested('sp', 'orders')
  const spClicks = sumNested('sp', 'clicks')
  const sbSpend = sumNested('sb', 'spend')
  const sbRevenue = sumNested('sb', 'revenue')
  const sbOrders = sumNested('sb', 'orders')
  const sbClicks = sumNested('sb', 'clicks')
  const sdSpend = sumNested('sd', 'spend')
  const sdRevenue = sumNested('sd', 'revenue')
  const sdOrders = sumNested('sd', 'orders')
  const sdClicks = sumNested('sd', 'clicks')
  const nbSpend = sumNested('nonBranded', 'spend')
  const nbSales = sumNested('nonBranded', 'sales')
  const bSpend = sumNested('branded', 'spend')
  const bSales = sumNested('branded', 'sales')

  return {
    sessions: totalSessions,
    totalOrders,
    totalSales,
    adSpend,
    adSales,
    adOrders,
    adClicks,
    organicOrders,
    ntbCustomers,
    ntbOrders,
    ntbSales,
    repeatCustomers,
    repeatOrders,
    repeatSales,
    conversionRate: calcConversionRate(totalOrders, totalSessions),
    roas: calcROAS(adSales, adSpend),
    acos: calcACOS(adSpend, adSales),
    tacos: calcTACOS(adSpend, totalSales),
    sp: { clicks: spClicks, spend: spSpend, orders: spOrders, revenue: spRevenue, roas: calcROAS(spRevenue, spSpend) },
    sb: { clicks: sbClicks, spend: sbSpend, orders: sbOrders, revenue: sbRevenue, roas: calcROAS(sbRevenue, sbSpend) },
    sd: { clicks: sdClicks, spend: sdSpend, orders: sdOrders, revenue: sdRevenue, roas: calcROAS(sdRevenue, sdSpend) },
    nonBranded: { spend: nbSpend, sales: nbSales, roas: calcROAS(nbSales, nbSpend) },
    branded: { spend: bSpend, sales: bSales, roas: calcROAS(bSales, bSpend) }
  }
}

// ─── Formatting Helpers ────────────────────────────────────────────────────────

export const fmt = {
  currency: val =>
    val == null ? 'N/A' : `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  percent: val => (val == null ? 'N/A' : `${val.toFixed(2)}%`),
  roas: val => (val == null ? 'N/A' : `${val.toFixed(2)}x`),
  number: val => (val == null ? 'N/A' : val.toLocaleString('en-US')),
  improvement: val => {
    if (val == null) return 'N/A'
    const sign = val >= 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
  }
}
