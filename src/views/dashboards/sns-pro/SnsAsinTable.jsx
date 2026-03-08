'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'

// Component Imports
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const columnHelper = createColumnHelper()

const SnsAsinTable = ({ inventoryData }) => {
  const tableData = useMemo(() => {
    return (inventoryData || []).map(item => ({
      id: item.id,
      asin: item.asin || '—',
      sku: item.seller_sku || item.fn_sku || '—',
      productName: item.product_name || '—',
      condition: item.condition || '—',
      totalQuantity: item.total_quantity || 0
    }))
  }, [inventoryData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('asin', {
        header: 'ASIN',
        cell: ({ row }) => (
          <Typography color='primary' className='font-medium' sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {row.original.asin}
          </Typography>
        )
      }),
      columnHelper.accessor('sku', {
        header: 'Seller SKU',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.sku}
          </Typography>
        )
      }),
      columnHelper.accessor('productName', {
        header: 'Product Name',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            sx={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {row.original.productName}
          </Typography>
        )
      }),
      columnHelper.accessor('condition', {
        header: 'Condition',
        cell: ({ row }) => <Typography variant='body2'>{row.original.condition}</Typography>
      }),
      columnHelper.accessor('totalQuantity', {
        header: 'Total Qty',
        cell: ({ row }) => (
          <Typography className='font-medium'>{row.original.totalQuantity.toLocaleString()}</Typography>
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
        pageSize: 10
      }
    }
  })

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <div className='p-6 text-center'>
        <i className='bx-package text-5xl text-textSecondary mb-3' />
        <Typography color='text.secondary'>No inventory data. Sync FBA Inventory first.</Typography>
      </div>
    )
  }

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
        rowsPerPageOptions={[10, 25, 50]}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </div>
  )
}

export default SnsAsinTable
