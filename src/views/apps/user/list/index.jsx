'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

const UserList = ({ userData }) => {
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
        <UserListCards />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserList
