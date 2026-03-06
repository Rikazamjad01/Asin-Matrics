// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const SnsKpiCards = ({ metricsData }) => {
  const latest = metricsData?.[0] || {}

  // Map API fields to KPIs — unmapped ones stay 0
  const activeSubs = latest.active_subscriptions || 0
  const monthlyRevenue = latest.total_subscriptions_revenue || 0
  const avgLifetimeValue = latest.subscriber_avg_revenue || 0

  const kpiData = [
    {
      title: 'Total S&S Customers',
      value: activeSubs.toLocaleString(),
      trend: '—',
      trendColor: 'text.secondary',
      comparison: 'active subscriptions',
      icon: 'bx-group',
      color: 'primary'
    },
    {
      title: 'S&S Revenue (Monthly)',
      value: `$${Number(monthlyRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '—',
      trendColor: 'text.secondary',
      comparison: 'total subscriptions revenue',
      icon: 'bx-dollar-circle',
      color: 'success'
    },
    {
      title: '% of Total Revenue',
      value: '—',
      trend: '—',
      trendColor: 'text.secondary',
      comparison: 'not available from API',
      icon: 'bx-pie-chart-alt-2',
      color: 'warning'
    },
    {
      title: 'Avg. Lifetime Value',
      value:
        avgLifetimeValue > 0
          ? `$${Number(avgLifetimeValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '—',
      trend: '—',
      trendColor: 'text.secondary',
      comparison: 'subscriber avg revenue',
      icon: 'bx-line-chart',
      color: 'info'
    },
    {
      title: 'Weekly Growth',
      value: '—',
      trend: '—',
      trendColor: 'text.secondary',
      comparison: 'not available from API',
      icon: 'bx-trending-up',
      color: 'secondary'
    }
  ]

  return (
    <Grid container spacing={6}>
      {kpiData.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
          <Card>
            <CardContent>
              <div className='flex items-center justify-between'>
                <Typography variant='body2'>{item.title}</Typography>
                <CustomAvatar variant='rounded' skin='light' color={item.color} size={38}>
                  <i className={item.icon} />
                </CustomAvatar>
              </div>
              <div className='flex flex-col gap-1 mt-4'>
                <Typography variant='h4'>{item.value}</Typography>
                <div className='flex flex-wrap items-center gap-2'>
                  <Typography variant='body2' sx={{ color: item.trendColor, fontWeight: 500 }}>
                    {item.trend}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {item.comparison}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SnsKpiCards
