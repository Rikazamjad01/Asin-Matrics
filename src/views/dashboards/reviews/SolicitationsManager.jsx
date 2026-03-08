'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { supabase } from '@/utils/supabase/client'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const SolicitationsManager = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    const { data: sols, error: sbError } = await supabase
      .from('solicitations')
      .select('*')
      .order('solicited_at', { ascending: false })

    if (sbError) {
      console.error('Error fetching solicitations:', sbError)
      setError(sbError.message)
    } else {
      setData(sols || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSendSolicitations = async () => {
    setSyncing(true)
    setError(null)

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      const token = session?.access_token

      if (!token) throw new Error('No active user session. Please log in.')

      const res = await fetch('https://qrtouaijtgmhodxzdpox.supabase.co/functions/v1/amazon-sp-api-sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'send_solicitations' })
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || `Failed with status ${res.status}`)

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Sync Error:', err)
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  // KPIs
  const kpis = useMemo(() => {
    const total = data.length
    const sent = data.filter(d => d.status === 'sent').length
    const already = data.filter(d => d.status === 'already_solicited').length
    const ineligible = data.filter(d => d.status === 'ineligible').length
    const errors = data.filter(d => d.status === 'error').length

    return [
      { label: 'Total Scanned', value: total, icon: 'bx-search', color: 'primary' },
      { label: 'Successfully Sent', value: sent, icon: 'bx-check-double', color: 'success' },
      { label: 'Already Solicited', value: already, icon: 'bx-history', color: 'info' },
      { label: 'Ineligible / Errors', value: ineligible + errors, icon: 'bx-x-circle', color: 'error' }
    ]
  }, [data])

  // Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('amazon_order_id', {
        header: 'Order ID',
        cell: ({ row }) => (
          <Typography color='primary' className='font-medium'>
            {row.original.amazon_order_id}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const val = row.original.status

          const color =
            val === 'sent'
              ? 'success'
              : val === 'already_solicited'
                ? 'info'
                : val === 'ineligible'
                  ? 'warning'
                  : 'error'

          const label = val.replace('_', ' ').toUpperCase()

          return <Chip label={label} color={color} size='small' variant='tonal' className='font-medium tracking-wide' />
        }
      }),
      columnHelper.accessor('order_date', {
        header: 'Order Date',
        cell: ({ row }) => (row.original.order_date ? new Date(row.original.order_date).toLocaleDateString() : '—')
      }),
      columnHelper.accessor('solicited_at', {
        header: 'Solicited At',
        cell: ({ row }) => new Date(row.original.solicited_at).toLocaleString()
      }),
      columnHelper.accessor('http_status', {
        header: 'HTTP Code',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.http_status || '—'}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination
  })

  return (
    <Grid container spacing={6}>
      {/* Header & Controls */}
      <Grid size={{ xs: 12 }}>
        <Box className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <Typography variant='h4' className='mb-1'>
              Solicitations Manager
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Automatically send Review & Feedback requests to eligible FBA orders (5–30 days old).
            </Typography>
          </div>
          <Button
            variant='contained'
            color='primary'
            startIcon={syncing ? <CircularProgress size={20} color='inherit' /> : <i className='bx-send' />}
            onClick={handleSendSolicitations}
            disabled={syncing || loading}
          >
            {syncing ? 'Sending...' : 'Send Solicitations Now'}
          </Button>
        </Box>
        {error && (
          <Typography color='error' variant='body2' className='mt-2'>
            Error: {error}
          </Typography>
        )}
      </Grid>

      {/* KPI Tiles */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={4}>
          {kpis.map((kpi, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Box className='flex items-center gap-3 p-4 rounded bg-paper shadow-sm border border-divider'>
                <CustomAvatar size={46} variant='rounded' skin='light' color={kpi.color}>
                  <i className={`${kpi.icon} text-2xl`} />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.secondary' className='font-medium uppercase tracking-wide'>
                    {kpi.label}
                  </Typography>
                  <Typography variant='h5' className='font-bold leading-tight'>
                    {loading ? <CircularProgress size={20} /> : kpi.value.toLocaleString()}
                  </Typography>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Table */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <div className='overflow-x-auto'>
            {loading ? (
              <Box className='flex justify-center items-center p-10'>
                <CircularProgress />
              </Box>
            ) : (
              <table className={tableStyles.table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          <div
                            className={`flex items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='bx-chevron-up text-xl' />,
                              desc: <i className='bx-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className='text-center p-4'>
                        No solicitations sent yet. Click &quot;Send&quot; above.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <TablePaginationComponent table={table} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default SolicitationsManager
