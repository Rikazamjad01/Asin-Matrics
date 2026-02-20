/**
 * CSV Export Service
 * Generates and triggers download of CSV files from table data.
 * Matches UI headers exactly. Uses fixed decimal precision.
 */

/**
 * Converts an array of row objects to a CSV string.
 * @param {Array<Object>} rows - data rows
 * @param {Array<{key: string, label: string}>} columns - column definitions
 * @param {string} [periodContext] - optional period context line (e.g. "Period: Jan 1–31, 2025")
 * @returns {string} CSV string
 */
const rowsToCSV = (rows, columns, periodContext) => {
  const lines = []

  // Period context header (optional)
  if (periodContext) {
    lines.push(`"${periodContext}"`)
    lines.push('') // blank line
  }

  // Header row
  lines.push(columns.map(col => `"${col.label}"`).join(','))

  // Data rows
  rows.forEach(row => {
    const cells = columns.map(col => {
      const val = col.key.includes('.') ? col.key.split('.').reduce((o, k) => o?.[k], row) : row[col.key]
      if (val === null || val === undefined) return '"N/A"'
      if (typeof val === 'number') return val.toFixed(col.decimals ?? 2)
      return `"${String(val).replace(/"/g, '""')}"`
    })
    lines.push(cells.join(','))
  })

  return lines.join('\n')
}

/**
 * Triggers a CSV file download in the browser.
 * @param {Array<Object>} rows
 * @param {Array<{key: string, label: string, decimals?: number}>} columns
 * @param {string} filename - without .csv extension
 * @param {string} [periodContext]
 */
export const exportToCSV = (rows, columns, filename, periodContext) => {
  const csv = rowsToCSV(rows, columns, periodContext)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─── Column Definitions for each table ────────────────────────────────────────

export const TABLE1_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'weekRange', label: 'Week Range' },
  { key: 'sessions', label: 'Sessions', decimals: 0 },
  { key: 'totalOrders', label: 'Total Orders', decimals: 0 },
  { key: 'conversionRate', label: 'Conv. Rate %', decimals: 2 },
  { key: 'totalSales', label: 'Total Sales ($)', decimals: 2 },
  { key: 'ntbCustomers', label: 'NTB Customers', decimals: 0 },
  { key: 'ntbOrders', label: 'NTB Orders', decimals: 0 },
  { key: 'ntbSales', label: 'NTB Sales ($)', decimals: 2 },
  { key: 'repeatCustomers', label: 'Repeat Customers', decimals: 0 },
  { key: 'repeatOrders', label: 'Repeat Orders', decimals: 0 },
  { key: 'repeatSales', label: 'Repeat Sales ($)', decimals: 2 },
  { key: 'organicOrders', label: 'Organic Orders', decimals: 0 },
  { key: 'improvementOrganicOrders', label: 'Organic Orders Δ%', decimals: 2 }
]

export const TABLE2_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'weekRange', label: 'Week Range' },
  { key: 'adClicks', label: 'Ad Clicks', decimals: 0 },
  { key: 'adSpend', label: 'Ad Spend ($)', decimals: 2 },
  { key: 'adOrders', label: 'Ad Orders', decimals: 0 },
  { key: 'adSales', label: 'Ad Sales ($)', decimals: 2 },
  { key: 'roas', label: 'ROAS', decimals: 2 },
  { key: 'improvementROAS', label: 'ROAS Δ%', decimals: 2 },
  { key: 'acos', label: 'ACOS %', decimals: 2 },
  { key: 'improvementACOS', label: 'ACOS Δ%', decimals: 2 },
  { key: 'tacos', label: 'TACOS %', decimals: 2 },
  { key: 'improvementTACOS', label: 'TACOS Δ%', decimals: 2 },
  { key: 'campaignStatusSP', label: 'SP Status' },
  { key: 'campaignStatusSB', label: 'SB Status' },
  { key: 'campaignStatusSD', label: 'SD Status' }
]

export const TABLE3_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'weekRange', label: 'Week Range' },
  { key: 'sp.clicks', label: 'SP Clicks', decimals: 0 },
  { key: 'sp.spend', label: 'SP Spend ($)', decimals: 2 },
  { key: 'sp.orders', label: 'SP Orders', decimals: 0 },
  { key: 'sp.revenue', label: 'SP Revenue ($)', decimals: 2 },
  { key: 'sp.roas', label: 'SP ROAS', decimals: 2 },
  { key: 'sb.clicks', label: 'SB Clicks', decimals: 0 },
  { key: 'sb.spend', label: 'SB Spend ($)', decimals: 2 },
  { key: 'sb.orders', label: 'SB Orders', decimals: 0 },
  { key: 'sb.revenue', label: 'SB Revenue ($)', decimals: 2 },
  { key: 'sb.roas', label: 'SB ROAS', decimals: 2 },
  { key: 'sd.clicks', label: 'SD Clicks', decimals: 0 },
  { key: 'sd.spend', label: 'SD Spend ($)', decimals: 2 },
  { key: 'sd.orders', label: 'SD Orders', decimals: 0 },
  { key: 'sd.revenue', label: 'SD Revenue ($)', decimals: 2 },
  { key: 'sd.roas', label: 'SD ROAS', decimals: 2 }
]

export const TABLE4_COLUMNS = [
  { key: 'month', label: 'Month' },
  { key: 'weekRange', label: 'Week Range' },
  { key: 'nonBranded.spend', label: 'NB Spend ($)', decimals: 2 },
  { key: 'nonBranded.sales', label: 'NB Sales ($)', decimals: 2 },
  { key: 'nonBranded.roas', label: 'NB ROAS', decimals: 2 },
  { key: 'branded.spend', label: 'B Spend ($)', decimals: 2 },
  { key: 'branded.sales', label: 'B Sales ($)', decimals: 2 },
  { key: 'branded.roas', label: 'B ROAS', decimals: 2 }
]

export const RANKINGS_COLUMNS = [
  { key: 'keyword', label: 'Keyword' },
  { key: 'asin', label: 'ASIN' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'currentRank', label: 'Current Rank', decimals: 0 },
  { key: 'previousRank', label: 'Previous Rank', decimals: 0 },
  { key: 'rankChange', label: 'Rank Δ', decimals: 0 },
  { key: 'organicRank', label: 'Organic Rank', decimals: 0 },
  { key: 'sponsoredRank', label: 'Sponsored Rank', decimals: 0 },
  { key: 'date', label: 'Date' }
]
