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

// Data for different time periods
const dataByPeriod = {
  'This Month': {
    series: [
      {
        name: 'Product A',
        data: [77, 50, 59, 67]
      },
      {
        name: 'Product B',
        data: [20, 23, 27, 27]
      }
    ],
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  },
  'Last Month': {
    series: [
      {
        name: 'Product A',
        data: [65, 58, 72, 61]
      },
      {
        name: 'Product B',
        data: [18, 25, 22, 24]
      }
    ],
    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  },
  'Last Quarter': {
    series: [
      {
        name: 'Product A',
        data: [65, 72, 68]
      },
      {
        name: 'Product B',
        data: [22, 25, 28]
      }
    ],
    categories: ['Month 1', 'Month 2', 'Month 3']
  },
  'Last Year': {
    series: [
      {
        name: 'Product A',
        data: [65, 70, 68, 72, 75, 78, 82, 85, 88, 90, 92, 95]
      },
      {
        name: 'Product B',
        data: [20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34]
      }
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
}

const OverviewSalesActivity = () => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')

  // Get current data based on selected period
  const currentData = dataByPeriod[selectedPeriod]

  const options = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      lineCap: 'round',
      colors: ['var(--mui-palette-background-paper)']
    },
    colors: ['var(--mui-palette-error-main)', 'var(--mui-palette-secondary-main)'],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: {
      show: false
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        columnWidth: '45%',
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'all'
      }
    },
    xaxis: {
      axisTicks: { show: false },
      crosshairs: { opacity: 0 },
      axisBorder: { show: false },
      categories: currentData.categories,
      labels: {
        style: {
          fontSize: '15px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 1450,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%',
              borderRadius: 6
            }
          }
        }
      }
    ]
  }

  const handlePeriodChange = period => {
    setSelectedPeriod(period)
  }

  // Create menu options with proper click handlers
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

  return (
    <Card>
      <CardHeader
        title='Overview & Sales Activity'
        subheader={`${selectedPeriod} Analytics`}
        action={<OptionMenu options={menuOptions} />}
      />
      <CardContent className='flex flex-col gap-y-6'>
        <AppReactApexCharts type='bar' height={322} width='100%' series={currentData.series} options={options} />
      </CardContent>
    </Card>
  )
}

export default OverviewSalesActivity
