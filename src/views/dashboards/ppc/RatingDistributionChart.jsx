'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const starColors = {
  5: 'var(--mui-palette-success-main)',
  4: '#66BB6A',
  3: 'var(--mui-palette-warning-main)',
  2: 'var(--mui-palette-error-light)',
  1: 'var(--mui-palette-error-main)'
}

const starMuiColors = {
  5: 'success',
  4: 'success',
  3: 'warning',
  2: 'error',
  1: 'error'
}

const RatingDistributionChart = ({ starBreakdown }) => {
  const theme = useTheme()

  const total = Object.values(starBreakdown).reduce((a, b) => a + b, 0)
  const stars = [5, 4, 3, 2, 1]

  // Weighted average rating
  const weightedSum = stars.reduce((acc, s) => acc + s * (starBreakdown[s] || 0), 0)
  const avgRating = (weightedSum / total).toFixed(1)

  // Radial bar for avg rating
  const radialSeries = [parseFloat(((weightedSum / total / 5) * 100).toFixed(1))]

  const radialOptions = {
    chart: { sparkline: { enabled: true } },
    labels: ['Avg Rating'],
    stroke: { dashArray: 5 },
    colors: ['var(--mui-palette-warning-main)'],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: { padding: { top: -20, bottom: -18, left: 15, right: 15 } },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.6,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: ['var(--mui-palette-warning-main)']
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 150,
        startAngle: -140,
        hollow: { size: '55%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: 30,
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--mui-palette-text-secondary)',
            fontFamily: theme.typography.fontFamily
          },
          value: {
            offsetY: -10,
            fontWeight: 600,
            fontSize: '28px',
            formatter: () => `${avgRating}★`,
            color: 'var(--mui-palette-text-primary)',
            fontFamily: theme.typography.fontFamily
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Rating Distribution'
        subheader={`${total.toLocaleString()} total reviews`}
        action={<OptionMenu options={['This Month', 'Last Month', 'All Time']} />}
      />
      <CardContent>
        <Grid container spacing={4} alignItems='center'>
          {/* Radial Chart */}
          <Grid size={{ xs: 12, sm: 5 }} className='flex flex-col items-center'>
            <AppReactApexCharts
              type='radialBar'
              height={220}
              width='100%'
              series={radialSeries}
              options={radialOptions}
            />
            <div className='flex items-center gap-1 -mt-2'>
              {[1, 2, 3, 4, 5].map(s => (
                <i
                  key={s}
                  className={parseFloat(avgRating) >= s ? 'bxs-star' : 'bx-star'}
                  style={{
                    color:
                      parseFloat(avgRating) >= s
                        ? 'var(--mui-palette-warning-main)'
                        : 'var(--mui-palette-text-disabled)',
                    fontSize: '1.1rem'
                  }}
                />
              ))}
            </div>
            <Typography variant='body2' color='text.secondary' className='mt-1'>
              out of 5.0
            </Typography>
          </Grid>

          {/* Star Breakdown Bars */}
          <Grid size={{ xs: 12, sm: 7 }}>
            <div className='flex flex-col gap-y-3'>
              {stars.map(star => {
                const count = starBreakdown[star] || 0
                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0

                return (
                  <div key={star} className='flex items-center gap-x-3'>
                    {/* Star label */}
                    <div className='flex items-center gap-1 min-w-[52px]'>
                      <Typography variant='body2' className='font-medium' color='text.primary'>
                        {star}
                      </Typography>
                      <i className='bxs-star' style={{ color: starColors[star], fontSize: '0.9rem' }} />
                    </div>

                    {/* Progress bar */}
                    <LinearProgress
                      variant='determinate'
                      value={parseFloat(pct)}
                      sx={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'var(--mui-palette-action-hover)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: starColors[star]
                        }
                      }}
                    />

                    {/* Count + percent */}
                    <div className='flex flex-col items-end min-w-[60px]'>
                      <Typography variant='body2' className='font-medium' color='text.primary'>
                        {count.toLocaleString()}
                      </Typography>
                      <Typography variant='caption' color='text.disabled'>
                        {pct}%
                      </Typography>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Positive vs Critical summary */}
            <div className='flex gap-x-4 mt-5 pt-4 border-t border-divider'>
              <div className='flex items-center gap-x-2'>
                <CustomAvatar size={32} variant='rounded' skin='light' color='success'>
                  <i className='bx-like text-sm' />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.disabled'>
                    Positive (4–5★)
                  </Typography>
                  <Typography variant='body2' className='font-medium'>
                    {(((starBreakdown[5] + starBreakdown[4]) / total) * 100).toFixed(1)}%
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-x-2'>
                <CustomAvatar size={32} variant='rounded' skin='light' color='error'>
                  <i className='bx-dislike text-sm' />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.disabled'>
                    Critical (1–2★)
                  </Typography>
                  <Typography variant='body2' className='font-medium'>
                    {(((starBreakdown[1] + starBreakdown[2]) / total) * 100).toFixed(1)}%
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default RatingDistributionChart
