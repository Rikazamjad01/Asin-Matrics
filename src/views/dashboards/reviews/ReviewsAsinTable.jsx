'use client'

// React Imports
import { useMemo, useState, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <CustomTextField {...props} className='max-sm:is-full' value={value} onChange={e => setValue(e.target.value)} />
  )
}

const columnHelper = createColumnHelper()

const ReviewsAsinTable = ({ inventoryData }) => {
  // Use real FBA inventory data for the list, but zero out the rating metrics
  const tableData = useMemo(() => {
    return (inventoryData || []).map(p => {
      return {
        id: p.id,
        image_url: p.image_url,
        productName: p.product_name || p.asin,
        asin: p.asin,
        totalReviews: '—',
        avgRating: '—',
        positivePct: '—',
        responseRate: '—',
        growth: 0
      }
    })
  }, [inventoryData])

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Product',
        size: 250,
        cell: ({ row }) => (
          <div className='flex items-center gap-3 w-full no-scrollbar'>
            {row.original.image_url ? (
              <img
                src={row.original.image_url}
                alt={row.original.productName}
                width='34'
                height='34'
                className='rounded'
              />
            ) : (
              <div
                style={{ width: 34, height: 34 }}
                className='rounded bg-actionHover flex items-center justify-center'
              >
                <i className='bx-image text-textSecondary' />
              </div>
            )}
            <div
              className='flex flex-col no-scrollbar'
              style={{ overflowX: 'auto', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <Typography variant='h6' style={{ display: 'inline' }} title={row.original.productName}>
                {row.original.productName}
              </Typography>
              <br />
              <Typography variant='body2' style={{ display: 'inline' }}>
                {row.original.asin}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('totalReviews', {
        header: 'Total Reviews',
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.totalReviews}</Typography>
      }),
      columnHelper.accessor('avgRating', {
        header: 'Avg. Rating',
        cell: ({ row }) => (
          <div className='flex items-center gap-1.5'>
            <Typography color='text.secondary' className='font-medium'>
              {row.original.avgRating}
            </Typography>
            <i className='bx-bx-star text-secondary text-base' />
          </div>
        )
      }),
      columnHelper.accessor('positivePct', {
        header: 'Positive %',
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.positivePct}</Typography>
      }),
      columnHelper.accessor('growth', {
        header: 'Trend',
        cell: ({ row }) => (
          <div className='flex items-center gap-1 mt-1'>
            <CustomAvatar skin='light' color='secondary' size={24}>
              <i className='bx-minus text-base' />
            </CustomAvatar>
            <Typography color='text.secondary' className='font-medium'>
              —
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('responseRate', {
        header: 'Response Rate',
        size: 150,
        cell: ({ row }) => <Typography color='text.secondary'>{row.original.responseRate}</Typography>
      })
    ],
    []
  )

  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 25
      }
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <div className='flex items-center justify-between flex-wrap gap-4 p-6'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Product'
        />
        <div className='flex sm:items-center flex-wrap max-sm:flex-col max-sm:is-full gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='flex-auto is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </div>
      <Divider />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table} style={{ tableLayout: 'fixed', width: 'max-content', minWidth: '100%' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.column.getSize(),
                      maxWidth: header.column.getSize(),
                      overflow: 'hidden'
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='bx-chevron-up text-xl' />,
                            desc: <i className='bx-chevron-down text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          overflow: 'hidden'
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </>
  )
}

export default ReviewsAsinTable
