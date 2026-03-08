'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import { useRouter, useParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const InventoryPlanningSection = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('fba_inventory')
        .select('*')
        .order('total_quantity', { ascending: false })

      if (!error && data) {
        setInventory(data)
      }

      setLoading(false)
    }

    fetchInventory()
  }, [])

  // Compute KPI values from real data
  const totalStock = inventory.reduce((sum, item) => sum + (item.total_quantity || 0), 0)
  const outOfStock = inventory.filter(item => item.total_quantity === 0).length
  const lowStock = inventory.filter(item => item.total_quantity > 0 && item.total_quantity <= 10).length
  const totalAsins = inventory.length

  const tiles = [
    { icon: 'bx-package', color: 'primary', label: 'Total Stock', value: totalStock.toLocaleString() },
    { icon: 'bx-cube', color: 'info', label: 'Total ASINs', value: totalAsins },
    {
      icon: 'bx-error-circle',
      color: 'warning',
      label: 'Low Stock',
      value: lowStock
    },
    { icon: 'bx-x-circle', color: 'error', label: 'Out of Stock', value: outOfStock }
  ]

  // Items needing attention (out of stock or low stock)
  const alertItems = inventory.filter(item => item.total_quantity <= 10).slice(0, 4)

  return (
    <Card>
      <CardHeader
        title='Inventory Planning Snapshot'
        subheader='Real-time stock levels from Amazon FBA'
        action={
          <Chip
            label={`Last synced: ${inventory[0]?.synced_at ? new Date(inventory[0].synced_at).toLocaleTimeString() : '—'}`}
            size='small'
            variant='tonal'
            color='info'
          />
        }
      />
      <Divider />
      <CardContent>
        {loading ? (
          <Box className='flex justify-center items-center p-10'>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* KPI Tiles */}
            <Grid container spacing={4} className='mbe-5'>
              {tiles.map((tile, i) => (
                <Grid key={i} size={{ xs: 6, sm: 3 }}>
                  <Box className='flex items-center gap-3 p-3 rounded bg-actionHover'>
                    <CustomAvatar size={40} variant='rounded' skin='light' color={tile.color}>
                      <i className={`${tile.icon} text-lg`} />
                    </CustomAvatar>
                    <div>
                      <Typography variant='caption' color='text.disabled'>
                        {tile.label}
                      </Typography>
                      <Typography variant='h6' className='font-semibold leading-tight'>
                        {tile.value}
                      </Typography>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Inventory Alerts */}
            {alertItems.length > 0 && (
              <Box className='mbe-5'>
                <div className='flex items-center justify-between mbe-3'>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Inventory Alerts
                  </Typography>
                  <Button
                    variant='tonal'
                    color='warning'
                    size='small'
                    onClick={() => router.push(getLocalizedUrl('/dashboards/inventory', locale))}
                  >
                    View Details
                  </Button>
                </div>
                {alertItems.map((item, i) => (
                  <Box
                    key={i}
                    className='flex items-center gap-3 p-3 rounded mbe-2'
                    sx={{
                      bgcolor: item.total_quantity === 0 ? 'error.lightOpacity' : 'warning.lightOpacity'
                    }}
                  >
                    <i
                      className={`bx-${item.total_quantity === 0 ? 'error' : 'info-circle'} text-xl`}
                      style={{
                        color:
                          item.total_quantity === 0
                            ? 'var(--mui-palette-error-main)'
                            : 'var(--mui-palette-warning-main)'
                      }}
                    />
                    <div className='flex-1'>
                      <Typography variant='body2' className='font-medium'>
                        {item.product_name || item.asin}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.total_quantity === 0 ? 'Out of stock' : `Low stock: ${item.total_quantity} units`} •{' '}
                        {item.asin}
                      </Typography>
                    </div>
                    <Chip
                      label={`${item.total_quantity} units`}
                      size='small'
                      variant='tonal'
                      color={item.total_quantity === 0 ? 'error' : 'warning'}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Top Products by Stock */}
            <Typography variant='subtitle2' color='text.secondary' className='mbe-3'>
              Top Products by Stock
            </Typography>
            <Grid container spacing={3} className='mbe-5'>
              {inventory.slice(0, 6).map((item, i) => (
                <Grid key={i} size={{ xs: 12, sm: 4 }}>
                  <Box className='p-3 rounded bg-actionHover'>
                    <Typography variant='body2' className='font-medium' noWrap>
                      {item.product_name || 'Unknown Product'}
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                      {item.asin} • SKU: {item.seller_sku || '—'}
                    </Typography>
                    <div className='mbs-1'>
                      <Chip
                        label={`${(item.total_quantity || 0).toLocaleString()} units`}
                        size='small'
                        variant='tonal'
                        color={item.total_quantity === 0 ? 'error' : item.total_quantity <= 10 ? 'warning' : 'success'}
                      />
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Navigate Button */}
            <div className='flex justify-end'>
              <Button
                variant='contained'
                endIcon={<i className='bx-right-arrow-alt' />}
                onClick={() => router.push(getLocalizedUrl('/dashboards/inventory', locale))}
              >
                Go to Inventory Dashboard
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default InventoryPlanningSection
