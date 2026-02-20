'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'

// Mock data for different time periods
const mockDataByPeriod = {
  'Last Week': {
    totalOrders: '8,258',
    totalSales: '42.82k',
    percentage: '38%',
    series: [45, 80, 20, 40],
    data: [
      {
        avatarIcon: 'bx-mobile-alt',
        avatarColor: 'primary',
        title: 'Electronic',
        subtitle: 'Mobile, Earbuds, TV',
        stat: '82.5k'
      },
      {
        avatarIcon: 'bx-closet',
        avatarColor: 'success',
        title: 'Fashion',
        subtitle: 'Tshirt, Jeans, Shoes',
        stat: '23.8k'
      },
      {
        avatarIcon: 'bx-home-alt',
        avatarColor: 'info',
        title: 'Decor',
        subtitle: 'Fine Art, Dining',
        stat: '849'
      }
    ]
  },
  'Last Month': {
    totalOrders: '32,541',
    totalSales: '156.2k',
    percentage: '42%',
    series: [52, 85, 25, 48],
    data: [
      {
        avatarIcon: 'bx-mobile-alt',
        avatarColor: 'primary',
        title: 'Electronic',
        subtitle: 'Mobile, Earbuds, TV',
        stat: '95.2k'
      },
      {
        avatarIcon: 'bx-closet',
        avatarColor: 'success',
        title: 'Fashion',
        subtitle: 'Tshirt, Jeans, Shoes',
        stat: '42.1k'
      },
      {
        avatarIcon: 'bx-home-alt',
        avatarColor: 'info',
        title: 'Decor',
        subtitle: 'Fine Art, Dining',
        stat: '18.9k'
      }
    ]
  },
  'Last Year': {
    totalOrders: '421,580',
    totalSales: '1.82M',
    percentage: '45%',
    series: [60, 90, 30, 55],
    data: [
      {
        avatarIcon: 'bx-mobile-alt',
        avatarColor: 'primary',
        title: 'Electronic',
        subtitle: 'Mobile, Earbuds, TV',
        stat: '1.1M'
      },
      {
        avatarIcon: 'bx-closet',
        avatarColor: 'success',
        title: 'Fashion',
        subtitle: 'Tshirt, Jeans, Shoes',
        stat: '485k'
      },
      {
        avatarIcon: 'bx-home-alt',
        avatarColor: 'info',
        title: 'Decor',
        subtitle: 'Fine Art, Dining',
        stat: '235k'
      }
    ]
  }
}

const OrderStatistics = () => {
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
      text: 'Last Year',
      menuItemProps: {
        onClick: () => handlePeriodChange('Last Year')
      }
    }
  ]

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      'var(--mui-palette-success-main)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-secondary-main)',
      'var(--mui-palette-info-main)'
    ],
    grid: {
      padding: {}
    },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: { width: 4, lineCap: 'round', colors: ['var(--mui-palette-background-paper)'] },
    labels: ['Fashion', 'Electronic', 'Decor'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: '0.8125rem',
              color: 'var(--mui-palette-text-secondary)'
            },
            value: {
              offsetY: -16,
              fontWeight: 500,
              fontSize: '1.125rem',
              formatter: value => `${value}`,
              color: 'var(--mui-palette-text-primary)'
            },
            total: {
              show: true,
              label: selectedPeriod.replace('Last ', ''),
              fontSize: '0.8125rem',
              color: 'var(--mui-palette-text-secondary)',
              formatter: () => currentData.percentage
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Order Statistics'
        subheader={`${currentData.totalSales} Total Sales`}
        action={<OptionMenu options={menuOptions} />}
      />
      <CardContent className='flex flex-col gap-6'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-1'>
          <div className='flex flex-col items-start gap-1'>
            <Typography variant='h3'>{currentData.totalOrders}</Typography>
            <Typography variant='caption' color='text.secondary'>
              Total Orders
            </Typography>
          </div>
          <AppReactApexCharts type='donut' height={110} width={110} options={options} series={currentData.series} />
        </div>
        <div className='flex flex-col gap-9'>
          {currentData.data.map(item => (
            <div key={item.title} className='flex items-center gap-3'>
              <CustomAvatar variant='rounded' skin='light' color={item.avatarColor} size={40}>
                <i className={item.avatarIcon} />
              </CustomAvatar>
              <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-0 is-full'>
                <div className='flex flex-col items-start'>
                  <Typography variant='h6'>{item.title}</Typography>
                  <Typography variant='body2'>{item.subtitle}</Typography>
                </div>
                <Typography color='text.primary'>{item.stat}</Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderStatistics
