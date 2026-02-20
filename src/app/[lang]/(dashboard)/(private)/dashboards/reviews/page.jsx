'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Components Imports
import ReviewsKPICards from '@/views/dashboards/ppc/ReviewsKPICards'
import RatingDistributionChart from '@/views/dashboards/ppc/RatingDistributionChart'
import ReviewGrowthChart from '@/views/dashboards/ppc/ReviewGrowthChart'

// Mock Data
import { reviewsData } from '@/libs/ppc/mockData'

const DashboardReviews = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [dateFilter, setDateFilter] = useState('Last 30 Days')

  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days']

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
        <Button
          variant='outlined'
          onClick={e => setAnchorEl(e.currentTarget)}
          endIcon={<i className='bx-chevron-down text-xl' />}
          className='min-w-[160px]'
        >
          {dateFilter}
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {dateOptions.map(opt => (
            <MenuItem
              key={opt}
              onClick={() => {
                setDateFilter(opt)
                setAnchorEl(null)
              }}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>
      </Grid>

      {/* KPI Cards */}
      <Grid size={{ xs: 12 }}>
        <ReviewsKPICards summary={reviewsData.summary} />
      </Grid>

      {/* Rating Distribution + Review Growth */}
      <Grid size={{ xs: 12, md: 5 }}>
        <RatingDistributionChart starBreakdown={reviewsData.summary.starBreakdown} />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <ReviewGrowthChart weeklyTrend={reviewsData.weeklyTrend} />
      </Grid>
    </Grid>
  )
}

export default DashboardReviews
