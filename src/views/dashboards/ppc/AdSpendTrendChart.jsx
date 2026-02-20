'use client'

// React Imports
import { useMemo } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme, alpha } from '@mui/material/styles'

// Component Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const AdSpendTrendChart = ({ weeks }) => {
  const theme = useTheme()

  const { categories, spendData, salesData, totalSpend, totalSales } = useMemo(() => {
    const spend = weeks.map(w => parseFloat(w.adSpend.toFixed(2)))
    const sales = weeks.map(w => parseFloat(w.adSales.toFixed(2)))

    return {
      categories: weeks.map(w => w.weekRange),
      spendData: spend,
      salesData: sales,
      totalSpend: spend.reduce((a, b) => a + b, 0),
      totalSales: sales.reduce((a, b) => a + b, 0)
    }
  }, [weeks])

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    stroke: {
      width: [2, 2],
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 95, 100]
      }
    },
    colors: [theme.palette.error.main, theme.palette.success.main],
    markers: {
      size: 4,
      strokeWidth: 2,
      strokeColors: theme.palette.background.paper,
      hover: { sizeOffset: 3 }
    },
    xaxis: {
      categories,
      labels: {
        rotate: -30,
        rotateAlways: categories.length > 6,
        style: {
          fontSize: '11px',
          fontFamily: theme.typography.fontFamily,
          colors: theme.palette.text.disabled
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      }
    },
    yaxis: {
      labels: {
        formatter: val => `$${(val / 1000).toFixed(1)}k`,
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily,
          colors: theme.palette.text.disabled
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '12px' },
      y: {
        formatter: val => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    legend: { show: false },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 5,
      padding: { top: -10, bottom: -5 }
    }
  }

  const series = [
    { name: 'Ad Spend', data: spendData },
    { name: 'Ad Sales', data: salesData }
  ]

  return (
    <Card>
      <CardHeader
        title='Ad Spend vs Ad Sales'
        action={<OptionMenu options={['Last 4 Weeks', 'Last 8 Weeks', 'All Time']} />}
      />
      <CardContent>
        {/* Legend + Totals */}
        <Box className='flex items-center gap-6 mbe-4'>
          <Box className='flex items-center gap-2'>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: theme.palette.error.main
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Ad Spend
            </Typography>
            <Typography variant='subtitle2' className='font-semibold'>
              ${(totalSpend / 1000).toFixed(1)}k
            </Typography>
          </Box>
          <Box className='flex items-center gap-2'>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: theme.palette.success.main
              }}
            />
            <Typography variant='body2' color='text.secondary'>
              Ad Sales
            </Typography>
            <Typography variant='subtitle2' className='font-semibold'>
              ${(totalSales / 1000).toFixed(1)}k
            </Typography>
          </Box>
        </Box>

        <AppReactApexCharts type='area' height={300} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default AdSpendTrendChart
