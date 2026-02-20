'use client'

import { useState } from 'react'

// MUI Imports
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const dateRangeOptions = [
  { value: 'Today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'YTD', label: 'Year To Date' },
  { value: 'Custom', label: 'Custom' }
]

const ProductsFilter = ({ dateRange, onDateRangeChange }) => {
  return (
    <div className='flex items-center gap-4'>
      <CustomTextField select value={dateRange} onChange={e => onDateRangeChange(e.target.value)} size='small'>
        {dateRangeOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </CustomTextField>
      <Button variant='tonal' color='secondary' startIcon={<i className='bx-filter-alt' />}>
        Filters
      </Button>
    </div>
  )
}

export default ProductsFilter
