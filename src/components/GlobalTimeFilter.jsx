'use client'

import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { styled } from '@mui/material/styles'

// Ant Design Imports
import { DatePicker } from 'antd'

const { RangePicker } = DatePicker

// Styled component to match MUI styling for toggle buttons
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

/**
 * Reusable Global Time Filter
 *
 * Props:
 *  - dateRange / onDateRangeChange (string: '7d', '30d', 'custom')
 *  - customDateRange / onCustomDateRangeChange (Array of Dates)
 */
const GlobalTimeFilter = ({ dateRange = '7d', onDateRangeChange, customDateRange = null, onCustomDateRangeChange }) => {
  return (
    <Box className='flex flex-wrap items-center gap-3'>
      {dateRange === 'custom' && (
        <Box className='min-w-[260px]'>
          <RangePicker
            value={customDateRange}
            onChange={dates => onCustomDateRangeChange?.(dates)}
            size='large' // Antd sizing to roughly match MUI small/medium
            style={{ width: '100%', borderRadius: 6 }}
          />
        </Box>
      )}

      <StyledToggleButtonGroup
        exclusive
        size='small'
        value={dateRange}
        onChange={(_, val) => val && onDateRangeChange?.(val)}
        color='primary'
      >
        <ToggleButton value='7d'>Last 7 Days</ToggleButton>
        <ToggleButton value='30d'>Last 30 Days</ToggleButton>
        <ToggleButton value='custom'>Custom</ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  )
}

export default GlobalTimeFilter
