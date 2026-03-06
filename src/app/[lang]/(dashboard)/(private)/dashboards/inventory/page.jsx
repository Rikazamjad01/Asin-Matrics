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
  const [syncingDetail, setSyncingDetail] = useState(false)
  const [syncingPlanning, setSyncingPlanning] = useState(false)

  const fetchInventory = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('fba_inventory_detail')
      .select('*')
      .order('afn_total_quantity', { ascending: false })

    if (!error && data) {
      setInventory(data)
    }

    setLoading(false)
  }

  const handleSyncDetail = async () => {
    setSyncingDetail(true)
    await supabase.functions.invoke('amazon-sp-api-sync', { body: { action: 'inventory_detail' } })
    await fetchInventory()
    setSyncingDetail(false)
  }

  const handleSyncPlanning = async () => {
    setSyncingPlanning(true)
    await supabase.functions.invoke('amazon-sp-api-sync', { body: { action: 'inventory_planning' } })
    setSyncingPlanning(false)
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // Compute KPI values based on the new fba_inventory_detail schema
  const totalStock = inventory.reduce((sum, item) => sum + (item.afn_total_quantity || 0), 0)
  const lowStockItems = inventory.filter(item => item.afn_total_quantity > 0 && item.afn_total_quantity <= 10).length
  const outOfStockItems = inventory.filter(item => item.afn_total_quantity === 0).length
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='outlined'
            onClick={handleSyncPlanning}
            disabled={syncingPlanning}
            startIcon={syncingPlanning ? <CircularProgress size={20} color='inherit' /> : <i className='bx-refresh' />}
          >
            {syncingPlanning ? 'Requesting Planning...' : 'Sync Planning'}
          </Button>
          <Button
            variant='contained'
            onClick={handleSyncDetail}
            disabled={syncingDetail}
            startIcon={syncingDetail ? <CircularProgress size={20} color='inherit' /> : <i className='bx-refresh' />}
          >
            {syncingDetail ? 'Requesting Detail...' : 'Sync Detail'}
          </Button>
        </Box>
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
            title='Detailed Inventory Items'
            subheader={`${totalAsins} products synced from Amazon Reports (FBA MYI)`}
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
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {[
                      'Product Name',
                      'ASIN',
                      'SKU',
                      'FN SKU',
                      'Condition',
                      'Reserved',
                      'Fulfillable',
                      'Total',
                      'Status'
                    ].map(header => (
                      <th
                        key={header}
                        style={{
                          textAlign: 'left',
                          padding: '16px',
                          borderBottom: '1px solid var(--mui-palette-divider)',
                          fontSize: '0.875rem',
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
                      <td style={{ padding: '16px', maxWidth: 250 }}>
                        <Typography variant='body1' className='font-medium' noWrap>
                          {item.product_name || '—'}
                        </Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body1' className='font-mono'>
                          {item.asin || '—'}
                        </Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body2'>{item.sku || '—'}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body2'>{item.fn_sku || '—'}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body2'>{item.product_condition || '—'}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body1'>{(item.afn_reserved_quantity || 0).toLocaleString()}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body1'>{(item.afn_fulfillable_quantity || 0).toLocaleString()}</Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Typography variant='body1' className='font-semibold'>
                          {(item.afn_total_quantity || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <Chip
                          label={
                            item.afn_total_quantity === 0
                              ? 'Out of Stock'
                              : item.afn_total_quantity <= 10
                                ? 'Low Stock'
                                : 'In Stock'
                          }
                          size='medium'
                          variant='tonal'
                          color={
                            item.afn_total_quantity === 0
                              ? 'error'
                              : item.afn_total_quantity <= 10
                                ? 'warning'
                                : 'success'
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
