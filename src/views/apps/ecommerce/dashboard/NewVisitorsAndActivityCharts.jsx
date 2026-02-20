'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock data for different time periods
const mockData = {
  'Last Week': {
    barSeries: [{ data: [20, 60, 53, 25, 42, 86, 55] }],
    lineAreaSeries: [{ data: [14, 22, 17, 40, 12, 35, 25] }],
    barCategories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    lineCategories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    newVisitors: { percentage: '23%', change: '8.75%', isIncrease: false },
    activity: { percentage: '82%', change: '19.6%', isIncrease: true }
  },
  'Last 15 Days': {
    barSeries: [
      {
        data: [
          45, 52, 38, 65, 48, 72, 59, 55, 61, 48, 70, 82, 58, 67, 43
        ]
      }
    ],
    lineAreaSeries: [
      {
        data: [
          25, 31, 22, 45, 28, 38, 32, 29, 35, 27, 42, 36, 31, 39, 26
        ]
      }
    ],
    barCategories: Array.from({ length: 15 }, (_, i) => `${i + 1}`),
    lineCategories: Array.from({ length: 15 }, (_, i) => `${i + 1}`),
    newVisitors: { percentage: '31%', change: '12.3%', isIncrease: true },
    activity: { percentage: '76%', change: '5.8%', isIncrease: true }
  },
  'Last Quarter': {
    barSeries: [{ data: [58, 62, 71] }],
    lineAreaSeries: [{ data: [35, 38, 42] }],
    barCategories: ['Jan', 'Feb', 'Mar'],
    lineCategories: ['Jan', 'Feb', 'Mar'],
    newVisitors: { percentage: '38%', change: '15.2%', isIncrease: true },
    activity: { percentage: '88%', change: '22.4%', isIncrease: true }
  }
}

const NewVisitorsAndActivityCharts = () => {
  // States
  const [timePeriod, setTimePeriod] = useState('Last Week')
  const [anchorEl, setAnchorEl] = useState(null)

  // Hook
  const theme = useTheme()

  // Get current data based on selected time period
  const currentData = mockData[timePeriod]

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handlePeriodSelect = period => {
    setTimePeriod(period)
    handleClose()
  }

  // Vars
  const barOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '40%'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-primary-lightOpacity)'
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: currentData.barCategories,
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '14px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: { show: false },
    grid: {
      show: false,
      padding: {
        top: -10,
        left: 5,
        right: 5,
        bottom: -2
      }
    },
    responsive: [
      {
        breakpoint: 1165,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%',
              borderRadius: 5
            }
          }
        }
      }
    ]
  }

  const lineAreaChartOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    grid: {
      show: false,
      padding: {
        top: -12,
        bottom: -9
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0.7,
        opacityFrom: 0.5,
        shadeIntensity: 1,
        stops: [0, 90, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.6,
              color: 'var(--mui-palette-success-main)'
            },
            {
              offset: 100,
              opacity: 0.1,
              color: 'var(--mui-palette-background-default)'
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette.success.main
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: currentData.lineCategories,
      labels: {
        style: {
          fontSize: '14px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }} className='max-md:border-be md:border-ie md:-mlb-6'>
            <div className='flex items-center justify-between pbe-6 md:mie-6 max-md:pie-6'>
              <Typography className='pbs-6' variant='h5'>
                New Visitors
              </Typography>
              <Button
                variant='text'
                size='small'
                onClick={handleClick}
                endIcon={<i className='bx-chevron-down' />}
                className='pbs-6'
                sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
              >
                {timePeriod}
              </Button>
            </div>
            <div className='flex gap-x-6 justify-between md:mie-6 max-md:mbe-6 max-md:pie-6'>
              <div className='flex flex-col gap-y-1 mbs-auto'>
                <Typography variant='h3'>{currentData.newVisitors.percentage}</Typography>
                <div className='flex gap-1 items-center'>
                  <i
                    className={`bx-${currentData.newVisitors.isIncrease ? 'up' : 'down'}-arrow-alt text-xl text-${currentData.newVisitors.isIncrease ? 'success' : 'error'}`}
                  />
                  <Typography
                    variant='body2'
                    color={`${currentData.newVisitors.isIncrease ? 'success' : 'error'}.main`}
                    className='font-medium'
                  >
                    {currentData.newVisitors.change}
                  </Typography>
                </div>
              </div>
              <AppReactApexCharts
                type='bar'
                height={134}
                width='110%'
                series={currentData.barSeries}
                options={barOptions}
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className='flex items-center justify-between pbe-6 max-md:pie-6'>
              <Typography variant='h5'>Activity</Typography>
              <Button
                variant='text'
                size='small'
                onClick={handleClick}
                endIcon={<i className='bx-chevron-down' />}
                sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
              >
                {timePeriod}
              </Button>
            </div>
            <div className='flex gap-x-6 justify-between max-md:pie-6'>
              <div className='flex flex-col gap-y-1 mbs-auto'>
                <Typography variant='h3'>{currentData.activity.percentage}</Typography>
                <div className='flex gap-1 items-center'>
                  <i
                    className={`bx-${currentData.activity.isIncrease ? 'up' : 'down'}-arrow-alt text-xl text-${currentData.activity.isIncrease ? 'success' : 'error'}`}
                  />
                  <Typography
                    variant='body2'
                    color={`${currentData.activity.isIncrease ? 'success' : 'error'}.main`}
                    className='font-medium'
                  >
                    {currentData.activity.change}
                  </Typography>
                </div>
              </div>
              <AppReactApexCharts
                type='area'
                height={134}
                width='100%'
                series={currentData.lineAreaSeries}
                options={lineAreaChartOptions}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>

      {/* Time Period Selector Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handlePeriodSelect('Last Week')} selected={timePeriod === 'Last Week'}>
          Last Week
        </MenuItem>
        <MenuItem onClick={() => handlePeriodSelect('Last 15 Days')} selected={timePeriod === 'Last 15 Days'}>
          Last 15 Days
        </MenuItem>
        <MenuItem onClick={() => handlePeriodSelect('Last Quarter')} selected={timePeriod === 'Last Quarter'}>
          Last Quarter
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default NewVisitorsAndActivityCharts
