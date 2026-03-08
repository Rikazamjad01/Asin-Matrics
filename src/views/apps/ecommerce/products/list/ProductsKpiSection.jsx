'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const ProductsKpiSection = ({ inventoryData, financesData }) => {
  const stats = useMemo(() => {
    const rows = inventoryData || []
    const finances = financesData || []

    // Real computable values from fba_inventory
    const totalUnits = rows.reduce((sum, r) => sum + (r.total_quantity || 0), 0)
    const portfolio = new Set(rows.map(r => r.asin).filter(Boolean)).size

    // Calculate aggregated financial metrics
    let totalRevenue = 0
    let totalFees = 0

    finances.forEach(f => {
      totalRevenue += Number(f.revenue) || 0
      totalFees += Math.abs(Number(f.fees) || 0)
    })

    const netProfit = totalRevenue - totalFees

    return { totalUnits, portfolio, totalRevenue, netProfit }
  }, [inventoryData, financesData])

  const tiles = [
    {
      icon: 'bx-dollar-circle',
      color: 'primary',
      label: 'Total Revenue',
      value: financesData
        ? `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '—',
      trend: 'neutral',
      percent: 0
    },
    {
      icon: 'bx-wallet',
      color: 'success',
      label: 'Net Profit',
      value: financesData
        ? `$${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '—',
      trend: 'neutral',
      percent: 0
    },
    {
      icon: 'bx-line-chart',
      color: 'info',
      label: 'PPC ROI',
      value: '—',
      trend: 'neutral',
      percent: 0
    },
    {
      icon: 'bx-briefcase',
      color: 'warning',
      label: 'Portfolio',
      value: stats.portfolio > 0 ? stats.portfolio.toLocaleString() : inventoryData ? '0' : '—',
      trend: 'neutral',
      percent: 0
    },
    {
      icon: 'bx-target-lock',
      color: 'error',
      label: 'Avg ACoS',
      value: '—',
      trend: 'neutral',
      percent: 0,
      inverseTrendColor: true
    },
    {
      icon: 'bx-bullseye',
      color: 'secondary',
      label: 'Avg TACoS',
      value: '—',
      trend: 'neutral',
      percent: 0,
      inverseTrendColor: true
    },
    {
      icon: 'bx-cart',
      color: 'primary',
      label: 'Total Units',
      value: stats.totalUnits > 0 ? stats.totalUnits.toLocaleString() : inventoryData ? '0' : '—',
      trend: 'neutral',
      percent: 0
    },
    {
      icon: 'bx-coin-stack',
      color: 'error',
      label: 'Avg COGS',
      value: '—',
      trend: 'neutral',
      percent: 0,
      inverseTrendColor: true
    }
  ]

  return (
    <Grid container spacing={4}>
      {tiles.map((tile, i) => {
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
