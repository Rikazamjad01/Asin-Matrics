'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import SnsFilterOptions from '@/views/dashboards/sns-pro/SnsFilterOptions'
import SnsKpiCards from '@/views/dashboards/sns-pro/SnsKpiCards'
import SnsTabsAndTables from '@/views/dashboards/sns-pro/SnsTabsAndTables'
import SnsProductCards from '@/views/dashboards/sns-pro/SnsProductCards'
import SnsUpcomingDeliveries from '@/views/dashboards/sns-pro/SnsUpcomingDeliveries'

const SnsProDashboard = ({ productData }) => {
  // State for filter
  const [dateRange, setDateRange] = useState('monthly')
  const [customDate, setCustomDate] = useState([null, null])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <SnsFilterOptions
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDate={customDate}
          onCustomDateChange={setCustomDate}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsKpiCards dateRange={dateRange} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsUpcomingDeliveries />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsTabsAndTables productData={productData} dateRange={dateRange} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SnsProductCards productData={productData} />
      </Grid>
    </Grid>
  )
}

export default SnsProDashboard
