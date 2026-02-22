'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import classnames from 'classnames'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const SnsAsinTable = ({ productData }) => {
  // Generate mock S&S data securely
  const tableData = useMemo(() => {
    return (productData || []).map(p => {
      const seed = p.id * 8888
      const asin = `B0${Math.floor(Math.abs(Math.sin(seed) * 100000000))
        .toString()
        .padStart(8, '0')}`
      const priceVal = parseFloat((p.price || '$0').replace(/[^0-9.-]+/g, '')) || 0

      const snsCustomers = 50 + Math.floor(Math.abs(Math.sin(seed + 1) * 450))
      const snsRevenue = snsCustomers * priceVal * 0.9 // 10% S&S discount
      const pctOfTotal = 15 + Math.abs(Math.sin(seed + 2) * 25) // 15% - 40%
      const growth = (Math.sin(seed + 3) * 15).toFixed(1) // -15% to +15%
      const aov = snsRevenue / snsCustomers

      return {
        id: p.id,
        asin,
        snsCustomers,
        snsRevenue,
        pctOfTotal,
        growth: parseFloat(growth),
        aov
      }
    })
  }, [productData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('asin', {
        header: 'ASIN (ID)',
        cell: ({ row }) => (
          <Typography color='primary' className='font-medium'>
            {row.original.asin}
          </Typography>
        )
      }),
      columnHelper.accessor('snsCustomers', {
        header: 'S&S Customers',
        cell: ({ row }) => <Typography>{row.original.snsCustomers}</Typography>
      }),
      columnHelper.accessor('snsRevenue', {
        header: 'Monthly Revenue',
        cell: ({ row }) => (
          <Typography>
            ${row.original.snsRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }),
      columnHelper.accessor('pctOfTotal', {
        header: '% of Total',
        cell: ({ row }) => <Typography>{row.original.pctOfTotal.toFixed(1)}%</Typography>
      }),
      columnHelper.accessor('growth', {
        header: 'Growth',
        cell: ({ row }) => (
          <div className='flex items-center gap-1 mt-1'>
            <CustomAvatar skin='light' color={row.original.growth >= 0 ? 'success' : 'error'} size={24}>
              <i
                className={classnames('text-base', row.original.growth >= 0 ? 'bx-trending-up' : 'bx-trending-down')}
              />
            </CustomAvatar>
            <Typography color={row.original.growth >= 0 ? 'success.main' : 'error.main'} className='font-medium'>
              {row.original.growth > 0 ? '+' : ''}
              {row.original.growth}%
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('aov', {
        header: 'Avg Order Value',
        cell: ({ row }) => (
          <Typography>
            ${row.original.aov.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  })

  return (
    <div className='overflow-x-auto'>
      <table className={tableStyles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
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
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getCoreRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </div>
  )
}

export default SnsAsinTable
