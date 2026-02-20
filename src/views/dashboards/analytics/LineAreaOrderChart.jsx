'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock data for different time periods
const mockDataByPeriod = {
  'Last Week': {
    series: [{ data: [30, 70, 35, 55, 45, 70] }],
    value: '276k'
  },
  'Last Month': {
    series: [{ data: [40, 65, 50, 70, 55, 75, 60] }],
    value: '1.2M'
  },
  'Last Quarter': {
    series: [{ data: [55, 80, 65, 85, 70, 90] }],
    value: '3.8M'
  }
}

const LineAreaOrderChart = () => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState('Last Week')

  // Hook
  const theme = useTheme()

  // Get current data
  const currentData = mockDataByPeriod[selectedPeriod]

  const handlePeriodChange = period => {
    setSelectedPeriod(period)
  }

  // Create menu options
  const menuOptions = [
    {
      text: 'Last Week',
      menuItemProps: {
        onClick: () => handlePeriodChange('Last Week')
      }
    },
    {
      text: 'Last Month',
      menuItemProps: {
        onClick: () => handlePeriodChange('Last Month')
      }
    },
    {
      text: 'Last Quarter',
      menuItemProps: {
        onClick: () => handlePeriodChange('Last Quarter')
      }
    }
  ]

  // Vars
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round'
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        top: -12,
        right: 4
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
              color: 'var(--mui-palette-background-paper)'
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
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false },
    markers: {
      size: 1,
      offsetY: 2,
      offsetX: -4,
      strokeWidth: 4,
      strokeOpacity: 1,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 6,
          seriesIndex: 0,
          fillColor: '#fff',
          strokeColor: 'var(--mui-palette-success-main)',
          dataPointIndex: currentData.series[0].data.length - 1
        }
      ]
    }
  }

  return (
    <Card className='pbe-6'>
      <CardHeader
        className='pb-3'
        title='Stock Value'
        subheader={currentData.value}
        action={<OptionMenu options={menuOptions} />}
        titleTypographyProps={{
          variant: 'body1'
        }}
        subheaderTypographyProps={{
          sx: {
            fontSize: '1.5rem !important',
            color: 'var(--mui-palette-text-primary) !important',
            fontWeight: '500 !important',
            marginBlockStart: '0.125rem'
          }
        }}
      />
      <AppReactApexCharts type='area' height={87} width='100%' series={currentData.series} options={options} />
    </Card>
  )
}

export default LineAreaOrderChart
