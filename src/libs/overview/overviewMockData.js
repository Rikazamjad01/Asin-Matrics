/**
 * Overview Dashboard — Mock Data
 *
 * All data generators accept (product, dateRange) and return data
 * that varies by filter. When real APIs arrive, swap each function
 * for a fetch() call.
 */

// ─── Product options for filters ──────────────────────────────────────────────
export const PRODUCT_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'asin-1', label: 'ASIN B0CX23LKWM' },
  { value: 'asin-2', label: 'ASIN B0D9PRQ37Y' },
  { value: 'asin-3', label: 'ASIN B0BXMLKK3N' }
]

// ─── Helpers — deterministic multipliers per product / dateRange ───────────────
const productMultiplier = {
  all: 1,
  'asin-1': 0.45,
  'asin-2': 0.32,
  'asin-3': 0.23
}

const dateMultiplier = {
  '7d': 0.35,
  '30d': 1
}

const m = (product, dateRange) => (productMultiplier[product] ?? 1) * (dateMultiplier[dateRange] ?? 1)

const round = (v, d = 0) => Math.round(v * 10 ** d) / 10 ** d

// Seeded-ish per-product offset so each ASIN looks different, not just scaled
const productOffset = { all: 0, 'asin-1': 3, 'asin-2': -2, 'asin-3': 1 }
const off = product => productOffset[product] ?? 0

// ─── Section 1 — KPI Tiles (overview page) ────────────────────────────────────
export function getKpiData(product, dateRange) {
  const k = m(product, dateRange)

  const totalSales = round(128500 * k)
  const totalOrders = round(1856 * k)
  const adSpend = round(18400 * k)
  const adSales = round(62300 * k)
  const organicSales = totalSales - adSales
  const sessions = round(45200 * k)
  const adOrders = round(720 * k)
  const adClicks = round(9800 * k)

  return {
    totalSales,
    totalOrders,
    adSpend,
    adSales,
    organicSales,
    roas: adSales / (adSpend || 1),
    acos: (adSpend / (adSales || 1)) * 100,
    tacos: (adSpend / (totalSales || 1)) * 100,
    organicConvRate: sessions > 0 ? ((totalOrders - adOrders) / sessions) * 100 : 0,
    sponsoredConvRate: adClicks > 0 ? (adOrders / adClicks) * 100 : 0
  }
}

// ─── Section 6 — Geo Rank Tracker ─────────────────────────────────────────────
const baseHeatMap = [
  { city: 'New York', ranks: [2, 6, 14, 22, 8, 35] },
  { city: 'Los Angeles', ranks: [4, 3, 9, 18, 11, 28] },
  { city: 'Chicago', ranks: [1, 12, 5, 7, 19, 42] },
  { city: 'Houston', ranks: [6, 8, 3, 15, 25, 10] },
  { city: 'Phoenix', ranks: [9, 1, 20, 4, 33, 16] },
  { city: 'Seattle', ranks: [3, 5, 11, 2, 7, 21] },
  { city: 'Miami', ranks: [5, 10, 7, 30, 3, 13] }
]

const productKeywords = {
  all: [
    'Memory Foam Pillow',
    'Gel Cooling Pad',
    'Bamboo Sheets',
    'Weighted Blanket',
    'Silk Pillowcase',
    'Down Comforter'
  ],
  'asin-1': [
    'Memory Foam Pillow',
    'Pillow Cover',
    'Neck Support Pillow',
    'Orthopedic Pillow',
    'Travel Pillow',
    'Pillow Protector'
  ],
  'asin-2': [
    'Gel Cooling Pad',
    'Cooling Mat',
    'Bed Cooling System',
    'Cold Gel Pillow',
    'Cooling Topper',
    'Summer Bedding'
  ],
  'asin-3': ['Bamboo Sheets', 'Bamboo Pillowcase', 'Bamboo Duvet', 'Eco Bedding', 'Bamboo Blanket', 'Organic Sheets']
}

const bestKeywords = {
  all: { keyword: 'memory foam pillow', rank: 2, change: +3 },
  'asin-1': { keyword: 'memory foam pillow', rank: 1, change: +2 },
  'asin-2': { keyword: 'gel cooling pad', rank: 3, change: +5 },
  'asin-3': { keyword: 'bamboo sheets', rank: 4, change: -1 }
}

export function getGeoRankData(product, dateRange) {
  const k = m(product, dateRange)
  const o = off(product)
  const keywords = productKeywords[product] ?? productKeywords.all

  // Shift ranks by offset + dateRange effect
  const dateShift = dateRange === '7d' ? 2 : 0

  const heatMapSeries = baseHeatMap.map(city => ({
    name: city.city,
    data: keywords.map((kw, i) => ({
      x: kw,
      y: Math.max(1, city.ranks[i] + o + dateShift)
    }))
  }))

  return {
    topKeywords: {
      top3: {
        count: round(12 * k + o),
        trend: dateRange === '7d' ? 'positive' : 'negative',
        percent: round(8.3 + o, 1)
      },
      top10: { count: round(47 * k + o), trend: 'positive', percent: round(5.1 - o * 0.3, 1) },
      top100: { count: round(218 * k), trend: 'negative', percent: round(2.4 + Math.abs(o) * 0.5, 1) }
    },
    bestPerformingKeyword: bestKeywords[product] ?? bestKeywords.all,
    keywordMovement: {
      improved: round(34 * k),
      declined: round(12 * k),
      unchanged: round(18 * k)
    },
    heatMapSeries
  }
}

// ─── Section 7 — Inventory Planning ───────────────────────────────────────────
const productAlerts = {
  all: [
    { asin: 'B0CX23LKWM', message: 'Stock below reorder point', severity: 'error' },
    { asin: 'B0D9PRQ37Y', message: 'Slow-moving inventory', severity: 'warning' }
  ],
  'asin-1': [{ asin: 'B0CX23LKWM', message: 'Stock below reorder point', severity: 'error' }],
  'asin-2': [{ asin: 'B0D9PRQ37Y', message: 'Slow-moving inventory', severity: 'warning' }],
  'asin-3': []
}

const productStockOuts = {
  all: [
    { asin: 'B0CX23LKWM', product: 'Memory Foam Pillow', date: 'Mar 15, 2026' },
    { asin: 'B0D9PRQ37Y', product: 'Gel Cooling Pad', date: 'Apr 02, 2026' },
    { asin: 'B0BXMLKK3N', product: 'Bamboo Sheet Set', date: 'Mar 28, 2026' }
  ],
  'asin-1': [{ asin: 'B0CX23LKWM', product: 'Memory Foam Pillow', date: 'Mar 15, 2026' }],
  'asin-2': [{ asin: 'B0D9PRQ37Y', product: 'Gel Cooling Pad', date: 'Apr 02, 2026' }],
  'asin-3': [{ asin: 'B0BXMLKK3N', product: 'Bamboo Sheet Set', date: 'Mar 28, 2026' }]
}

export function getInventoryData(product, dateRange) {
  const k = m(product, dateRange)

  return {
    currentStock: round(12450 * (productMultiplier[product] ?? 1)),
    daysOfSupply: round(34 + off(product) * 3),
    asinsNeedingReorder: product === 'all' ? 5 : product === 'asin-3' ? 0 : 1,
    avgLeadTime: `${round(14 + off(product))} days`,
    inventoryAlerts: productAlerts[product] ?? productAlerts.all,
    forecastedStockOutDates: productStockOuts[product] ?? productStockOuts.all
  }
}

// ─── Section 8 — Subscribe & Save ─────────────────────────────────────────────
const baseSubTrend = [820, 890, 950, 1010, 1040, 1080, 1100, 1130, 1160, 1190, 1210, 1234]

const allTopProducts = [
  { name: 'Memory Foam Pillow', subscribers: 342, revenue: 6840 },
  { name: 'Gel Cooling Pad', subscribers: 278, revenue: 5560 },
  { name: 'Bamboo Sheet Set', subscribers: 214, revenue: 8560 },
  { name: 'Cotton Pillowcase 2-Pack', subscribers: 189, revenue: 2835 },
  { name: 'Weighted Blanket', subscribers: 156, revenue: 7800 }
]

export function getSubscribeSaveData(product, dateRange) {
  const k = m(product, dateRange)
  const o = off(product)

  const trendData =
    dateRange === '7d'
      ? baseSubTrend.slice(-4).map(v => round(v * (productMultiplier[product] ?? 1)))
      : baseSubTrend.map(v => round(v * (productMultiplier[product] ?? 1)))

  const trendCategories =
    dateRange === '7d'
      ? ['Sep', 'Oct', 'Nov', 'Dec']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const filteredProducts =
    product === 'all'
      ? allTopProducts
      : allTopProducts.filter((_, i) => i % PRODUCT_OPTIONS.findIndex(p => p.value === product) === 0).slice(0, 3)

  return {
    totalSubscribers: round(1234 * k),
    monthlyGrowth: round(8.5 + o * 0.5, 1),
    recurringRevenue: round(24680 * k),
    plannedRevenue: {
      days30: round(8200 * k),
      days30Growth: round(8.5 + o, 1),
      days60: round(16800 * k),
      days60Growth: round(12.5 + o * 0.5, 1),
      days90: round(25400 * k),
      days90Growth: round(18.5 + o * 0.3, 1)
    },
    subscriberTrend: {
      categories: trendCategories,
      data: trendData
    },
    topProducts: filteredProducts.map(p => ({
      ...p,
      subscribers: round(p.subscribers * (productMultiplier[product] ?? 1)),
      revenue: round(p.revenue * k)
    }))
  }
}

// 7d → 7 daily data points, 30d → 4 weekly data points
const dailyReviewTrend = [12, 18, 9, 15, 22, 11, 14]
const weeklyReviewTrend = [72, 85, 91, 78]

const baseRatingDist = [
  { stars: 5, count: 385, percent: 56.8 },
  { stars: 4, count: 158, percent: 23.3 },
  { stars: 3, count: 72, percent: 10.6 },
  { stars: 2, count: 38, percent: 5.6 },
  { stars: 1, count: 25, percent: 3.7 }
]

export function getReviewRequestData(product, dateRange) {
  const k = m(product, dateRange)
  const o = off(product)

  const pk = productMultiplier[product] ?? 1

  const trendData =
    dateRange === '7d' ? dailyReviewTrend.map(v => round(v * pk)) : weeklyReviewTrend.map(v => round(v * pk))

  const trendCategories =
    dateRange === '7d'
      ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  const totalCount = baseRatingDist.reduce((sum, r) => sum + round(r.count * k), 0)

  return {
    requestsSent: { value: round(4520 * k), trend: 'positive', percent: round(12.3 + o, 1) },
    reviewsReceived: { value: round(678 * k), trend: 'positive', percent: round(8.7 + o * 0.5, 1) },
    conversionRate: {
      value: round(15.0 + o * 0.4, 1),
      trend: o >= 0 ? 'positive' : 'negative',
      percent: round(1.4 + Math.abs(o) * 0.3, 1)
    },
    avgRating: { value: round(4.3 + o * 0.05, 1), trend: 'positive', percent: round(2.1 + o * 0.2, 1) },
    reviewTrend: {
      categories: trendCategories,
      data: trendData
    },
    ratingDistribution: baseRatingDist.map(r => {
      const count = round(r.count * k)

      return { stars: r.stars, count, percent: round((count / (totalCount || 1)) * 100, 1) }
    })
  }
}
