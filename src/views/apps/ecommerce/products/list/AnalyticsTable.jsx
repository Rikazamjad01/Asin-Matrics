'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Data Imports
import { getAnalyticsData } from '@/libs/products/productsMockData'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const statusColor = {
  Exceeding: 'success',
  'On Track': 'info',
  'Needs Improvement': 'warning'
}

const columnHelper = createColumnHelper()

const AnalyticsTable = ({ dateRange }) => {
  const data = useMemo(() => getAnalyticsData(dateRange), [dateRange])

  const columns = useMemo(
    () => [
      columnHelper.accessor('metric', {
        header: 'Metric',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.metric}
          </Typography>
        )
      }),
      columnHelper.accessor('value', {
        header: 'Current Value',
        cell: ({ row }) => <Typography className='font-semibold'>{row.original.value}</Typography>
      }),
      columnHelper.accessor('target', {
        header: 'Target',
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.target}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            variant='tonal'
            color={statusColor[row.original.status] || 'primary'}
            size='small'
          />
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Card>
      <CardHeader title='Performance Analytics' subheader='Key conversion and engagement metrics' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default AnalyticsTable
