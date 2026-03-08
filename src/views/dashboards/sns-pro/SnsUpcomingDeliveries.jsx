import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const ProductTile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(135deg, ${theme.palette.primary.lightOpacity} 0%, ${theme.palette.background.paper} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    marginBottom: 0
  }
}))

const formatCurrency = value =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)

const SnsUpcomingDeliveries = ({ metricsData }) => {
  const latest = metricsData?.[0] || {}

  const periods = [
    {
      title: 'Next 30 Days',
      units: latest.forecasted_shipped_subscription_units_30 || 0,
      revenue: latest.forecasted_shipped_subscription_revenue_30 || 0
    },
    {
      title: '30–60 Days',
      units: latest.forecasted_shipped_subscription_units_60 || 0,
      revenue: latest.forecasted_shipped_subscription_revenue_60 || 0
    },
    {
      title: '60–90 Days',
      units: latest.forecasted_shipped_subscription_units_90 || 0,
      revenue: latest.forecasted_shipped_subscription_revenue_90 || 0
    }
  ]

  const hasData = metricsData && metricsData.length > 0

  return (
    <Grid container spacing={6}>
      {periods.map((period, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <Card className='h-full'>
            <CardHeader
              title={period.title}
              action={<i className='bx-calendar text-primary text-2xl' />}
              className='pb-4'
            />
            <CardContent>
              {hasData ? (
                <ProductTile>
                  <Box className='flex justify-between items-start mb-2'>
                    <Typography variant='subtitle1' fontWeight={600}>
                      Subscription Orders
                    </Typography>
                    <Chip
                      size='small'
                      label={`${Number(period.units).toLocaleString()} Units`}
                      color='primary'
                      variant='tonal'
                    />
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' color='text.secondary'>
                      Expected Revenue:
                    </Typography>
                    <Typography variant='subtitle2' color='success.main' fontWeight={700}>
                      {formatCurrency(period.revenue)}
                    </Typography>
                  </Box>
                </ProductTile>
              ) : (
                <Box className='text-center py-6'>
                  <i className='bx-calendar-x text-4xl text-textDisabled' />
                  <Typography color='text.secondary' variant='body2' className='mt-2'>
                    No forecast data yet. Sync S&S Metrics.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SnsUpcomingDeliveries
