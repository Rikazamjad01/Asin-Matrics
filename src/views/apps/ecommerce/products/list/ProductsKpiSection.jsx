'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Data Import (Helpers)
import { getProductsKpiData } from '@/libs/products/productsMockData'

// Formatters
const fmtCurrency = val => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
const fmtNumber = val => val.toLocaleString('en-US')

const ProductsKpiSection = ({ dateRange }) => {
  const data = useMemo(() => getProductsKpiData(dateRange), [dateRange])

  const tiles = [
    {
      icon: 'bx-dollar-circle',
      color: 'primary',
      label: 'Total Revenue',
      value: fmtCurrency(data.totalRevenue.value),
      trend: data.totalRevenue.trend,
      percent: data.totalRevenue.percent
    },
    {
      icon: 'bx-wallet',
      color: 'success',
      label: 'Net Profit',
      value: fmtCurrency(data.netProfit.value),
      trend: data.netProfit.trend,
      percent: data.netProfit.percent
    },
    {
      icon: 'bx-line-chart',
      color: 'info',
      label: 'PPC ROI',
      value: `${data.ppcRoi.value}x`,
      trend: data.ppcRoi.trend,
      percent: data.ppcRoi.percent
    },
    {
      icon: 'bx-briefcase',
      color: 'warning',
      label: 'Portfolio',
      value: fmtNumber(data.portfolio.value),
      trend: data.portfolio.trend,
      percent: data.portfolio.percent
    },
    {
      icon: 'bx-target-lock',
      color: 'error',
      label: 'Avg ACoS',
      value: `${data.avgAcos.value}%`,
      trend: data.avgAcos.trend, // ACoS going down is good
      percent: data.avgAcos.percent,
      inverseTrendColor: true // Negative trend (down) should be green
    },
    {
      icon: 'bx-bullseye',
      color: 'secondary',
      label: 'Avg TACoS',
      value: `${data.avgTacos.value}%`,
      trend: data.avgTacos.trend,
      percent: data.avgTacos.percent,
      inverseTrendColor: true // TACoS going down is good
    },
    {
      icon: 'bx-cart',
      color: 'primary',
      label: 'Total Units Sold',
      value: fmtNumber(data.totalUnitsSold.value),
      trend: data.totalUnitsSold.trend,
      percent: data.totalUnitsSold.percent
    },
    {
      icon: 'bx-coin-stack',
      color: 'error',
      label: 'Avg COGS',
      value: fmtCurrency(data.avgCogs.value),
      trend: data.avgCogs.trend,
      percent: data.avgCogs.percent,
      inverseTrendColor: true // COGS going down is good
    }
  ]

  return (
    <Grid container spacing={4}>
      {tiles.map((tile, i) => {
        // Calculate dynamic trend color based on inverse flag (e.g. for ACoS where lower is better)
        let trendColor = 'text.secondary'
        let iconClass = ''

        if (tile.trend === 'positive') {
          trendColor = tile.inverseTrendColor ? 'error.main' : 'success.main'
          iconClass = 'bx-up-arrow-alt'
        } else if (tile.trend === 'negative') {
          trendColor = tile.inverseTrendColor ? 'success.main' : 'error.main'
          iconClass = 'bx-down-arrow-alt'
        }

        return (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box className='flex items-center gap-3 p-4 rounded bg-paper shadow-sm border border-divider'>
              <CustomAvatar size={46} variant='rounded' skin='light' color={tile.color}>
                <i className={`${tile.icon} text-2xl`} />
              </CustomAvatar>
              <div>
                <Typography variant='caption' color='text.secondary' className='font-medium uppercase tracking-wide'>
                  {tile.label}
                </Typography>
                <div className='flex items-center gap-2'>
                  <Typography variant='h5' className='font-bold leading-tight'>
                    {tile.value}
                  </Typography>
                  {tile.trend !== 'neutral' && (
                    <Typography variant='caption' color={trendColor} className='flex items-center font-bold'>
                      <i className={classnames('text-lg', iconClass)} />
                      {Math.abs(tile.percent)}%
                    </Typography>
                  )}
                </div>
              </div>
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ProductsKpiSection
