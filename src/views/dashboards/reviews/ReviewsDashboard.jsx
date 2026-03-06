'use client'

// React Imports
import { useState, useEffect } from 'react'

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
import SolicitationsManager from '@/views/dashboards/reviews/SolicitationsManager'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const ReviewsDashboard = () => {
  const [dateFilter, setDateFilter] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState(null)
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('fba_inventory')
        .select('*')
        .order('total_quantity', { ascending: false })

      if (!error && data) {
        setInventoryData(data)
      } else {
        console.error('Error fetching FBA inventory:', error)
      }

      setLoading(false)
    }

    fetchInventory()
  }, [])

  // We don't have real API data for these AWS reviews KPIs yet.
  // We'll show placeholders ('—') or zeros until a 3rd party API (like Rainforest API) is integrated.
  const summary = {
    avgRating: '—',
    totalReviews: '—',
    starBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    newReviewsThisWeek: '—',
    weeklyAverageNew: 0
  }

  const ratingGrowth = 0
  const totalGrowth = 0
  const fiveStarPct = 0
  const oneStarPct = 0

  return (
    <Grid container spacing={6}>
      {/* Header & Filter */}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <Typography variant='h5' fontWeight={700}>
            Reviews Dashboard
          </Typography>
          <div className='flex items-center gap-3'>
            <GlobalTimeFilter
              dateRange={dateFilter}
              onDateRangeChange={setDateFilter}
              customDateRange={customDateRange}
              onCustomDateRangeChange={setCustomDateRange}
            />
          </div>
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
                  trendNumber={ratingGrowth.toFixed(1)}
                  trend='neutral'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='Total Reviews'
                  avatarIcon='bx-message-rounded-check'
                  avatarColor='primary'
                  stats={
                    typeof summary.totalReviews === 'number'
                      ? summary.totalReviews.toLocaleString()
                      : summary.totalReviews
                  }
                  trendNumber={totalGrowth.toFixed(1)}
                  trend='neutral'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='5-Star Reviews'
                  avatarIcon='bx-happy-heart-eyes'
                  avatarColor='success'
                  stats='—'
                  trendNumber={fiveStarPct.toFixed(1)}
                  trend='neutral'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='1-Star Reviews'
                  avatarIcon='bx-sad'
                  avatarColor='error'
                  stats='—'
                  trendNumber={oneStarPct.toFixed(1)}
                  trend='neutral'
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <Vertical
                  title='New This Week'
                  avatarIcon='bx-calendar-plus'
                  avatarColor='info'
                  stats={summary.newReviewsThisWeek}
                  trendNumber='—'
                  trend='neutral'
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
              const pct = 0 // No data

              // Color coding based on star rating
              let color = 'secondary' // Neutral color since no data

              return (
                <div key={star} className='flex items-center gap-4'>
                  <div className='flex items-center gap-1.5 min-w-[70px]'>
                    <Typography className=' whitespace-nowrap'>{star} Star</Typography>
                    <i className='bx-bx-star text-secondary text-sm' />
                  </div>
                  <LinearProgress
                    variant='determinate'
                    value={pct}
                    color={color}
                    className='bs-2.5 rounded-sm flex-1'
                  />
                  <Typography className='min-w-[50px] text-right text-textSecondary'>—</Typography>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </Grid>

      {/* Modular sections mirroring SNS Pro pattern */}
      <Grid size={{ xs: 12 }}>
        <ReviewsTabsAndTables inventoryData={inventoryData} dateRange={dateFilter} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ReviewsProductCards productData={inventoryData} />
      </Grid>

      {/* Solicitations UI added here per user request */}
      <Grid size={{ xs: 12 }}>
        <SolicitationsManager />
      </Grid>
    </Grid>
  )
}

export default ReviewsDashboard
