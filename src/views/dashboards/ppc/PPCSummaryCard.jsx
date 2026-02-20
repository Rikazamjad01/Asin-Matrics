'use client'

// React Imports
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
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Filter + Calculation
import { getWeeksForPreset, DATE_RANGE_PRESETS } from '@/libs/ppc/filterService'
import { aggregateWeeks, fmt } from '@/libs/ppc/calculationEngine'

const PPCSummaryCard = () => {
  const theme = useTheme()
  const [preset, setPreset] = useState('last8')

  const weeks = useMemo(() => getWeeksForPreset(preset), [preset])
  const agg = useMemo(() => aggregateWeeks(weeks), [weeks])

  // Build chart data from filtered weeks
  const categories = weeks.map(w => w.weekRange)
  const adSalesData = weeks.map(w => parseFloat(w.adSales.toFixed(2)))
  const adSpendData = weeks.map(w => parseFloat(w.adSpend.toFixed(2)))

  const roasData = weeks.map(w => {
    const r = w.adSpend > 0 ? w.adSales / w.adSpend : 0

    return parseFloat(r.toFixed(2))
  })

  // Profit (Ad Sales - Ad Spend)
  const profitData = weeks.map(w => parseFloat((w.adSales - w.adSpend).toFixed(2)))

  const menuOptions = DATE_RANGE_PRESETS.map(p => ({
    text: p.label,
    menuItemProps: { onClick: () => setPreset(p.value) }
  }))

  const series = [
    { name: 'Ad Sales', type: 'area', data: adSalesData },
    { name: 'Ad Spend', type: 'bar', data: adSpendData },
    { name: 'Ad Profit', type: 'area', data: profitData },
    { name: 'ROAS', type: 'line', data: roasData }
  ]

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      stacked: false
    },
    dataLabels: { enabled: false },
    stroke: {
      width: [2, 0, 2, 3],
      curve: 'smooth',
      dashArray: [0, 0, 6, 0]
    },
    colors: [
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-warning-main)',
      'var(--mui-palette-success-main)',
      'var(--mui-palette-error-main)'
    ],
    fill: {
      type: ['gradient', 'solid', 'gradient', 'solid'],
      opacity: [0.7, 0.85, 0.5, 1],
      gradient: {
        shadeIntensity: 0.6,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '45%'
      }
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 6,
      padding: { top: 5, right: 8, bottom: 7, left: 8 }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories,
      labels: {
        rotate: -30,
        style: {
          fontSize: '11px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: [
      {
        seriesName: 'Ad Sales',
        title: {
          text: 'Revenue ($)',
          style: { color: 'var(--mui-palette-primary-main)', fontFamily: theme.typography.fontFamily }
        },
        labels: {
          formatter: val => `$${(val / 1000).toFixed(0)}k`,
          style: {
            fontSize: '12px',
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily
          }
        }
      },
      {
        seriesName: 'Ad Spend',
        show: false
      },
      {
        seriesName: 'Ad Profit',
        show: false
      },
      {
        seriesName: 'ROAS',
        opposite: true,
        title: {
          text: 'ROAS (x)',
          style: { color: 'var(--mui-palette-error-main)', fontFamily: theme.typography.fontFamily }
        },
        labels: {
          formatter: val => `${val?.toFixed(1)}x`,
          style: {
            fontSize: '12px',
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily
          }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -4,
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      itemMargin: { horizontal: 9 }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => fmt.currency(val) },
        { formatter: val => fmt.currency(val) },
        { formatter: val => fmt.currency(val) },
        { formatter: val => `${val?.toFixed(2)}x` }
      ]
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    markers: {
      size: [0, 0, 0, 5],
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      strokeColors: 'var(--mui-palette-background-paper)',
      colors: ['var(--mui-palette-error-main)']
    }
  }

  // KPI stat items for the right panel
  const statItems = agg
    ? [
        {
          icon: 'bx-dollar-circle',
          color: 'primary',
          label: 'Ad Sales',
          value: fmt.currency(agg.adSales),
          sub: `${fmt.number(agg.adOrders)} ad orders`
        },
        {
          icon: 'bx-trending-up',
          color: 'warning',
          label: 'Ad Spend',
          value: fmt.currency(agg.adSpend),
          sub: `${fmt.number(agg.adClicks)} clicks`
        },
        {
          icon: 'bx-bar-chart-alt-2',
          color: 'success',
          label: 'Ad Profit',
          value: fmt.currency(agg.adSales - agg.adSpend),
          sub: `${fmt.percent(agg.acos)} ACOS`
        },
        {
          icon: 'bx-rocket',
          color: 'error',
          label: 'ROAS',
          value: fmt.roas(agg.roas),
          sub: `${fmt.percent(agg.tacos)} TACOS`
        }
      ]
    : []

  const presetLabel = DATE_RANGE_PRESETS.find(p => p.value === preset)?.label || 'Last 8 Weeks'

  return (
    <Card>
      <Grid container>
        {/* Chart Section */}
        <Grid size={{ xs: 12, md: 8 }} className='max-md:border-be md:border-ie'>
          <CardHeader
            title='Ad Sales vs Ad Spend'
            subheader={
              <span>
                Weekly advertising performance ·{' '}
                <Chip label={presetLabel} size='small' variant='tonal' color='primary' sx={{ fontSize: '0.7rem' }} />
              </span>
            }
            action={<OptionMenu options={menuOptions} />}
          />
          <CardContent className='pbs-0'>
            <AppReactApexCharts type='line' height={320} width='100%' series={series} options={options} />
          </CardContent>
        </Grid>

        {/* KPI Summary Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CardHeader
            title='Period Summary'
            subheader={`${weeks.length} week${weeks.length !== 1 ? 's' : ''} · ${weeks[0]?.weekRange ?? ''} – ${weeks[weeks.length - 1]?.weekRange ?? ''}`}
          />
          <CardContent className='flex flex-col gap-y-3'>
            {statItems.map((item, idx) => (
              <div key={idx} className='plb-3 pli-4 flex items-center gap-x-4 bg-actionHover rounded'>
                <CustomAvatar size={40} variant='rounded' skin='light' color={item.color}>
                  <i className={`${item.icon} text-lg`} />
                </CustomAvatar>
                <div className='flex-1 min-w-0'>
                  <Typography color='text.disabled' variant='body2'>
                    {item.label}
                  </Typography>
                  <Typography variant='h6' className='font-medium leading-tight'>
                    {item.value}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {item.sub}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default PPCSummaryCard
