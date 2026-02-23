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

const ReviewsAsinTable = ({ productData }) => {
  // Generate mock Reviews data securely
  const tableData = useMemo(() => {
    return (productData || []).map(p => {
      const seed = p.id * 7777

      const priceVal = parseFloat((p.price || '$0').replace(/[^0-9.-]+/g, '')) || 0

      // Reviews specific mock data
      const totalReviews = 100 + Math.floor(Math.abs(Math.sin(seed) * 2000))
      const avgRating = (3.5 + Math.abs(Math.sin(seed + 1) * 1.5)).toFixed(1)
      const positivePct = 60 + Math.abs(Math.sin(seed + 2) * 35) // 60% - 95%
      const responseRate = 70 + Math.abs(Math.sin(seed + 3) * 25) // 70% - 95%
      const growth = (Math.sin(seed + 4) * 12).toFixed(1) // -12% to +12%

      return {
        id: p.id,
        image: p.image,
        productName: p.productName,
        totalReviews,
        avgRating: parseFloat(avgRating),
        positivePct,
        responseRate,
        growth: parseFloat(growth)
      }
    })
  }, [productData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <img src={row.original.image} alt={row.original.productName} width='34' height='34' className='rounded' />
            <Typography color='text.primary' className='font-medium truncate max-w-[200px]'>
              {row.original.productName}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('totalReviews', {
        header: 'Total Reviews',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.totalReviews.toLocaleString()}</Typography>
      }),
      columnHelper.accessor('avgRating', {
        header: 'Avg. Rating',
        cell: ({ row }) => (
          <div className='flex items-center gap-1.5'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.avgRating}
            </Typography>
            <i className='bx-bxs-star text-warning text-base' />
          </div>
        )
      }),
      columnHelper.accessor('positivePct', {
        header: 'Positive %',
        cell: ({ row }) => <Typography>{row.original.positivePct.toFixed(1)}%</Typography>
      }),
      columnHelper.accessor('growth', {
        header: 'Trend',
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
      columnHelper.accessor('responseRate', {
        header: 'Response Rate',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.responseRate.toFixed(0)}%</Typography>
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

export default ReviewsAsinTable
