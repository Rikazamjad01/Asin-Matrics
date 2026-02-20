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
  'This Month': {
    series: [{ data: [11, 7, 11, 20] }, { data: [9, 5, 15, 18] }],
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    total: '65k'
  },
  'Last Month': {
    series: [{ data: [13, 9, 10, 18] }, { data: [8, 6, 14, 16] }],
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    total: '58k'
  },
  'Last Quarter': {
    series: [{ data: [12, 15, 18] }, { data: [10, 12, 14] }],
    categories: ['Month 1', 'Month 2', 'Month 3'],
    total: '182k'
  },
  'Last Year': {
    series: [
      { data: [11, 7, 11, 20, 14, 18, 16, 22, 19, 15, 21, 24] },
      { data: [9, 5, 15, 18, 12, 16, 14, 20, 17, 13, 19, 22] }
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    total: '720k'
  }
}

const BarOrdersChart = () => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')

  // Get current data
  const currentData = mockDataByPeriod[selectedPeriod]

  const handlePeriodChange = period => {
    setSelectedPeriod(period)
  }

  // Create menu options
  const menuOptions = [
    {
      text: 'This Month',
      menuItemProps: {
        onClick: () => handlePeriodChange('This Month')
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
    },
    {
      text: 'Last Year',
      menuItemProps: {
        onClick: () => handlePeriodChange('Last Year')
      }
    }
  ]

  // Vars
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      padding: {
        top: -22,
        left: -5,
        right: 2,
        bottom: -3
      },
      yaxis: {
        lines: { show: false }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-success-main)', 'var(--mui-palette-success-lightOpacity'],
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '70%'
      }
    },
    stroke: {
      width: 2,
      colors: ['var(--mui-palette-background-paper)']
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: currentData.categories,
      labels: {
        style: {
          fontSize: '14px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  return (
    <Card>
      <CardHeader
        className='pb-3'
        title='Total Orders'
        subheader={currentData.total}
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
        <AppReactApexCharts type='bar' height={88} width='100%' series={currentData.series} options={options} />
      </CardContent>
    </Card>
  )
}

export default BarOrdersChart
