'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Data Imports
import { getForecastData } from '@/libs/products/productsMockData'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const ForecastTable = ({ dateRange }) => {
  const data = useMemo(() => getForecastData(dateRange), [dateRange])

  const columns = useMemo(
    () => [
      columnHelper.accessor('product', {
        header: 'Product',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.product}
          </Typography>
        )
      }),
      columnHelper.accessor('predictedDemand', {
        header: 'Predicted Demand (Units)',
        cell: ({ row }) => <Typography>{row.original.predictedDemand.toLocaleString()}</Typography>
      }),
      columnHelper.accessor('confidence', {
        header: 'AI Confidence Score',
        cell: ({ row }) => (
          <Typography color='success.main' className='font-medium'>
            {row.original.confidence}
          </Typography>
        )
      }),
      columnHelper.accessor('reorderDate', {
        header: 'Suggested Reorder Date',
        cell: ({ row }) => <Typography className='font-semibold'>{row.original.reorderDate}</Typography>
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
      <CardHeader title='Demand Forecasting' subheader='Predicted inventory needs over time' />
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

export default ForecastTable
