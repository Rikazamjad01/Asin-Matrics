'use client'

import { useState, useMemo } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import SectionFilter from './SectionFilter'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Mock Data
import { getGeoRankData } from '@/libs/overview/overviewMockData'

const GeoRankTrackerSection = () => {
  const theme = useTheme()
  const [product, setProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  const data = useMemo(() => getGeoRankData(product, dateRange), [product, dateRange])

  // Heat map chart options — polished with reverse color scale (lower rank = better = greener)
  const heatMapOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily
    },
    dataLabels: {
      enabled: true,
      formatter: val => `#${val}`,
      style: {
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: theme.typography.fontFamily,
        colors: ['#fff']
      }
    },
    stroke: { width: 3, colors: [theme.palette.background.paper] },
    plotOptions: {
      heatmap: {
        radius: 6,
        enableShades: false,
        colorScale: {
          inverse: false,
          ranges: [
            { from: 1, to: 3, name: 'Top 3', color: '#4CAF50' },
            { from: 4, to: 10, name: 'Top 10', color: '#66BB6A' },
            { from: 11, to: 25, name: 'Top 25', color: '#FFA726' },
            { from: 26, to: 50, name: 'Top 50', color: '#EF5350' },
            { from: 51, to: 100, name: '51+', color: '#B71C1C' }
          ]
        }
      }
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '11px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: 'var(--mui-palette-text-secondary)',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      markers: { radius: 4 },
      itemMargin: { horizontal: 10, vertical: 4 }
    },
    tooltip: {
      y: { formatter: val => `Rank #${val}` }
    },
    grid: {
      padding: { top: -10, bottom: 0 }
    }
  }

  const keywordTiles = [
    {
      icon: 'bx-trophy',
      color: 'success',
      label: 'Top 3 Keywords',
      value: data.topKeywords.top3.count,
      trend: data.topKeywords.top3.trend,
      percent: data.topKeywords.top3.percent
    },
    {
      icon: 'bx-bar-chart',
      color: 'info',
      label: 'Top 10 Keywords',
      value: data.topKeywords.top10.count,
      trend: data.topKeywords.top10.trend,
      percent: data.topKeywords.top10.percent
    },
    {
      icon: 'bx-list-ol',
      color: 'warning',
      label: 'Top 100 Keywords',
      value: data.topKeywords.top100.count,
      trend: data.topKeywords.top100.trend,
      percent: data.topKeywords.top100.percent
    },
    {
      icon: 'bx-star',
      color: 'primary',
      label: 'Best Keyword',
      value: data.bestPerformingKeyword.keyword,
      sub: `Rank #${data.bestPerformingKeyword.rank}`,
      chipLabel: `+${data.bestPerformingKeyword.change}`,
      chipColor: 'success'
    },
    {
      icon: 'bx-transfer-alt',
      color: 'secondary',
      label: 'Keyword Movement',
      value: `${data.keywordMovement.improved} ↑`,
      sub: `${data.keywordMovement.declined} ↓ · ${data.keywordMovement.unchanged} ―`
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Geo Rank Tracker Summary'
        subheader='Keyword ranking performance across geo locations'
        action={
          <SectionFilter
            product={product}
            onProductChange={setProduct}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        }
      />
      <Divider />
      <CardContent>
        {/* KPI Tiles */}
        <Grid container spacing={4} className='mbe-5'>
          {keywordTiles.map((tile, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box className='flex items-center gap-3 p-3 rounded bg-actionHover' sx={{ minHeight: 80 }}>
                <CustomAvatar size={40} variant='rounded' skin='light' color={tile.color}>
                  <i className={`${tile.icon} text-lg`} />
                </CustomAvatar>
                <div className='flex-1 min-w-0'>
                  <Typography variant='caption' color='text.disabled'>
                    {tile.label}
                  </Typography>
                  <div className='flex items-center gap-1.5'>
                    <Typography variant='h6' className='font-semibold leading-tight' noWrap>
                      {tile.value}
                    </Typography>
                    {/* Trend arrow + percent for keyword count tiles */}
                    {tile.trend && (
                      <Typography
                        variant='caption'
                        color={tile.trend === 'positive' ? 'success.main' : 'error.main'}
                        className='flex items-center gap-0.5 font-medium'
                      >
                        <i
                          className={classnames(
                            'text-base',
                            tile.trend === 'positive' ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'
                          )}
                        />
                        {tile.percent}%
                      </Typography>
                    )}
                    {/* Chip for best keyword */}
                    {tile.chipLabel && (
                      <Chip
                        label={tile.chipLabel}
                        size='small'
                        variant='tonal'
                        color={tile.chipColor}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </div>
                  {tile.sub && (
                    <Typography variant='caption' color='text.secondary'>
                      {tile.sub}
                    </Typography>
                  )}
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Heat Map Chart */}
        <Typography variant='subtitle1' className='font-semibold mbe-1'>
          Geo Ranking Heat Map
        </Typography>
        <Typography variant='body2' color='text.disabled' className='mbe-3'>
          Keyword rank by city — lower is better
        </Typography>
        <AppReactApexCharts
          type='heatmap'
          height={340}
          width='100%'
          series={data.heatMapSeries}
          options={heatMapOptions}
        />
      </CardContent>
    </Card>
  )
}

export default GeoRankTrackerSection
