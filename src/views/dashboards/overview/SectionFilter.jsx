'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Mock Data
import { PRODUCT_OPTIONS } from '@/libs/overview/overviewMockData'

/**
 * Reusable per-section filter bar with product dropdown + 7d / 30d toggle.
 *
 * Props:
 *  - product, onProductChange   — controlled product select
 *  - dateRange, onDateRangeChange — controlled '7d' | '30d'
 */
const SectionFilter = ({ product = 'all', onProductChange, dateRange = '7d', onDateRangeChange }) => {
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

      <ToggleButtonGroup
        exclusive
        size='small'
        value={dateRange}
        onChange={(_, val) => val && onDateRangeChange?.(val)}
        color='primary'
      >
        <ToggleButton value='7d'>Last 7 Days</ToggleButton>
        <ToggleButton value='30d'>Last 30 Days</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default SectionFilter
