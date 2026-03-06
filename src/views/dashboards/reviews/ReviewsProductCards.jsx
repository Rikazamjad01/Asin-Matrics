// React Imports
import { useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const ReviewsProductCards = ({ inventoryData }) => {
  // Generate 6 mock cards taking the top elements from inventoryData (sorted by total_quantity)
  const topProducts = useMemo(() => {
    return (inventoryData || []).slice(0, 6).map((p, index) => {
      return {
        ...p,
        rank: index + 1,

        // Mock data removed since no real API exists yet for these metrics
        totalReviews: '—',
        avgRating: '—',
        positiveSentiment: '—',
        negativeSentiment: '—',
        growth: 0
      }
    })
  }, [inventoryData])

  return (
    <Grid container spacing={6}>
      {topProducts.map(product => (
        <Grid size={{ xs: 12, md: 4 }} key={product.asin}>
          <Card>
            <CardContent>
              {/* Header: Name + Medals */}
              <Box className='flex items-start justify-between mb-1'>
                <Box>
                  <Typography variant='h5' className='truncate max-w-[200px]' title={product.product_name}>
                    {product.product_name || product.asin}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Reviews Performance
                  </Typography>
                </Box>
                <CustomAvatar
                  skin='light'
                  color={product.rank === 1 ? 'warning' : product.rank === 2 ? 'secondary' : 'error'}
                  size={34}
                >
                  <i className={product.rank === 1 ? 'bx-trophy' : product.rank === 2 ? 'bx-medal' : 'bx-award'} />
                </CustomAvatar>
              </Box>

              <Box className='flex flex-col gap-3 mt-6'>
                {/* Rating Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Average Rating
                  </Typography>
                  <Box className='flex items-center gap-1'>
                    <Typography variant='body2' fontWeight={600}>
                      {product.avgRating}
                    </Typography>
                    <i className='bx-bx-star text-secondary text-sm' />
                  </Box>
                </Box>

                {/* Total Reviews Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Total Reviews
                  </Typography>
                  <Typography variant='body2' color='text.primary' fontWeight={600}>
                    {product.totalReviews}
                  </Typography>
                </Box>

                {/* Sentiment Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Positive Sentiment
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {product.positiveSentiment}
                  </Typography>
                </Box>

                {/* Negative Sentiment Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Negative Sentiment
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {product.negativeSentiment}
                  </Typography>
                </Box>

                <Divider className='my-2' />

                {/* Growth Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Trend
                  </Typography>
                  <Box className='flex items-center gap-1'>
                    <Typography variant='body2' fontWeight={600} color='text.secondary'>
                      —
                    </Typography>
                    <i className='bx-minus text-secondary' style={{ fontSize: '1.2rem' }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ReviewsProductCards
