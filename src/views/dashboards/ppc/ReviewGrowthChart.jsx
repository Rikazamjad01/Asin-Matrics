'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const ReviewGrowthChart = ({ weeklyTrend }) => {
  const theme = useTheme()

  const categories = weeklyTrend.map(w => w.week)
  const newReviewsData = weeklyTrend.map(w => w.newReviews)
  const totalReviewsData = weeklyTrend.map(w => w.totalReviews)

  // Summary stats
  const totalNew = newReviewsData.reduce((a, b) => a + b, 0)
  const peakWeek = weeklyTrend.reduce((best, w) => (w.newReviews > best.newReviews ? w : best), weeklyTrend[0])
  const latestAvgRating = weeklyTrend[weeklyTrend.length - 1]?.avgRating ?? 0
  const firstAvgRating = weeklyTrend[0]?.avgRating ?? 0
  const ratingDelta = (latestAvgRating - firstAvgRating).toFixed(2)

  const series = [
    { name: 'New Reviews', type: 'bar', data: newReviewsData },
    { name: 'Total Reviews', type: 'line', data: totalReviewsData }
  ]

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      stacked: false
    },
    dataLabels: { enabled: false },
    stroke: {
      width: [0, 3],
      curve: 'smooth'
    },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-warning-main)'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '55%'
      }
    },
    fill: {
      opacity: [0.85, 1]
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 6,
      padding: { top: 5, right: 6, bottom: 7 }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories,
      labels: {
        rotate: -30,
        style: {
          fontSize: '11px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: [
      {
        seriesName: 'New Reviews',
        title: {
          text: 'New Reviews',
          style: { color: 'var(--mui-palette-primary-main)', fontFamily: theme.typography.fontFamily }
        },
        labels: {
          formatter: val => Math.round(val),
          style: {
            fontSize: '12px',
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily
          }
        }
      },
      {
        seriesName: 'Total Reviews',
        opposite: true,
        title: {
          text: 'Total Reviews',
          style: { color: 'var(--mui-palette-warning-main)', fontFamily: theme.typography.fontFamily }
        },
        labels: {
          formatter: val => val?.toLocaleString(),
          style: {
            fontSize: '12px',
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily
          }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -4,
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      itemMargin: { horizontal: 9 }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => `${Math.round(val)} new reviews` },
        { formatter: val => val?.toLocaleString() + ' total' }
      ]
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    }
  }

  const summaryItems = [
    {
      icon: 'bx-star',
      color: 'warning',
      label: 'Avg Rating',
      value: `${latestAvgRating.toFixed(1)} ★`,
      sub: ratingDelta >= 0 ? `+${ratingDelta} vs start` : `${ratingDelta} vs start`
    },
    {
      icon: 'bx-message-square-add',
      color: 'primary',
      label: 'New Reviews (Period)',
      value: totalNew.toLocaleString(),
      sub: `Peak: ${peakWeek.newReviews} in ${peakWeek.week}`
    },
    {
      icon: 'bx-trending-up',
      color: 'success',
      label: 'Total Reviews',
      value: (weeklyTrend[weeklyTrend.length - 1]?.totalReviews ?? 0).toLocaleString(),
      sub: `Started at ${weeklyTrend[0]?.totalReviews?.toLocaleString()}`
    }
  ]

  return (
    <Card>
      <Grid container>
        <Grid size={{ xs: 12, md: 8 }} className='max-md:border-be md:border-ie'>
          <CardHeader
            title='Review Growth Trend'
            subheader='Weekly new reviews vs cumulative total'
            action={<OptionMenu options={['Last 4 Weeks', 'Last 8 Weeks', 'All Time']} />}
          />
          <CardContent className='pbs-0'>
            <AppReactApexCharts type='bar' height={300} width='100%' series={series} options={options} />
          </CardContent>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CardHeader title='Summary' subheader='Period highlights' />
          <CardContent className='flex flex-col gap-y-4'>
            {summaryItems.map((item, idx) => (
              <div key={idx} className='plb-3 pli-4 flex items-center gap-x-4 bg-actionHover rounded'>
                <CustomAvatar size={40} variant='rounded' skin='light' color={item.color}>
                  <i className={`${item.icon} text-lg`} />
                </CustomAvatar>
                <div>
                  <Typography color='text.disabled' variant='body2'>
                    {item.label}
                  </Typography>
                  <Typography variant='h6' className='font-medium'>
                    {item.value}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {item.sub}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default ReviewGrowthChart
