'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
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

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Libs
import { fmt } from '@/libs/ppc/calculationEngine'
import { exportToCSV, TABLE1_COLUMNS } from '@/libs/ppc/exportService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ImprovementBadge = ({ value }) => {
  if (value == null) return <span className='text-textDisabled text-sm'>N/A</span>
  const isPositive = value >= 0

  return (
    <Chip
      label={fmt.improvement(value)}
      color={isPositive ? 'success' : 'error'}
      variant='tonal'
      size='small'
      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
    />
  )
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

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// ─── Column Definitions ───────────────────────────────────────────────────────

const columnHelper = createColumnHelper()

const PPCTable1SalesOrganic = ({ weeks }) => {
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('month', {
        header: 'Month',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.month}</Typography>
      }),
      columnHelper.accessor('weekRange', {
        header: 'Week Range',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.weekRange}
          </Typography>
        )
      }),
      columnHelper.accessor('sessions', {
        header: 'Sessions',
        cell: ({ row }) => <Typography>{fmt.number(row.original.sessions)}</Typography>
      }),
      columnHelper.accessor('totalOrders', {
        header: 'Total Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.totalOrders)}</Typography>
      }),
      columnHelper.accessor('conversionRate', {
        header: 'Conv. Rate',
        cell: ({ row }) => (
          <Typography color='primary.main' className='font-medium'>
            {fmt.percent(row.original.conversionRate)}
          </Typography>
        )
      }),
      columnHelper.accessor('totalSales', {
        header: 'Total Sales',
        cell: ({ row }) => <Typography className='font-medium'>{fmt.currency(row.original.totalSales)}</Typography>
      }),
      columnHelper.accessor('ntbCustomers', {
        header: 'NTB Customers',
        cell: ({ row }) => <Typography>{fmt.number(row.original.ntbCustomers)}</Typography>
      }),
      columnHelper.accessor('ntbOrders', {
        header: 'NTB Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.ntbOrders)}</Typography>
      }),
      columnHelper.accessor('ntbSales', {
        header: 'NTB Sales',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.ntbSales)}</Typography>
      }),
      columnHelper.accessor('repeatCustomers', {
        header: 'Repeat Customers',
        cell: ({ row }) => <Typography>{fmt.number(row.original.repeatCustomers)}</Typography>
      }),
      columnHelper.accessor('repeatOrders', {
        header: 'Repeat Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.repeatOrders)}</Typography>
      }),
      columnHelper.accessor('repeatSales', {
        header: 'Repeat Sales',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.repeatSales)}</Typography>
      }),
      columnHelper.accessor('organicOrders', {
        header: 'Organic Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.organicOrders)}</Typography>
      }),
      columnHelper.accessor('improvementOrganicOrders', {
        header: 'Organic Δ%',
        cell: ({ row }) => <ImprovementBadge value={row.original.improvementOrganicOrders} />,
        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data: weeks,
    columns,
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const menuOptions = [
    {
      text: 'Export CSV',
      menuItemProps: {
        onClick: () => {
          const periodContext = `Period: ${weeks[0]?.weekRange} – ${weeks[weeks.length - 1]?.weekRange}`

          exportToCSV(weeks, TABLE1_COLUMNS, 'ppc-table1-sales-organic', periodContext)
        }
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Part 1 — Organic & General Performance'
        subheader='Weekly breakdown of sessions, orders, sales, and organic performance'
        action={<OptionMenu options={menuOptions} />}
      />
      <CardContent className='flex justify-between max-sm:flex-col sm:items-center gap-4'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search...'
          className='sm:is-auto'
        />
        <div className='flex max-sm:flex-col sm:items-center gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[80px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
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
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default PPCTable1SalesOrganic
