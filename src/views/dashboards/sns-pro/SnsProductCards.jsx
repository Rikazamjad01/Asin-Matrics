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

const SnsProductCards = ({ inventoryData }) => {
  // Take top 6 products by total quantity (most stock = most important to track)
  const topProducts = useMemo(() => {
    return (inventoryData || [])
      .slice()
      .sort((a, b) => (b.total_quantity || 0) - (a.total_quantity || 0))
      .slice(0, 6)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }))
  }, [inventoryData])

  if (!topProducts.length) {
    return (
      <Box className='text-center py-10'>
        <i className='bx-package text-5xl text-textDisabled mb-3' />
        <Typography color='text.secondary'>No inventory data available. Sync FBA Inventory first.</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {topProducts.map(product => (
        <Grid size={{ xs: 12, md: 4 }} key={product.id}>
          <Card>
            <CardContent>
              {/* Header: Name + Rank Badge */}
              <Box className='flex items-start justify-between mb-1'>
                <Box>
                  <Typography variant='h5' className='truncate max-w-[200px]' title={product.product_name}>
                    {product.product_name
                      ? product.product_name.substring(0, 40) + (product.product_name.length > 40 ? '…' : '')
                      : '—'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    FBA Inventory
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
                {/* ASIN */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    ASIN
                  </Typography>
                  <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
                    {product.asin || '—'}
                  </Typography>
                </Box>

                {/* SKU */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Seller SKU
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {product.seller_sku || product.fn_sku || '—'}
                  </Typography>
                </Box>

                {/* Total Qty */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Total Qty
                  </Typography>
                  <Typography variant='body2' fontWeight={600}>
                    {(product.total_quantity || 0).toLocaleString()} units
                  </Typography>
                </Box>

                {/* Condition */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Condition
                  </Typography>
                  <Typography variant='body2'>{product.condition || '—'}</Typography>
                </Box>

                <Divider className='my-2' />

                {/* Rank indicator */}
                <Box className='flex justify-between items-center'>
                  <Typography variant='body1' fontWeight={500}>
                    Stock Rank
                  </Typography>
                  <Box className='flex items-center gap-1'>
                    <Typography variant='body2' fontWeight={600} color='primary.main'>
                      #{product.rank}
                    </Typography>
                    <i className='bx-bar-chart-alt-2 text-primary' style={{ fontSize: '1.2rem' }} />
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
