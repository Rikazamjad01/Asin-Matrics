'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
import { Card, CardHeader, Typography } from '@mui/material'

import RankingsTable from '@/views/dashboards/ppc/RankingsTable'
import RankTrendChart from '@/views/dashboards/ppc/RankTrendChart'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

// Mock Data
import { rankingsData } from '@/libs/ppc/mockData'
import OptionMenu from '@/@core/components/option-menu'

const DashboardRankings = () => {
  const [dateFilter, setDateFilter] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState(null)

  // Get the most popular keyword for the trend chart
  const topKeyword = useMemo(() => {
    if (!rankingsData || rankingsData.length === 0) return ''
    const counts = {}

    rankingsData.forEach(r => {
      counts[r.keyword] = (counts[r.keyword] || 0) + 1
    })

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
  }, [])

  const menuOptions = [
    {
      text: 'Export CSV',
      menuItemProps: {
        onClick: () => {
          const exportRows = filteredRows.map(r => ({
            ...r,
            rankChange: calcRankChange(r.currentRank, r.previousRank)
          }))

          exportToCSV(exportRows, RANKINGS_COLUMNS, 'rankings-export')
        }
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
        {/* <Card>
          <CardHeader
            title='Keyword Rankings'
            subheader='Current rank, previous rank, and rank change by keyword and marketplace'
            action={<OptionMenu options={menuOptions} />}
          />
        </Card> */}
        {/* <Typography>Keyword Rankings</Typography> <br/> */}

        <GlobalTimeFilter
          dateRange={dateFilter}
          onDateRangeChange={setDateFilter}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
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
