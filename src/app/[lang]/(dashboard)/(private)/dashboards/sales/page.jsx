'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'
import TotalRevenueReport from '@views/dashboards/analytics/TotalRevenueReport'
import OrderStatistics from '@views/dashboards/analytics/OrderStatistics'
import NewVisitorsAndActivityCharts from '@views/apps/ecommerce/dashboard/NewVisitorsAndActivityCharts'
import BarOrders from '@views/apps/ecommerce/dashboard/BarOrders'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'
import OverviewSalesActivity from '@/views/dashboards/crm/OverviewSalesActivity'
import EarningReports from '@/views/dashboards/crm/EarningReports'
import TopProducts from '@/views/dashboards/crm/TopProducts'
import SalesAnalytics from '@/views/dashboards/crm/SalesAnalytics'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const DashboardSales = () => {
  // States
  const [productAnchor, setProductAnchor] = useState(null)
  const [dateFilter, setDateFilter] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)
  const [productFilter, setProductFilter] = useState('All Products')

  // Real Data States
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchSalesData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('sales_traffic_report')
      .select('*')
      .order('report_date', { ascending: false })

    if (!error && data) {
      setSalesData(data)
    }

    setLoading(false)
  }

  const handleSync = async () => {
    setSyncing(true)

    // Trigger Edge Function action: sales_traffic
    // Note: Reports API is async, so this might take 15-60+ seconds
    await supabase.functions.invoke('amazon-sp-api-sync', {
      body: { action: 'sales_traffic' }
    })

    await fetchSalesData()
    setSyncing(false)
  }

  useEffect(() => {
    fetchSalesData()
  }, [])

  const handleProductClick = event => {
    setProductAnchor(event.currentTarget)
  }

  const handleProductClose = filter => {
    if (filter) {
      setProductFilter(filter)
    }

    setProductAnchor(null)
  }

  // Aggregate stats from the DB
  const totalRevenue = salesData.reduce((sum, item) => sum + (Number(item.ordered_product_sales) || 0), 0)
  const totalOrders = salesData.reduce((sum, item) => sum + (item.units_ordered || 0), 0)
  const totalSessions = salesData.reduce((sum, item) => sum + (item.sessions || 0), 0)

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
        <Typography variant='h5'>Sales Dashboard</Typography>
        <Button
          variant='contained'
          onClick={handleSync}
          disabled={syncing}
          startIcon={syncing ? <CircularProgress size={20} color='inherit' /> : <i className='bx-refresh' />}
        >
          {syncing ? 'Requesting Report from Amazon...' : 'Sync Sales from Amazon'}
        </Button>
      </Grid>

      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
        <Button
          variant='outlined'
          onClick={handleProductClick}
          endIcon={<i className='bx-chevron-down text-xl' />}
          className='min-w-[160px]'
        >
          {productFilter}
        </Button>
        <Menu
          keepMounted
          anchorEl={productAnchor}
          onClose={() => handleProductClose(null)}
          open={Boolean(productAnchor)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleProductClose('All Products')}>All Products</MenuItem>
        </Menu>

        <GlobalTimeFilter
          dateRange={dateFilter}
          onDateRangeChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      </Grid>

      {/* KPI Cards Row - Now uses Real DB Data */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Revenue'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trendNumber={12.5}
          trend='positive'
          subtitle={`${salesData.length} active ASINs`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Orders (Units)'
          imageSrc='/images/cards/mac-warning-bg.png'
          stats={totalOrders.toLocaleString()}
          trendNumber={5.2}
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Sessions'
          imageSrc='/images/cards/cube-secondary-bg.png'
          stats={totalSessions.toLocaleString()}
          trendNumber={2.4}
          trend='negative'
        />
      </Grid>

      {/* Revenue Report */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <TotalRevenueReport />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <OrderStatistics />
      </Grid>

      {/* Daily Sales Activity */}
      <Grid size={{ xs: 12 }}>
        <NewVisitorsAndActivityCharts />
      </Grid>

      {/* Product Performance */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <TopProducts />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 5 }}>
        <EarningReports />
      </Grid>

      <Grid size={{ xs: 8 }}>
        <SalesAnalytics />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <OverviewSalesActivity />
      </Grid>
    </Grid>
  )
}

export default DashboardSales
