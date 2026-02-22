'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
import ReviewsKPICards from '@/views/dashboards/ppc/ReviewsKPICards'
import RatingDistributionChart from '@/views/dashboards/ppc/RatingDistributionChart'
import ReviewGrowthChart from '@/views/dashboards/ppc/ReviewGrowthChart'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

// Mock Data
import { reviewsData } from '@/libs/ppc/mockData'

const DashboardReviews = () => {
  const [dateFilter, setDateFilter] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState(null)

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
        <GlobalTimeFilter
          dateRange={dateFilter}
          onDateRangeChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
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
