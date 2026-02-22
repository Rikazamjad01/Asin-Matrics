import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Custom Styled Component for Product Tile with Gradient
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

// Mock Data Generator
const generateProducts = (prefix, count) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    name: `${prefix} Product ${i + 1}`,
    units: Math.floor(Math.random() * 500) + 50,
    revenue: Math.floor(Math.random() * 10000) + 1000
  }))
}

const upcomingData = [
  {
    title: 'Next 30 Days',
    products: generateProducts('Fast', 5)
  },
  {
    title: '30-60 Days',
    products: generateProducts('Mid', 5)
  },
  {
    title: '60-90 Days',
    products: generateProducts('Long', 5)
  }
]

const formatCurrency = value => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const SnsUpcomingDeliveries = () => {
  return (
    <Grid container spacing={6}>
      {upcomingData.map((section, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <Card className='h-full'>
            <CardHeader
              title={section.title}
              action={<i className='bx-calendar text-primary text-2xl' />}
              className='pb-4'
            />
            <CardContent>
              {section.products.map(product => (
                <ProductTile key={product.id}>
                  <Box className='flex justify-between items-start mb-2'>
                    <Typography variant='subtitle1' fontWeight={600} noWrap className='mr-2'>
                      {product.name}
                    </Typography>
                    <Chip size='small' label={`${product.units} Units`} color='primary' variant='tonal' />
                  </Box>
                  <Box className='flex justify-between items-center'>
                    <Typography variant='body2' color='text.secondary'>
                      Expected Revenue:
                    </Typography>
                    <Typography variant='subtitle2' color='success.main' fontWeight={700}>
                      {formatCurrency(product.revenue)}
                    </Typography>
                  </Box>
                </ProductTile>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SnsUpcomingDeliveries
