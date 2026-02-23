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

const ReviewsProductCards = ({ productData }) => {
  // Generate 6 mock cards taking the top elements from productData
  const mockCards = useMemo(() => {
    return (productData || []).slice(0, 6).map((p, index) => {
      const seed = p.id * 6666

      const totalReviews = 50 + Math.floor(Math.abs(Math.sin(seed) * 1500))
      const avgRating = (3.8 + Math.abs(Math.sin(seed + 1) * 1.2)).toFixed(1)
      const positiveSentiment = (75 + Math.abs(Math.sin(seed + 2) * 20)).toFixed(1)
      const negativeSentiment = (100 - parseFloat(positiveSentiment) - Math.abs(Math.sin(seed + 3) * 5)).toFixed(1)
      const growth = (Math.sin(seed + 4) * 18).toFixed(1)

      return {
        ...p,
        rank: index + 1,
        totalReviews,
        avgRating,
        positiveSentiment,
        negativeSentiment,
        growth: parseFloat(growth)
      }
    })
  }, [productData])

  return (
    <Grid container spacing={6}>
      {mockCards.map(product => (
        <Grid size={{ xs: 12, md: 4 }} key={product.id}>
          <Card>
            <CardContent>
              {/* Header: Name + Medals */}
              <Box className='flex items-start justify-between mb-1'>
                <Box>
                  <Typography variant='h5' className='truncate max-w-[200px]'>
                    {product.productName}
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
                    <i className='bx-bxs-star text-warning text-sm' />
                  </Box>
                </Box>

                {/* Total Reviews Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Total Reviews
                  </Typography>
                  <Typography variant='body2' color='text.primary' fontWeight={600}>
                    {product.totalReviews.toLocaleString()}
                  </Typography>
                </Box>

                {/* Sentiment Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Positive Sentiment
                  </Typography>
                  <Typography variant='body2' color='success.main'>
                    {product.positiveSentiment}%
                  </Typography>
                </Box>

                {/* Negative Sentiment Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Negative Sentiment
                  </Typography>
                  <Typography variant='body2' color='error.main'>
                    {product.negativeSentiment}%
                  </Typography>
                </Box>

                <Divider className='my-2' />

                {/* Growth Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Trend
                  </Typography>
                  <Box className='flex items-center gap-1'>
                    <Typography
                      variant='body2'
                      fontWeight={600}
                      color={product.growth >= 0 ? 'success.main' : 'error.main'}
                    >
                      {product.growth > 0 ? '+' : ''}
                      {product.growth}%
                    </Typography>
                    <i
                      className={product.growth >= 0 ? 'bx-trending-up text-success' : 'bx-trending-down text-error'}
                      style={{ fontSize: '1.2rem' }}
                    />
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
