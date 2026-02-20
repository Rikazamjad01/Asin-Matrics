/**
 * Filter Service — date range filtering and period comparison for PPC data
 */

import { ppcWeeklyData } from './mockData'
import { enrichAllWeeks } from './calculationEngine'

// Pre-enrich all weeks once
const enrichedWeeks = enrichAllWeeks(ppcWeeklyData)

/**
 * Returns weeks that fall within the given date range.
 * A week is included if its startDate >= rangeStart AND endDate <= rangeEnd.
 */
export const filterByDateRange = (startDate, endDate) => {
  return enrichedWeeks.filter(week => {
    return week.startDate >= startDate && week.endDate <= endDate
  })
}

/**
 * Returns the last N weeks of data.
 */
export const getLastNWeeks = n => {
  return enrichedWeeks.slice(-n)
}

/**
 * Returns all enriched weeks.
 */
export const getAllWeeks = () => enrichedWeeks

/**
 * Preset date ranges for the filter dropdown.
 * Returns { label, weeks } pairs.
 */
export const DATE_RANGE_PRESETS = [
  { label: 'Last 4 Weeks', value: 'last4', weeks: 4 },
  { label: 'Last 8 Weeks', value: 'last8', weeks: 8 },
  { label: 'All Time', value: 'all', weeks: null }
]

/**
 * Gets weeks for a preset value.
 */
export const getWeeksForPreset = presetValue => {
  const preset = DATE_RANGE_PRESETS.find(p => p.value === presetValue)

  if (!preset) return enrichedWeeks
  if (preset.weeks === null) return enrichedWeeks

  return enrichedWeeks.slice(-preset.weeks)
}

/**
 * Splits weeks into current and previous periods for comparison.
 * Given N weeks, returns the last N/2 as current and the preceding N/2 as previous.
 */
export const splitIntoPeriods = weeks => {
  const half = Math.floor(weeks.length / 2)

  return {
    current: weeks.slice(-half),
    previous: weeks.slice(-half * 2, -half)
  }
}
