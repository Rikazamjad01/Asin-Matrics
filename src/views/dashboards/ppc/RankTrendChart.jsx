'use client'

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

const RankTrendChart = ({ data, selectedKeyword }) => {
  const filtered = data
    .filter(r => r.keyword === selectedKeyword && r.marketplace === 'US')
    .sort((a, b) => a.date.localeCompare(b.date))

  const series = [{ name: `Rank: ${selectedKeyword}`, data: filtered.map(r => r.currentRank) }]

  const options = {
    chart: { parentHeightOffset: 0, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['var(--mui-palette-primary-main)'],
    markers: { size: 5 },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 6,
      padding: { top: 5, right: 6, bottom: 7 }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: filtered.map(r => r.date),
      labels: {
        style: { fontSize: '11px', colors: 'var(--mui-palette-text-disabled)', fontFamily: 'Public Sans' }
      }
    },
    yaxis: {
      reversed: true,
      title: { text: 'Rank (lower = better)' },
      labels: {
        formatter: val => `#${Math.round(val)}`,
        style: { fontSize: '13px', colors: 'var(--mui-palette-text-disabled)', fontFamily: 'Public Sans' }
      }
    },
    annotations: {
      yaxis: [
        {
          y: 10,
          borderColor: 'var(--mui-palette-success-main)',
          label: {
            text: 'Top 10',
            style: { color: 'var(--mui-palette-success-main)', background: 'transparent' }
          }
        }
      ]
    },
    tooltip: {
      y: { formatter: val => `Rank #${Math.round(val)}` }
    }
  }

  return (
    <Card>
      <CardHeader
        title={`Rank Trend — "${selectedKeyword}"`}
        subheader='US Marketplace · Organic rank over time (lower = better)'
        action={<OptionMenu options={['Last 4 Weeks', 'Last 8 Weeks', 'All Time']} />}
      />
      <CardContent className='pbs-0'>
        {filtered.length > 0 ? (
          <AppReactApexCharts type='line' height={260} width='100%' series={series} options={options} />
        ) : (
          <div className='flex items-center justify-center' style={{ height: 260 }}>
            <span className='text-textDisabled'>No historical data for this keyword</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RankTrendChart
