// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const kpiData = [
  {
    title: 'Total S&S Customers',
    value: '14,285',
    trend: '+12.4%',
    trendColor: 'success.main',
    comparison: 'vs last period',
    icon: 'bx-group',
    color: 'primary'
  },
  {
    title: 'S&S Revenue (Monthly)',
    value: '$124,500',
    trend: '+8.2%',
    trendColor: 'success.main',
    comparison: 'vs last month',
    icon: 'bx-dollar-circle',
    color: 'success'
  },
  {
    title: '% of Total Revenue',
    value: '38.5%',
    trend: '+2.1%',
    trendColor: 'success.main',
    comparison: 'vs last month',
    icon: 'bx-pie-chart-alt-2',
    color: 'warning'
  },
  {
    title: 'Avg. Lifetime Value',
    value: '$850.00',
    trend: '-1.5%',
    trendColor: 'error.main',
    comparison: 'vs last quarter',
    icon: 'bx-line-chart',
    color: 'info'
  },
  {
    title: 'Weekly Growth',
    value: '350',
    trend: '+45',
    trendColor: 'success.main',
    comparison: 'New customers vs last week',
    icon: 'bx-trending-up',
    color: 'secondary'
  }
]

const SnsKpiCards = ({ dateRange }) => {
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
