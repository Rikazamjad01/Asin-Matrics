'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import Vertical from '@components/card-statistics/Vertical'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const DashboardInventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

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

  const handleSync = async () => {
    setSyncing(true)

    await supabase.functions.invoke('amazon-sp-api-sync', {
      body: { action: 'inventory' }
    })

    await fetchInventory()
    setSyncing(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // Compute KPI values
  const totalStock = inventory.reduce((sum, item) => sum + (item.total_quantity || 0), 0)
  const lowStockItems = inventory.filter(item => item.total_quantity > 0 && item.total_quantity <= 10).length
  const outOfStockItems = inventory.filter(item => item.total_quantity === 0).length
  const totalAsins = inventory.length

  if (loading) {
    return (
      <Box className='flex justify-center items-center p-20'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Sync Button Row */}
      <Grid size={{ xs: 12 }} className='flex justify-between items-center'>
        <Typography variant='h5'>Inventory Dashboard</Typography>
        <Button variant='contained' onClick={handleSync} disabled={syncing} startIcon={<i className='bx-refresh' />}>
          {syncing ? 'Syncing...' : 'Sync from Amazon'}
        </Button>
      </Grid>

      {/* Stock Level KPIs */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Total Stock'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats={totalStock.toLocaleString()}
          trendNumber={totalAsins}
          trend='positive'
          subtitle={`${totalAsins} ASINs tracked`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Low Stock Items'
          imageSrc='/images/cards/paypal-error-bg.png'
          stats={String(lowStockItems)}
          trendNumber={lowStockItems}
          trend={lowStockItems > 0 ? 'negative' : 'positive'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Out of Stock'
          imageSrc='/images/cards/cube-secondary-bg.png'
          stats={String(outOfStockItems)}
          trendNumber={outOfStockItems}
          trend={outOfStockItems > 0 ? 'negative' : 'positive'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Total ASINs'
          imageSrc='/images/cards/credit-card-primary-bg.png'
          stats={String(totalAsins)}
          trendNumber={totalAsins}
          trend='positive'
        />
      </Grid>

      {/* Inventory Table */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title='All Inventory Items'
            subheader={`${totalAsins} products synced from Amazon FBA`}
            action={
              <Chip
                label={`Last synced: ${inventory[0]?.synced_at ? new Date(inventory[0].synced_at).toLocaleString() : '—'}`}
                size='small'
                variant='tonal'
                color='info'
              />
            }
          />
          <Divider />
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Product Name', 'ASIN', 'SKU', 'FN SKU', 'Condition', 'Quantity', 'Status'].map(header => (
                      <th
                        key={header}
                        style={{
                          textAlign: 'left',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--mui-palette-divider)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: 'var(--mui-palette-text-disabled)'
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--mui-palette-divider)' }}>
                      <td style={{ padding: '12px 16px', maxWidth: 250 }}>
                        <Typography variant='body2' className='font-medium' noWrap>
                          {item.product_name || '—'}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Typography variant='body2' className='font-mono'>
                          {item.asin}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Typography variant='caption'>{item.seller_sku || '—'}</Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Typography variant='caption'>{item.fn_sku || '—'}</Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Typography variant='caption'>{item.condition || '—'}</Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Typography variant='body2' className='font-semibold'>
                          {(item.total_quantity || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Chip
                          label={
                            item.total_quantity === 0
                              ? 'Out of Stock'
                              : item.total_quantity <= 10
                                ? 'Low Stock'
                                : 'In Stock'
                          }
                          size='small'
                          variant='tonal'
                          color={
                            item.total_quantity === 0 ? 'error' : item.total_quantity <= 10 ? 'warning' : 'success'
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardInventory
