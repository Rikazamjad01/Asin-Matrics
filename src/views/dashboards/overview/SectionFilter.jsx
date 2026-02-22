'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

// Mock Data
import { PRODUCT_OPTIONS } from '@/libs/overview/overviewMockData'

/**
 * Reusable per-section filter bar with product dropdown + 7d / 30d toggle.
 *
 * Props:
 *  - product, onProductChange   — controlled product select
 *  - dateRange, onDateRangeChange — controlled '7d' | '30d' | 'custom'
 *  - customDateRange, onCustomDateRangeChange - controlled array of antd dates
 */
const SectionFilter = ({
  product = 'all',
  onProductChange,
  dateRange = '7d',
  onDateRangeChange,
  customDateRange,
  onCustomDateRangeChange
}) => {
  return (
    <Box className='flex flex-wrap items-center gap-3'>
      <CustomTextField
        select
        size='small'
        value={product}
        onChange={e => onProductChange?.(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {PRODUCT_OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </CustomTextField>
      <GlobalTimeFilter
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        customDateRange={customDateRange}
        onCustomDateRangeChange={onCustomDateRangeChange}
      />
    </Box>
  )
}

export default SectionFilter
