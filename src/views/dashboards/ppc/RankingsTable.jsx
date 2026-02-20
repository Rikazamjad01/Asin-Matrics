'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Calculation Engine
import { calcRankChange } from '@/libs/ppc/calculationEngine'

// Export Service
import { exportToCSV, RANKINGS_COLUMNS } from '@/libs/ppc/exportService'

const RankingsTable = ({ data }) => {
  const [keywordFilter, setKeywordFilter] = useState('')
  const [marketplaceFilter, setMarketplaceFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')

  const marketplaces = useMemo(() => ['All', ...new Set(data.map(r => r.marketplace))], [data])
  const dates = useMemo(() => ['All', ...new Set(data.map(r => r.date))], [data])

  const latestDate = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date))

    return sorted[0]?.date
  }, [data])

  const filteredRows = useMemo(() => {
    let rows = dateFilter === 'All' ? data.filter(r => r.date === latestDate) : data.filter(r => r.date === dateFilter)

    if (keywordFilter) rows = rows.filter(r => r.keyword.toLowerCase().includes(keywordFilter.toLowerCase()))
    if (marketplaceFilter !== 'All') rows = rows.filter(r => r.marketplace === marketplaceFilter)

    return rows
  }, [data, keywordFilter, marketplaceFilter, dateFilter, latestDate])

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
    <Card>
      <CardHeader
        title='Keyword Rankings'
        subheader='Current rank, previous rank, and rank change by keyword and marketplace'
        action={<OptionMenu options={menuOptions} />}
      />
      <CardContent>
        {/* Filters */}
        <div className='flex flex-wrap gap-4 mbe-4'>
          <TextField
            label='Search Keyword'
            size='small'
            value={keywordFilter}
            onChange={e => setKeywordFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Marketplace</InputLabel>
            <Select value={marketplaceFilter} label='Marketplace' onChange={e => setMarketplaceFilter(e.target.value)}>
              {marketplaces.map(m => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Date</InputLabel>
            <Select value={dateFilter} label='Date' onChange={e => setDateFilter(e.target.value)}>
              {dates.map(d => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant='body2' color='text.secondary' className='self-center'>
            {filteredRows.length} keyword{filteredRows.length !== 1 ? 's' : ''}
          </Typography>
        </div>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>ASIN</th>
                <th>Marketplace</th>
                <th>Current Rank</th>
                <th>Previous Rank</th>
                <th>Rank Change</th>
                <th>Organic Rank</th>
                <th>Sponsored Rank</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(row => {
                const change = calcRankChange(row.currentRank, row.previousRank)
                const isImproved = change > 0

                return (
                  <tr key={row.id}>
                    <td>
                      <Typography className='font-medium' color='text.primary'>
                        {row.keyword}
                      </Typography>
                    </td>
                    <td>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.asin}</Typography>
                    </td>
                    <td>
                      <Chip label={row.marketplace} size='small' variant='tonal' color='primary' />
                    </td>
                    <td>
                      <Typography className='font-medium'>#{row.currentRank}</Typography>
                    </td>
                    <td>
                      <Typography color='text.secondary'>#{row.previousRank}</Typography>
                    </td>
                    <td>
                      {change === 0 ? (
                        <Typography color='text.disabled'>—</Typography>
                      ) : (
                        <Chip
                          label={isImproved ? `▲ ${change}` : `▼ ${Math.abs(change)}`}
                          color={isImproved ? 'success' : 'error'}
                          variant='tonal'
                          size='small'
                          sx={{ fontWeight: 700 }}
                        />
                      )}
                    </td>
                    <td>
                      <Typography>#{row.organicRank}</Typography>
                    </td>
                    <td>
                      <Typography>#{row.sponsoredRank}</Typography>
                    </td>
                    <td>
                      <Typography color='text.secondary' variant='body2'>
                        {row.date}
                      </Typography>
                    </td>
                  </tr>
                )
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                    <Typography color='text.secondary'>No keywords match the current filters.</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default RankingsTable
