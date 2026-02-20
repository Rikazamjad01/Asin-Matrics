'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Components Imports
import RankingsTable from '@/views/dashboards/ppc/RankingsTable'
import RankTrendChart from '@/views/dashboards/ppc/RankTrendChart'

// Mock Data
import { rankingsData } from '@/libs/ppc/mockData'

const DashboardRankings = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [dateFilter, setDateFilter] = useState('Last 30 Days')

  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days']

  // Get the most popular keyword for the trend chart
  const topKeyword = useMemo(() => {
    if (!rankingsData || rankingsData.length === 0) return ''
    const counts = {}

    rankingsData.forEach(r => {
      counts[r.keyword] = (counts[r.keyword] || 0) + 1
    })

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  }, [])

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
        <Button
          variant='outlined'
          onClick={e => setAnchorEl(e.currentTarget)}
          endIcon={<i className='bx-chevron-down text-xl' />}
          className='min-w-[160px]'
        >
          {dateFilter}
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {dateOptions.map(opt => (
            <MenuItem
              key={opt}
              onClick={() => {
                setDateFilter(opt)
                setAnchorEl(null)
              }}
            >
              {opt}
            </MenuItem>
          ))}
        </Menu>
      </Grid>

      {/* Rankings Table */}
      <Grid size={{ xs: 12 }}>
        <RankingsTable data={rankingsData} />
      </Grid>

      {/* Rank Trend Chart */}
      {topKeyword && (
        <Grid size={{ xs: 12 }}>
          <RankTrendChart data={rankingsData} selectedKeyword={topKeyword} />
        </Grid>
      )}
    </Grid>
  )
}

export default DashboardRankings
