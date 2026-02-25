'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderCard from './OrderCard'
import OrderListTable from './OrderListTable'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

const OrderList = ({ orderData }) => {
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }} className='flex justify-end'>
        <GlobalTimeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <OrderCard />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={orderData} />
      </Grid>
    </Grid>
  )
}

export default OrderList
