'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Calculation Engine
import { aggregateWeeks, fmt } from '@/libs/ppc/calculationEngine'

const KPICard = ({
  title,
  subtitle,
  value,
  improvement,
  improvementLabel,
  icon,
  color = 'primary',
  invertImprovement = false
}) => {
  const isPositive = improvement >= 0
  // For ACOS/TACOS: lower is better, so invert the color logic
  const isGood = invertImprovement ? !isPositive : isPositive
  const chipColor = improvement == null ? 'default' : isGood ? 'success' : 'error'
  const chipLabel = improvement == null ? 'N/A' : fmt.improvement(improvement)

  return (
    <Card sx={{ height: '100%', borderTop: `3px solid`, borderColor: `${color}.main` }}>
      <CardContent sx={{ p: 3 }}>
        <div className='flex items-start justify-between mb-3'>
          <div>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant='caption' color='text.disabled' display='block'>
                {subtitle}
              </Typography>
            )}
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `var(--mui-palette-${color}-lightOpacity, rgba(var(--mui-palette-${color}-mainChannel) / 0.12))`
            }}
          >
            <i className={`${icon} text-xl`} style={{ color: `var(--mui-palette-${color}-main)` }} />
          </div>
        </div>

        <Typography variant='h4' fontWeight={700} sx={{ mb: 1 }}>
          {value}
        </Typography>

        <div className='flex items-center gap-2'>
          {improvement !== undefined && (
            <Chip label={chipLabel} color={chipColor} size='small' sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
          )}
          {improvementLabel && (
            <Typography variant='caption' color='text.secondary'>
              {improvementLabel}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const DashboardKPICards = ({ weeks }) => {
  const agg = useMemo(() => aggregateWeeks(weeks), [weeks])

  if (!agg) return null

  const cards = [
    {
      title: 'Total Sales',
      subtitle: 'All channels',
      value: fmt.currency(agg.totalSales),
      icon: 'bx-dollar-circle',
      color: 'primary',
      improvement: null
    },
    {
      title: 'Total Orders',
      subtitle: 'All channels',
      value: fmt.number(agg.totalOrders),
      icon: 'bx-package',
      color: 'success',
      improvement: null
    },
    {
      title: 'Total Ad Spend',
      subtitle: 'SP + SB + SD',
      value: fmt.currency(agg.adSpend),
      icon: 'bx-trending-up',
      color: 'warning',
      improvement: null,
      invertImprovement: true
    },
    {
      title: 'ROAS',
      subtitle: 'Return on Ad Spend',
      value: fmt.roas(agg.roas),
      icon: 'bx-bar-chart-alt-2',
      color: 'info',
      improvement: null
    },
    {
      title: 'ACOS',
      subtitle: 'Advertising Cost of Sales',
      value: fmt.percent(agg.acos),
      icon: 'bx-pie-chart-alt',
      color: 'error',
      improvement: null,
      invertImprovement: true
    },
    {
      title: 'TACOS',
      subtitle: 'Total Advertising Cost of Sales',
      value: fmt.percent(agg.tacos),
      icon: 'bx-receipt',
      color: 'secondary',
      improvement: null,
      invertImprovement: true
    },
    {
      title: 'Conversion Rate',
      subtitle: 'Orders / Sessions',
      value: fmt.percent(agg.conversionRate),
      icon: 'bx-transfer',
      color: 'primary',
      improvement: null
    }
  ]

  return (
    <Grid container spacing={4}>
      {cards.map((card, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <KPICard {...card} improvementLabel='vs prev period' />
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardKPICards
