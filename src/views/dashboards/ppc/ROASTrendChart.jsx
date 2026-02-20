'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Calculation Engine
import { calcROAS, calcACOS, calcTACOS } from '@/libs/ppc/calculationEngine'

const ROASACOSTrendChart = ({ weeks }) => {
  const theme = useTheme()

  const roasData = weeks.map(w => {
    const v = calcROAS(w.adSales, w.adSpend)

    return v != null ? parseFloat(v.toFixed(2)) : null
  })

  const acosData = weeks.map(w => {
    const v = calcACOS(w.adSpend, w.adSales)

    return v != null ? parseFloat(v.toFixed(2)) : null
  })

  const tacosData = weeks.map(w => {
    const v = calcTACOS(w.adSpend, w.totalSales)

    return v != null ? parseFloat(v.toFixed(2)) : null
  })

  const series = [
    { name: 'ROAS', data: roasData },
    { name: 'ACOS %', data: acosData },
    { name: 'TACOS %', data: tacosData }
  ]

  const options = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { width: [3, 2, 2], curve: 'smooth', dashArray: [0, 5, 8] },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-error-main)', 'var(--mui-palette-warning-main)'],
    markers: { size: 4 },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 6,
      padding: { top: 5, right: 6, bottom: 7 }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: weeks.map(w => w.weekRange),
      labels: {
        rotate: -30,
        style: { fontSize: '11px', colors: 'var(--mui-palette-text-disabled)', fontFamily: 'Public Sans' }
      }
    },
    yaxis: [
      {
        title: { text: 'ROAS (x)', style: { color: 'var(--mui-palette-primary-main)' } },
        labels: {
          formatter: val => `${val?.toFixed(1)}x`,
          style: { fontSize: '13px', colors: 'var(--mui-palette-text-disabled)', fontFamily: 'Public Sans' }
        }
      },
      {
        opposite: true,
        title: { text: 'ACOS / TACOS (%)', style: { color: 'var(--mui-palette-error-main)' } },
        labels: {
          formatter: val => `${val?.toFixed(1)}%`,
          style: { fontSize: '13px', colors: 'var(--mui-palette-text-disabled)', fontFamily: 'Public Sans' }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: 'var(--mui-palette-text-secondary)' }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => (val != null ? `${val.toFixed(2)}x` : 'N/A') },
        { formatter: val => (val != null ? `${val.toFixed(2)}%` : 'N/A') },
        { formatter: val => (val != null ? `${val.toFixed(2)}%` : 'N/A') }
      ]
    }
  }

  return (
    <Card>
      <CardHeader
        title='ROAS / ACOS / TACOS Trend'
        subheader='Weekly efficiency metrics'
        action={<OptionMenu options={['Last 4 Weeks', 'Last 8 Weeks', 'All Time']} />}
      />
      <CardContent className='pbs-0'>
        <AppReactApexCharts type='line' height={280} width='100%' series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default ROASACOSTrendChart
