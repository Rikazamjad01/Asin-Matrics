'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

// Components Imports
import GlobalTimeFilter from '@/components/GlobalTimeFilter'
import Vertical from '@components/card-statistics/Vertical'
import ReviewsTabsAndTables from '@/views/dashboards/reviews/ReviewsTabsAndTables'
import ReviewsProductCards from '@/views/dashboards/reviews/ReviewsProductCards'

// Mock Data
import { reviewsData } from '@/libs/ppc/mockData'

const ReviewsDashboard = ({ productData }) => {
  const [dateFilter, setDateFilter] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState(null)

  const summary = reviewsData.summary
  const total = summary.totalReviews

  // KPI Calculations
  const ratingGrowth = ((summary.avgRating - summary.previousAvgRating) / summary.previousAvgRating) * 100
  const totalGrowth = ((summary.totalReviews - summary.previousTotalReviews) / summary.previousTotalReviews) * 100
  const fiveStarPct = (summary.starBreakdown[5] / total) * 100
  const oneStarPct = (summary.starBreakdown[1] / total) * 100

  return (
    <Grid container spacing={6}>
      {/* Header & Filter */}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <Typography variant='h5' fontWeight={700}>
            Reviews Dashboard
          </Typography>
          <GlobalTimeFilter
            dateRange={dateFilter}
            onDateRangeChange={setDateFilter}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
          />
        </div>
      </Grid>

      {/* Reviews Performance Overview Section */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title='Reviews Performance Overview'
            subheader='Key reputation and sentiment metrics for the selected period'
          />
          <Divider />
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='Average Rating'
                  avatarIcon='bx-star'
                  avatarColor='warning'
                  stats={`${summary.avgRating} / 5.0`}
                  trendNumber={Math.abs(ratingGrowth).toFixed(1)}
                  trend={ratingGrowth >= 0 ? 'positive' : 'negative'}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='Total Reviews'
                  avatarIcon='bx-message-rounded-check'
                  avatarColor='primary'
                  stats={summary.totalReviews.toLocaleString()}
                  trendNumber={Math.abs(totalGrowth).toFixed(1)}
                  trend={totalGrowth >= 0 ? 'positive' : 'negative'}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='5-Star Reviews'
                  avatarIcon='bx-happy-heart-eyes'
                  avatarColor='success'
                  stats={summary.starBreakdown[5].toLocaleString()}
                  trendNumber={fiveStarPct.toFixed(1)}
                  trend='positive'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='1-Star Reviews'
                  avatarIcon='bx-sad'
                  avatarColor='error'
                  stats={summary.starBreakdown[1].toLocaleString()}
                  trendNumber={oneStarPct.toFixed(1)}
                  trend='negative'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='New This Week'
                  avatarIcon='bx-calendar-plus'
                  avatarColor='info'
                  stats={summary.newReviewsThisWeek.toLocaleString()}
                  trendNumber={((summary.newReviewsThisWeek / summary.weeklyAverageNew) * 100).toFixed(1)}
                  trend={summary.newReviewsThisWeek >= summary.weeklyAverageNew ? 'positive' : 'negative'}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Overall Rating Distribution */}
      <Grid size={{ xs: 12 }}>
        <Card className='shadow-sm border border-divider h-full'>
          <CardHeader
            title='Overall Rating Distribution'
            subheader='Breakdown of all customer reviews by star rating'
          />
          <CardContent className='flex flex-col gap-5 pt-2'>
            {[5, 4, 3, 2, 1].map(star => {
              const count = summary.starBreakdown[star]
              const pct = (count / total) * 100

              // Color coding based on star rating
              let color = 'warning'

              if (star >= 4) color = 'success'
              if (star === 3) color = 'warning'
              if (star <= 2) color = 'error'

              return (
                <div key={star} className='flex items-center gap-4'>
                  <div className='flex items-center gap-1.5 min-w-[70px]'>
                    <Typography className=' whitespace-nowrap'>{star} Star</Typography>
                    <i className='bx-bxs-star text-warning text-sm' />
                  </div>
                  <LinearProgress
                    variant='determinate'
                    value={pct}
                    color={color}
                    className='bs-2.5 rounded-sm flex-1'
                  />
                  <Typography className='min-w-[50px] text-right text-textPrimary'>
                    {count.toLocaleString()}
                  </Typography>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </Grid>

      {/* Modular sections mirroring SNS Pro pattern */}
      <Grid size={{ xs: 12 }}>
        <ReviewsTabsAndTables productData={productData} dateRange={dateFilter} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ReviewsProductCards productData={productData} />
      </Grid>
    </Grid>
  )
}

export default ReviewsDashboard
