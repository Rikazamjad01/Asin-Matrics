/**
 * Products Dashboard — Mock Data
 *
 * Mock data functions scaled by date range for the products page KPIs and tables.
 */

const dateMultiplier = {
  Today: 0.03,
  '7d': 0.23,
  '30d': 1,
  '90d': 3.1,
  YTD: 5.4,
  Custom: 1.2
}

const round = (v, d = 0) => Math.round(v * 10 ** d) / 10 ** d

export function getProductsKpiData(dateRange) {
  const k = dateMultiplier[dateRange] ?? 1

  return {
    totalRevenue: { value: round(128450 * k), trend: 'positive', percent: 12.5 },
    netProfit: { value: round(34210 * k), trend: 'positive', percent: 8.2 },
    ppcRoi: { value: round(3.4 * (1 + (k - 1) * 0.1), 1), trend: 'positive', percent: 4.1 },
    portfolio: { value: round(156 * (1 + (k - 1) * 0.05)), trend: 'neutral', percent: 0 },
    avgAcos: { value: round(22.4 * (1 - (k - 1) * 0.05), 1), trend: 'negative', percent: -2.3 },
    avgTacos: { value: round(8.6 * (1 - (k - 1) * 0.02), 1), trend: 'negative', percent: -1.1 },
    totalUnitsSold: { value: round(4530 * k), trend: 'positive', percent: 15.4 },
    avgCogs: { value: round(14.2 * (1 + (k - 1) * 0.01), 1), trend: 'negative', percent: -0.5 } // COGS going down is good (positive trend color theoretically, but keeping simple trend direction)
  }
}

// Dummy data for the new Analytics Table
export const getAnalyticsData = dateRange => {
  const k = dateMultiplier[dateRange] ?? 1

  return [
    {
      id: 1,
      metric: 'Conversion Rate',
      value: `${round(15.4 * (1 + (k - 1) * 0.05), 1)}%`,
      target: '12.0%',
      status: 'Exceeding'
    },
    {
      id: 2,
      metric: 'Click-Through Rate',
      value: `${round(4.2 * (1 + (k - 1) * 0.02), 1)}%`,
      target: '3.5%',
      status: 'Exceeding'
    },
    {
      id: 3,
      metric: 'Cart Abandonment',
      value: `${round(68.5 * (1 - (k - 1) * 0.05), 1)}%`,
      target: '65.0%',
      status: 'Needs Improvement'
    },
    {
      id: 4,
      metric: 'Return Rate',
      value: `${round(3.8 * (1 - (k - 1) * 0.1), 1)}%`,
      target: '5.0%',
      status: 'On Track'
    },
    {
      id: 5,
      metric: 'Avg Order Value',
      value: `$${round(45.2 * (1 + (k - 1) * 0.08), 2)}`,
      target: '$40.00',
      status: 'Exceeding'
    }
  ]
}

// Dummy data for AI Insights Table
export const getAiInsightsData = () => {
  return [
    {
      id: 1,
      insight: 'Price optimization opportunity on "Memory Foam Pillow". Demand is inelastic up to $42.99.',
      impact: 'High',
      action: 'Increase Price'
    },
    {
      id: 2,
      insight: 'Slow moving inventory detected for "Silk Pillowcase" in LA fulfillment center.',
      impact: 'Medium',
      action: 'Run Promotion'
    },
    {
      id: 3,
      insight: 'Search term "cooling sleep pad" converting at 28% but losing impression share due to budget.',
      impact: 'High',
      action: 'Increase Campaign Budget'
    },
    {
      id: 4,
      insight: 'Return rate for "Bamboo Sheets" spiked 4% likely due to sizing confusion.',
      impact: 'Medium',
      action: 'Update Listing Images'
    }
  ]
}

// Dummy data for Forecast Table
export const getForecastData = dateRange => {
  const k = dateMultiplier[dateRange] ?? 1

  return [
    {
      id: 1,
      product: 'Memory Foam Pillow',
      predictedDemand: round(1200 * k),
      confidence: '94%',
      reorderDate: '2026-03-15'
    },
    {
      id: 2,
      product: 'Gel Cooling Pad',
      predictedDemand: round(850 * k),
      confidence: '88%',
      reorderDate: '2026-04-02'
    },
    {
      id: 3,
      product: 'Bamboo Sheet Set',
      predictedDemand: round(620 * k),
      confidence: '91%',
      reorderDate: '2026-03-28'
    },
    {
      id: 4,
      product: 'Weighted Blanket',
      predictedDemand: round(430 * k),
      confidence: '85%',
      reorderDate: '2026-05-10'
    },
    { id: 5, product: 'Silk Pillowcase', predictedDemand: round(310 * k), confidence: '82%', reorderDate: '2026-04-20' }
  ]
}
