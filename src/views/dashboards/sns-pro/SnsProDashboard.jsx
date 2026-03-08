'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import SnsFilterOptions from '@/views/dashboards/sns-pro/SnsFilterOptions'
import SnsKpiCards from '@/views/dashboards/sns-pro/SnsKpiCards'
import SnsTabsAndTables from '@/views/dashboards/sns-pro/SnsTabsAndTables'
import SnsProductCards from '@/views/dashboards/sns-pro/SnsProductCards'
import SnsUpcomingDeliveries from '@/views/dashboards/sns-pro/SnsUpcomingDeliveries'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const SnsProDashboard = ({ productData }) => {
  // State for filter
  const [dateRange, setDateRange] = useState('monthly')
  const [customDate, setCustomDate] = useState([null, null])

  // Real Data States
  const [metricsData, setMetricsData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchMetrics = async () => {
    setLoading(true)

    const [metricsRes, inventoryRes] = await Promise.all([
      supabase.from('replenishment_metrics').select('*').order('report_date', { ascending: false }),
      supabase.from('fba_inventory').select('*').order('product_name', { ascending: true })
    ])

    if (!metricsRes.error && metricsRes.data) setMetricsData(metricsRes.data)
    if (!inventoryRes.error && inventoryRes.data) setInventoryData(inventoryRes.data)

    setLoading(false)
  }

  const handleSync = async () => {
    setSyncing(true)

    // Trigger Edge Function action: replenishment_metrics
    await supabase.functions.invoke('amazon-sp-api-sync', {
      body: { action: 'replenishment_metrics' }
    })

    await fetchMetrics()
    setSyncing(false)
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <Box className='flex justify-center items-center p-20'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Header & Sync Row */}
      {/* <Grid size={{ xs: 12 }} className='flex justify-between items-center'>
        <Typography variant='h5'>Subscribe & Save Performance</Typography>
        <Button
          variant='contained'
          onClick={handleSync}
          disabled={syncing}
          startIcon={syncing ? <CircularProgress size={20} color='inherit' /> : <i className='bx-refresh' />}
        >
          {syncing ? 'Fetching Metrics...' : 'Sync S&S Metrics'}
        </Button>
      </Grid> */}

      <Grid size={{ xs: 12 }}>
        <SnsFilterOptions
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDate={customDate}
          onCustomDateChange={setCustomDate}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsKpiCards metricsData={metricsData} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsUpcomingDeliveries metricsData={metricsData} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsTabsAndTables
          productData={productData}
          dateRange={dateRange}
          metricsData={metricsData}
          inventoryData={inventoryData}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsProductCards inventoryData={inventoryData} />
      </Grid>
    </Grid>
  )
}

export default SnsProDashboard
