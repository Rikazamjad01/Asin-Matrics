'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Components Imports
import RankingsTable from '@/views/dashboards/ppc/RankingsTable'
import RankTrendChart from '@/views/dashboards/ppc/RankTrendChart'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

// Supabase Client
import { supabase } from '@/utils/supabase/client'

const DashboardRankings = () => {
  const [dateFilter, setDateFilter] = useState('30d')
  const [customDateRange, setCustomDateRange] = useState(null)

  const [rankingsData, setRankingsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchRankings = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('brand_search_terms')
      .select('*')
      .order('search_frequency_rank', { ascending: true })

    if (!error && data) {
      // Map brand search terms to the shape expected by RankingsTable/Chart
      const formatted = data.map(item => ({
        id: item.id,
        keyword: item.search_term,
        asin: item.asin_1 || '—',
        marketplace: 'US',
        currentRank: item.search_frequency_rank || 0,
        previousRank: item.search_frequency_rank || 0, // Fallback if no historical data available
        organicRank: item.search_frequency_rank || 0,
        sponsoredRank: 0,
        date: item.report_date
      }))

      setRankingsData(formatted)
    }

    setLoading(false)
  }

  const handleSync = async () => {
    setSyncing(true)
    await supabase.functions.invoke('amazon-sp-api-sync', { body: { action: 'search_terms' } })
    await fetchRankings()
    setSyncing(false)
  }

  useEffect(() => {
    fetchRankings()
  }, [])

  // Get the most popular keyword for the trend chart
  const topKeyword = useMemo(() => {
    if (!rankingsData || rankingsData.length === 0) return ''

    return rankingsData[0].keyword // It's ordered by rank ascending, so [0] is the top
  }, [rankingsData])

  if (loading) {
    return (
      <Box className='flex justify-center items-center p-20'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Header and Sync Button Row */}
      <Grid size={{ xs: 12 }} className='flex justify-between items-center'>
        <Typography variant='h5'>Brand Analytics Rankings</Typography>
        <Button
          variant='contained'
          onClick={handleSync}
          disabled={syncing}
          startIcon={syncing ? <CircularProgress size={20} color='inherit' /> : <i className='bx-refresh' />}
        >
          {syncing ? 'Requesting Search Terms...' : 'Sync Search Terms'}
        </Button>
      </Grid>

      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end gap-4'>
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
