// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third Party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
import AppReactApexCharts from '@/libs/styles/AppReactApexCharts'

// Vars
const series = [
  {
    data: [42, 65, 58, 72]
  }
]

const data = [
  {
    title: 'Ad Clicks',
    subtitle: '3,245 Clicks from Ads',
    percentage: 15.8
  },
  {
    title: 'Product Views',
    subtitle: '2,580 Detail Page Views',
    percentage: 12.4
  },
  {
    title: 'Add to Cart',
    subtitle: '428 Items Added',
    percentage: 8.6
  },
  {
    title: 'Purchases',
    subtitle: '142 Orders',
    percentage: 5.2
  }
]

const ConversionRate = () => {
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 6,
        blur: 3,
        left: 3,
        enabled: true,
        opacity: 0.14,
        color: 'var(--mui-palette-primary-main)'
      }
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        bottom: -5,
        left: -5
      }
    },
    tooltip: { enabled: false },
    colors: ['var(--mui-palette-primary-main)'],
    markers: {
      size: 6,
      offsetX: -2,
      offsetY: -1,
      strokeWidth: 5,
      strokeOpacity: 1,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 7,
          seriesIndex: 0,
          strokeColor: 'var(--mui-palette-primary-main)',
          fillColor: 'var(--mui-palette-background-paper)',
          dataPointIndex: series[0].data.length - 1
        }
      ]
    },
    stroke: {
      width: 5,
      curve: 'smooth',
      lineCap: 'round'
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Ad Conversion Funnel'
        subheader='Amazon Advertising Performance'
        action={<OptionMenu options={['Last Week', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='flex flex-col gap-6 md:max-lg:gap-8 md:max-lg:pbs-3'>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <Typography variant='h3'>4.38%</Typography>
            <div className='flex items-center'>
              <i className='bx-chevron-up text-success' />
              <Typography variant='body2' color='success.main'>
                2.4%
              </Typography>
            </div>
          </div>
          <AppReactApexCharts type='line' height={60} width={100} options={options} series={series} />
        </div>
        <div className='flex flex-col gap-5 md:max-lg:gap-7'>
          {data.map(item => (
            <div key={item.title} className='flex items-center justify-between flex-wrap gap-x-6 gap-y-1'>
              <div className='flex flex-col items-start'>
                <Typography color='text.primary'>{item.title}</Typography>
                <Typography variant='body2'>{item.subtitle}</Typography>
              </div>
              <div className='flex items-start gap-2'>
                <i
                  className={classnames({
                    'bx-up-arrow-alt text-success': item.percentage > 0,
                    'bx-down-arrow-alt text-error': item.percentage < 0
                  })}
                />
                <Typography>{`${item.percentage}%`}</Typography>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConversionRate
