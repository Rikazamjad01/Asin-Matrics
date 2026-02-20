'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock data for different time periods
const mockDataByPeriod = {
  'Last Week': {
    series: [{ data: [23, 81, 70, 31, 99, 46, 73] }],
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    value: '425k'
  },
  'Last Month': {
    series: [
      {
        data: [
          45, 92, 82, 58, 105, 68, 95, 75, 88, 92, 78, 86, 90, 82, 88, 95, 87, 90, 85, 92, 88, 91, 86, 89, 93, 87, 90,
          94, 88, 92
        ]
      }
    ],
    categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    value: '1.8M'
  },
  'Last Quarter': {
    series: [{ data: [420, 485, 510, 542, 498, 525, 550, 582, 515, 548, 582, 515] }],
    categories: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
      'Week 5',
      'Week 6',
      'Week 7',
      'Week 8',
      'Week 9',
      'Week 10',
      'Week 11',
      'Week 12'
    ],
    value: '5.4M'
  }
}

const BarRevenueChart = () => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState('Last Week')

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
    plotOptions: {
      bar: {
        borderRadius: 2,
        distributed: true,
        columnWidth: '65%'
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
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-primary-lightOpacity)',
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
      categories: currentData.categories,
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '11px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: { show: false },
    grid: {
      show: false,
      padding: {
        left: 0,
        top: -18,
        right: 7,
        bottom: -3
      }
    }
  }

  return (
    <Card>
      <CardHeader
        className='pb-3'
        title='Inventory Turnover'
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
      <CardContent className='pbs-0'>
        <AppReactApexCharts type='bar' height={100} width='100%' series={currentData.series} options={options} />
      </CardContent>
    </Card>
  )
}

export default BarRevenueChart
