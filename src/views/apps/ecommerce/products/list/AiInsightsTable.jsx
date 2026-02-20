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
import { getAiInsightsData } from '@/libs/products/productsMockData'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const impactColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'info'
}

const columnHelper = createColumnHelper()

const AiInsightsTable = () => {
  const data = useMemo(() => getAiInsightsData(), [])

  const columns = useMemo(
    () => [
      columnHelper.accessor('insight', {
        header: 'AI Insight',
        cell: ({ row }) => (
          <Typography color='text.primary' className='whitespace-normal max-w-[400px]'>
            {row.original.insight}
          </Typography>
        )
      }),
      columnHelper.accessor('impact', {
        header: 'Impact',
        cell: ({ row }) => (
          <Chip
            label={row.original.impact}
            variant='tonal'
            color={impactColor[row.original.impact] || 'primary'}
            size='small'
          />
        )
      }),
      columnHelper.accessor('action', {
        header: 'Recommended Action',
        cell: ({ row }) => <Typography className='font-medium'>{row.original.action}</Typography>
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
      <CardHeader title='AI Recommendations' subheader='Actionable insights based on your catalog performance' />
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

export default AiInsightsTable
