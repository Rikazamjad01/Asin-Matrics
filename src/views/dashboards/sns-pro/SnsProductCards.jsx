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

const SnsProductCards = ({ productData }) => {
  // Generate 6 mock cards taking the top elements from productData
  const mockCards = useMemo(() => {
    return (productData || []).slice(0, 6).map((p, index) => {
      const seed = p.id * 999
      const priceVal = parseFloat((p.price || '$0').replace(/[^0-9.-]+/g, '')) || 0

      const snsCustomers = 120 + Math.floor(Math.abs(Math.sin(seed) * 800))
      const monthlyEarning = snsCustomers * priceVal * 0.9
      const shareOfRevenue = (15 + Math.abs(Math.sin(seed + 1) * 35)).toFixed(1)
      const aov = monthlyEarning / snsCustomers
      const growth = (Math.sin(seed + 2) * 25).toFixed(1)

      return {
        ...p,
        rank: index + 1,
        snsCustomers,
        monthlyEarning,
        shareOfRevenue,
        aov,
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
                    S&S Performance
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
                {/* Customers Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Customers
                  </Typography>
                  <Typography variant='body2'>{product.snsCustomers.toLocaleString()}</Typography>
                </Box>

                {/* Earning Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Monthly Earning
                  </Typography>
                  <Typography variant='body2' color='text.primary' fontWeight={600}>
                    $
                    {product.monthlyEarning.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                </Box>

                {/* Shares of Revenue Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Share of S&S Revenue
                  </Typography>
                  <Typography variant='body2'>{product.shareOfRevenue}%</Typography>
                </Box>

                {/* AOV Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    AOV
                  </Typography>
                  <Typography variant='body2'>
                    ${product.aov.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Divider className='my-2' />

                {/* Growth Row */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Growth
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

export default SnsProductCards
