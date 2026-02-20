'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'

// Mock data for different time periods
const mockDataByPeriod = {
  'Last Week': {
    subheader: 'Weekly Earnings Overview',
    series: [{ data: [32, 98, 61, 41, 88, 47, 71] }],
    categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    data: [
      {
        avatarIcon: 'bx-trending-up',
        avatarColor: 'primary',
        title: 'Net Profit',
        subtitle: '12.4k Sales',
        amount: '$1,619',
        percentage: 18.6
      },
      {
        avatarIcon: 'bx-dollar',
        avatarColor: 'success',
        title: 'Total Income',
        subtitle: 'Sales, Affiliation',
        amount: '$3,571',
        percentage: 39.6
      },
      {
        avatarIcon: 'bx-credit-card',
        avatarColor: 'secondary',
        title: 'Total Expenses',
        subtitle: 'ADVT, Marketing',
        amount: '$430',
        percentage: 52.8
      }
    ]
  },
  'Last Month': {
    subheader: 'Monthly Earnings Overview',
    series: [
      {
        data: [
          45, 62, 58, 71, 65, 82, 68, 75, 88, 78, 92, 85, 79, 90, 72, 68, 95, 81, 86, 77, 84, 92, 89, 76, 83, 91, 87,
          94, 80, 88
        ]
      }
    ],
    categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    data: [
      {
        avatarIcon: 'bx-trending-up',
        avatarColor: 'primary',
        title: 'Net Profit',
        subtitle: '52.8k Sales',
        amount: '$6,842',
        percentage: 22.4
      },
      {
        avatarIcon: 'bx-dollar',
        avatarColor: 'success',
        title: 'Total Income',
        subtitle: 'Sales, Affiliation',
        amount: '$14,250',
        percentage: 42.1
      },
      {
        avatarIcon: 'bx-credit-card',
        avatarColor: 'secondary',
        title: 'Total Expenses',
        subtitle: 'ADVT, Marketing',
        amount: '$1,820',
        percentage: 48.5
      }
    ]
  },
  'Last Quarter': {
    subheader: 'Quarterly Earnings Overview',
    series: [{ data: [165, 182, 175, 195, 188, 205] }],
    categories: [
      'Month 1',
      'Month 2',
      'Month 3',
      'Month 4',
      'Month 5',
      'Month 6',
    ],
    data: [
      {
        avatarIcon: 'bx-trending-up',
        avatarColor: 'primary',
        title: 'Net Profit',
        subtitle: '158.2k Sales',
        amount: '$19,524',
        percentage: 28.7
      },
      {
        avatarIcon: 'bx-dollar',
        avatarColor: 'success',
        title: 'Total Income',
        subtitle: 'Sales, Affiliation',
        amount: '$42,850',
        percentage: 45.2
      },
      {
        avatarIcon: 'bx-credit-card',
        avatarColor: 'secondary',
        title: 'Total Expenses',
        subtitle: 'ADVT, Marketing',
        amount: '$5,460',
        percentage: 44.8
      }
    ]
  },
  'Last Year': {
    subheader: 'Yearly Earnings Overview',
    series: [{ data: [620, 685, 710, 742, 798, 825, 850, 892, 915, 948, 982, 1015] }],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [
      {
        avatarIcon: 'bx-trending-up',
        avatarColor: 'primary',
        title: 'Net Profit',
        subtitle: '642.5k Sales',
        amount: '$78,245',
        percentage: 32.5
      },
      {
        avatarIcon: 'bx-dollar',
        avatarColor: 'success',
        title: 'Total Income',
        subtitle: 'Sales, Affiliation',
        amount: '$168,420',
        percentage: 48.9
      },
      {
        avatarIcon: 'bx-credit-card',
        avatarColor: 'secondary',
        title: 'Total Expenses',
        subtitle: 'ADVT, Marketing',
        amount: '$21,850',
        percentage: 42.3
      }
    ]
  }
}

const EarningReports = () => {
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
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { enabled: false },
    grid: {
      show: false,
      padding: {
        top: -16,
        left: -18,
        right: -17,
        bottom: -11
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: '60%'
      }
    },
    legend: { show: false },
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
          fontSize: '13px',
          colors: 'var(--mui-palette-text-disabled)'
        }
      }
    },
    yaxis: { show: false },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          chart: {
            height: '178px'
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Earning Reports'
        subheader={currentData.subheader}
        action={<OptionMenu options={menuOptions} />}
      />
      <CardContent className='flex flex-col gap-y-4'>
        {currentData.data.map(item => (
          <div key={item.title} className='flex items-center gap-3'>
            <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={34}>
              <i className={classnames(item.avatarIcon, 'text-[22px]')} />
            </CustomAvatar>
            <div className='flex flex-wrap justify-between items-center gap-x-4 gap-y-1 is-full'>
              <div className='flex flex-col items-start'>
                <Typography variant='h6'>{item.title}</Typography>
                <Typography variant='body2' color='text.disabled'>
                  {item.subtitle}
                </Typography>
              </div>
              <div className='flex items-center gap-3'>
                <Typography>{item.amount}</Typography>
                <div className='flex items-center gap-1'>
                  <i
                    className={classnames(
                      {
                        'bx-chevron-up text-success': item.percentage > 0,
                        'bx-chevron-down text-error': item.percentage < 0
                      },
                      'text-xl'
                    )}
                  />
                  <Typography>{`${item.percentage}%`}</Typography>
                </div>
              </div>
            </div>
          </div>
        ))}
        <AppReactApexCharts type='bar' height={158} width='100%' series={currentData.series} options={options} />
      </CardContent>
    </Card>
  )
}

export default EarningReports
