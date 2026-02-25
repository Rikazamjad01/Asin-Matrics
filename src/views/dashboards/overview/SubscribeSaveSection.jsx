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
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import SectionFilter from './SectionFilter'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock Data
import { getSubscribeSaveData } from '@/libs/overview/overviewMockData'

// Helpers
const fmtCurrency = val => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

const SubscribeSaveSection = () => {
  const theme = useTheme()
  const [product, setProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)

  const data = useMemo(
    () => getSubscribeSaveData(product, dateRange, customDateRange),
    [product, dateRange, customDateRange]
  )

  // Subscriber Trend chart
  const trendOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['var(--mui-palette-primary-main)'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 5,
      padding: { top: -10, bottom: -5 }
    },
    xaxis: {
      categories: data.subscriberTrend.categories,
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
        formatter: val => val.toLocaleString(),
        style: {
          fontSize: '12px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    tooltip: {
      y: { formatter: val => val.toLocaleString() }
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      strokeColors: 'var(--mui-palette-background-paper)',
      hover: { sizeOffset: 3 }
    }
  }

  const trendSeries = [{ name: 'Subscribers', data: data.subscriberTrend.data }]

  const tiles = [
    { icon: 'bx-group', color: 'primary', label: 'Total Subscribers', value: data.totalSubscribers.toLocaleString() },
    {
      icon: 'bx-trending-up',
      color: 'success',
      label: 'Monthly Growth',
      value: `${data.monthlyGrowth}%`
    },
    {
      icon: 'bx-dollar-circle',
      color: 'info',
      label: 'Recurring Revenue',
      value: fmtCurrency(data.recurringRevenue)
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Subscribe & Save Overview'
        subheader='Subscriber metrics, revenue forecasts & top products'
        action={
          <SectionFilter
            product={product}
            onProductChange={setProduct}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
          />
        }
      />
      <Divider />
      <CardContent>
        {/* KPI Tiles */}
        <Grid container spacing={4} className='mbe-5'>
          {tiles.map((tile, i) => (
            <Grid key={i} size={{ xs: 12, sm: 4 }}>
              <Box className='flex items-center gap-3 p-3 rounded bg-actionHover'>
                <CustomAvatar size={40} variant='rounded' skin='light' color={tile.color}>
                  <i className={`${tile.icon} text-lg`} />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.disabled'>
                    {tile.label}
                  </Typography>
                  <Typography variant='h6' className='font-semibold leading-tight'>
                    {tile.value}
                  </Typography>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Planned Revenue Forecast */}
        <Typography variant='subtitle2' color='text.secondary' className='mbe-3'>
          Planned Revenue Forecast
        </Typography>
        <Grid container spacing={3} className='mbe-5'>
          <Grid size={{ xs: 4 }}>
            <Box className='p-4 rounded bg-actionHover'>
              <Typography variant='caption' color='text.disabled'>
                30-Day Planned Revenue Forecast
              </Typography>
              <div className='flex justify-between items-center'>
                <Typography variant='h6' color='primary.main' className='font-bold'>
                  {fmtCurrency(data.plannedRevenue.days30)}
                </Typography>
                {/* percentage */}
                <Typography variant='caption' color='text.disabled'>
                  {data.plannedRevenue.days30Growth}%
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box className='p-4 rounded bg-actionHover'>
              <Typography variant='caption' color='text.disabled'>
                60-Day Planned Revenue Forecast
              </Typography>
              <div className='flex justify-between items-center'>
                <Typography variant='h6' color='info.main' className='font-bold'>
                  {fmtCurrency(data.plannedRevenue.days60)}
                </Typography>
                {/* percentage */}
                <Typography variant='caption' color='text.disabled'>
                  {data.plannedRevenue.days60Growth}%
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box className='p-4 rounded bg-actionHover'>
              <Typography variant='caption' color='text.disabled'>
                90-Day Planned Revenue Forecast
              </Typography>
              <div className='flex justify-between items-center'>
                <Typography variant='h6' color='success.main' className='font-bold'>
                  {fmtCurrency(data.plannedRevenue.days90)}
                </Typography>
                {/* percentage */}
                <Typography variant='caption' color='text.disabled'>
                  {data.plannedRevenue.days90Growth}%
                </Typography>
              </div>
            </Box>
          </Grid>
        </Grid>

        {/* Subscriber Trend Chart */}
        <Typography variant='subtitle2' color='text.secondary' className='mbe-2'>
          Subscriber Trend
        </Typography>

        <Grid container spacing={3} className='mbe-5'>
          <Grid size={{ xs: 6 }}>
            <AppReactApexCharts type='area' width='100%' series={trendSeries} options={trendOptions} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            {/* Top Subscribe & Save Products */}
            <Typography variant='subtitle2' color='text.secondary' className='mbe-3'>
              Top Subscribe & Save Products
            </Typography>
            {data.topProducts.map((prod, i) => (
              <Box key={i} className='flex items-center justify-between p-3 rounded mbe-2 bg-actionHover'>
                <div className='flex items-center gap-3'>
                  <CustomAvatar size={32} variant='rounded' skin='light' color='primary'>
                    <Typography variant='caption' className='font-bold'>
                      #{i + 1}
                    </Typography>
                  </CustomAvatar>
                  <div>
                    <Typography variant='body2' className='font-medium'>
                      {prod.name}
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                      {prod.subscribers} subscribers
                    </Typography>
                  </div>
                </div>
                <Typography variant='subtitle2' className='font-semibold'>
                  {fmtCurrency(prod.revenue)}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Bottom Button */}
        <div className='flex justify-end mbs-4'>
          <Button variant='contained' endIcon={<i className='bx-right-arrow-alt' />}>
            View Subscriber Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SubscribeSaveSection
