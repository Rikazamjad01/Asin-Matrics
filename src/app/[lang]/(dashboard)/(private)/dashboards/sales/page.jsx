'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'
import TotalRevenueReport from '@views/dashboards/analytics/TotalRevenueReport'
import OrderStatistics from '@views/dashboards/analytics/OrderStatistics'
import NewVisitorsAndActivityCharts from '@views/apps/ecommerce/dashboard/NewVisitorsAndActivityCharts'
import BarOrders from '@views/apps/ecommerce/dashboard/BarOrders'
import OverviewSalesActivity from '@/views/dashboards/crm/OverviewSalesActivity'
import EarningReports from '@/views/dashboards/crm/EarningReports'
import TopProducts from '@/views/dashboards/crm/TopProducts'
import SalesAnalytics from '@/views/dashboards/crm/SalesAnalytics'

// Mock data for different filters
const mockData = {
  'All Products': {
    'Last 7 Days': { sales: '$4,679', salesTrend: 28.14, revenue: '$42,389', revenueTrend: 52.18 },
    'Last 30 Days': { sales: '$18,542', salesTrend: 35.24, revenue: '$156,892', revenueTrend: 48.32 },
    'Last 90 Days': { sales: '$52,184', salesTrend: 42.15, revenue: '$478,221', revenueTrend: 55.67 }
  },
  Electronics: {
    'Last 7 Days': { sales: '$2,845', salesTrend: 18.45, revenue: '$25,672', revenueTrend: 38.21 },
    'Last 30 Days': { sales: '$11,234', salesTrend: 22.15, revenue: '$95,431', revenueTrend: 42.55 },
    'Last 90 Days': { sales: '$31,567', salesTrend: 28.92, revenue: '$285,142', revenueTrend: 48.33 }
  },
  Clothing: {
    'Last 7 Days': { sales: '$1,234', salesTrend: 15.32, revenue: '$11,245', revenueTrend: 28.45 },
    'Last 30 Days': { sales: '$4,892', salesTrend: 18.67, revenue: '$42,178', revenueTrend: 32.18 },
    'Last 90 Days': { sales: '$13,745', salesTrend: 22.34, revenue: '$126,892', revenueTrend: 36.92 }
  },
  'Home & Garden': {
    'Last 7 Days': { sales: '$892', salesTrend: 12.18, revenue: '$8,234', revenueTrend: 22.67 },
    'Last 30 Days': { sales: '$3,456', salesTrend: 15.42, revenue: '$31,245', revenueTrend: 28.34 },
    'Last 90 Days': { sales: '$9,872', salesTrend: 18.55, revenue: '$89,187', revenueTrend: 32.45 }
  },
  Sports: {
    'Last 7 Days': { sales: '$1,567', salesTrend: 24.56, revenue: '$14,892', revenueTrend: 45.78 },
    'Last 30 Days': { sales: '$6,234', salesTrend: 28.92, revenue: '$56,789', revenueTrend: 49.23 },
    'Last 90 Days': { sales: '$17,456', salesTrend: 32.67, revenue: '$162,234', revenueTrend: 52.89 }
  }
}

const DashboardSales = () => {
  // States
  const [dateAnchor, setDateAnchor] = useState(null)
  const [productAnchor, setProductAnchor] = useState(null)
  const [dateFilter, setDateFilter] = useState('Last 7 Days')
  const [productFilter, setProductFilter] = useState('All Products')

  // Get current data based on filters
  const currentData = useMemo(() => {
    return mockData[productFilter]?.[dateFilter] || mockData['All Products']['Last 7 Days']
  }, [productFilter, dateFilter])

  const handleDateClick = event => {
    setDateAnchor(event.currentTarget)
  }

  const handleProductClick = event => {
    setProductAnchor(event.currentTarget)
  }

  const handleDateClose = filter => {
    if (filter) {
      setDateFilter(filter)
    }

    setDateAnchor(null)
  }

  const handleProductClose = filter => {
    if (filter) {
      setProductFilter(filter)
    }

    setProductAnchor(null)
  }

  return (
    <Grid container spacing={6}>
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
          <MenuItem onClick={() => handleProductClose('Electronics')}>Electronics</MenuItem>
          <MenuItem onClick={() => handleProductClose('Clothing')}>Clothing</MenuItem>
          <MenuItem onClick={() => handleProductClose('Home & Garden')}>Home & Garden</MenuItem>
          <MenuItem onClick={() => handleProductClose('Sports')}>Sports</MenuItem>
        </Menu>

        <Button
          variant='outlined'
          onClick={handleDateClick}
          endIcon={<i className='bx-chevron-down text-xl' />}
          className='min-w-[160px]'
        >
          {dateFilter}
        </Button>
        <Menu
          keepMounted
          anchorEl={dateAnchor}
          onClose={() => handleDateClose(null)}
          open={Boolean(dateAnchor)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleDateClose('Last 7 Days')}>Last 7 Days</MenuItem>
          <MenuItem onClick={() => handleDateClose('Last 30 Days')}>Last 30 Days</MenuItem>
          <MenuItem onClick={() => handleDateClose('Last 90 Days')}>Last 90 Days</MenuItem>
        </Menu>
      </Grid>

      {/* KPI Cards Row - Now updates with filters */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Sales'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats={currentData.sales}
          trendNumber={currentData.salesTrend}
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <BarOrders />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Revenue'
          imageSrc='/images/cards/mac-warning-bg.png'
          stats={currentData.revenue}
          trendNumber={currentData.revenueTrend}
          trend='positive'
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
