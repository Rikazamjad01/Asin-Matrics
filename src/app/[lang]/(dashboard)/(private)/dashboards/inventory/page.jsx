'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'
import LineAreaOrderChart from '@views/dashboards/analytics/LineAreaOrderChart'
import TotalRevenueReport from '@views/dashboards/analytics/TotalRevenueReport'
import FinancialStatsTabs from '@views/dashboards/analytics/FinancialStatsTabs'
import ActivityTimeline from '@views/dashboards/analytics/ActivityTimeline'
import TableWithTabs from '@views/dashboards/analytics/TableWithTabs'
import BarRevenueChart from '@views/dashboards/analytics/BarRevenueChart'
import RadialExpensesChart from '@views/apps/ecommerce/dashboard/RadialExpensesChart'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

const DashboardInventory = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end'>
        <GlobalTimeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      </Grid>

      {/* Stock Level KPIs */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Total Stock'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats='2,847'
          trendNumber={15.8}
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Low Stock Items'
          imageSrc='/images/cards/paypal-error-bg.png'
          stats='24'
          trendNumber={8.2}
          trend='negative'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Out of Stock'
          imageSrc='/images/cards/cube-secondary-bg.png'
          stats='7'
          trendNumber={12.4}
          trend='negative'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <LineAreaOrderChart />
      </Grid>

      {/* Stock Overview */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <TotalRevenueReport />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <FinancialStatsTabs />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <BarRevenueChart />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Reorder Needed'
          imageSrc='/images/cards/credit-card-primary-bg.png'
          stats='18'
          trendNumber={5.3}
          trend='negative'
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Vertical
          title='Stock Accuracy'
          imageSrc='/images/cards/mac-warning-bg.png'
          stats='96.5%'
          trendNumber={2.1}
          trend='positive'
        />
      </Grid>

      {/* Product Stock Details */}
      {/* <Grid size={{ xs: 12, lg: 8 }}>
        <TopProducts />
      </Grid> */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <ActivityTimeline />
      </Grid>

      {/* Inventory Table */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <TableWithTabs />
      </Grid>
    </Grid>
  )
}

export default DashboardInventory
