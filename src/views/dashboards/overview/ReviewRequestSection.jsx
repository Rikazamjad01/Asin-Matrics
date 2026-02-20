'use client'

import { useState, useMemo } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import SectionFilter from './SectionFilter'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock Data
import { getReviewRequestData } from '@/libs/overview/overviewMockData'

const starColors = {
  5: 'success',
  4: 'primary',
  3: 'info',
  2: 'warning',
  1: 'error'
}

const ReviewRequestSection = () => {
  const theme = useTheme()
  const [product, setProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  const data = useMemo(() => getReviewRequestData(product, dateRange), [product, dateRange])

  // Reviews Received Trend chart
  const trendOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    colors: ['var(--mui-palette-primary-main)'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '50%'
      }
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 5,
      padding: { top: -10, bottom: -5 }
    },
    xaxis: {
      categories: data.reviewTrend.categories,
      labels: {
        style: {
          fontSize: '11px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    tooltip: {
      y: { formatter: val => `${val} reviews` }
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    }
  }

  const trendSeries = [{ name: 'Reviews', data: data.reviewTrend.data }]

  const tiles = [
    {
      icon: 'bx-send',
      color: 'primary',
      label: 'Requests Sent',
      value: data.requestsSent.value.toLocaleString(),
      trend: data.requestsSent.trend,
      percent: data.requestsSent.percent
    },
    {
      icon: 'bx-message-square-check',
      color: 'success',
      label: 'Reviews Received',
      value: data.reviewsReceived.value.toLocaleString(),
      trend: data.reviewsReceived.trend,
      percent: data.reviewsReceived.percent
    },
    {
      icon: 'bx-transfer-alt',
      color: 'info',
      label: 'Conversion Rate',
      value: `${data.conversionRate.value}%`,
      trend: data.conversionRate.trend,
      percent: data.conversionRate.percent
    },
    {
      icon: 'bx-star',
      color: 'warning',
      label: 'Avg. Rating',
      value: data.avgRating.value.toFixed(1),
      trend: data.avgRating.trend,
      percent: data.avgRating.percent
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Review Request Insights'
        subheader='Requests, reviews, conversion & rating distribution'
        action={
          <SectionFilter
            product={product}
            onProductChange={setProduct}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        }
      />
      <Divider />
      <CardContent>
        {/* KPI Tiles */}
        <Grid container spacing={4} className='mbe-5'>
          {tiles.map((tile, i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Box className='flex items-center gap-3 p-3 rounded bg-actionHover'>
                <CustomAvatar size={40} variant='rounded' skin='light' color={tile.color}>
                  <i className={`${tile.icon} text-lg`} />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.disabled'>
                    {tile.label}
                  </Typography>
                  <div className='flex items-center gap-1.5'>
                    <Typography variant='h6' className='font-semibold leading-tight'>
                      {tile.value}
                    </Typography>
                    <Typography
                      variant='caption'
                      color={tile.trend === 'positive' ? 'success.main' : 'error.main'}
                      className='flex items-center gap-0.5 font-medium'
                    >
                      <i
                        className={classnames(
                          'text-base',
                          tile.trend === 'positive' ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'
                        )}
                      />
                      {tile.percent}%
                    </Typography>
                  </div>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Reviews Received Trend */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant='subtitle2' color='text.secondary' className='mbe-2'>
              Reviews Received Trend
            </Typography>
            <AppReactApexCharts type='bar' height={260} width='100%' series={trendSeries} options={trendOptions} />
          </Grid>

          {/* Rating Distribution */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant='subtitle2' color='text.secondary' className='mbe-5'>
              Rating Distribution
            </Typography>
            <Box className='flex flex-col gap-7 mbs-2'>
              {data.ratingDistribution.map(item => (
                <Box key={item.stars} className='flex items-center gap-6'>
                  <div className='flex items-center gap-1 min-w-[60px]'>
                    <Typography variant='body2' className='font-medium'>
                      {item.stars}
                    </Typography>
                    <i className='bx-star text-warning-main' style={{ fontSize: 14 }} />
                  </div>
                  <LinearProgress
                    variant='determinate'
                    value={item.percent}
                    color={starColors[item.stars]}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant='caption' color='text.secondary' sx={{ minWidth: 50, textAlign: 'right' }}>
                    {item.count} ({item.percent}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReviewRequestSection
