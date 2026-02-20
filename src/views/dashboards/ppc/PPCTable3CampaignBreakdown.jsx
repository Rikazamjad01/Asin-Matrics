'use client'

// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
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
import { exportToCSV, TABLE3_COLUMNS } from '@/libs/ppc/exportService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const PPCTable3CampaignBreakdown = ({ weeks }) => {
  const [globalFilter, setGlobalFilter] = useState('')

  // Flatten nested sp/sb/sd data for TanStack column binding
  const flatData = useMemo(
    () =>
      weeks.map(row => ({
        ...row,
        spClicks: row.sp?.clicks ?? 0,
        spSpend: row.sp?.spend ?? 0,
        spOrders: row.sp?.orders ?? 0,
        spRevenue: row.sp?.revenue ?? 0,
        spRoas: row.sp?.roas ?? null,
        sbClicks: row.sb?.clicks ?? 0,
        sbSpend: row.sb?.spend ?? 0,
        sbOrders: row.sb?.orders ?? 0,
        sbRevenue: row.sb?.revenue ?? 0,
        sbRoas: row.sb?.roas ?? null,
        sdClicks: row.sd?.clicks ?? 0,
        sdSpend: row.sd?.spend ?? 0,
        sdOrders: row.sd?.orders ?? 0,
        sdRevenue: row.sd?.revenue ?? 0,
        sdRoas: row.sd?.roas ?? null
      })),
    [weeks]
  )

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

      // ── Sponsored Products (SP) ──
      columnHelper.accessor('spClicks', {
        header: 'SP Clicks',
        cell: ({ row }) => <Typography>{fmt.number(row.original.spClicks)}</Typography>
      }),
      columnHelper.accessor('spSpend', {
        header: 'SP Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.spSpend)}</Typography>
      }),
      columnHelper.accessor('spOrders', {
        header: 'SP Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.spOrders)}</Typography>
      }),
      columnHelper.accessor('spRevenue', {
        header: 'SP Revenue',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.spRevenue)}</Typography>
      }),
      columnHelper.accessor('spRoas', {
        header: 'SP ROAS',
        cell: ({ row }) => (
          <Typography color='primary.main' className='font-medium'>
            {fmt.roas(row.original.spRoas)}
          </Typography>
        )
      }),

      // ── Sponsored Brands (SB) ──
      columnHelper.accessor('sbClicks', {
        header: 'SB Clicks',
        cell: ({ row }) => <Typography>{fmt.number(row.original.sbClicks)}</Typography>
      }),
      columnHelper.accessor('sbSpend', {
        header: 'SB Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.sbSpend)}</Typography>
      }),
      columnHelper.accessor('sbOrders', {
        header: 'SB Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.sbOrders)}</Typography>
      }),
      columnHelper.accessor('sbRevenue', {
        header: 'SB Revenue',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.sbRevenue)}</Typography>
      }),
      columnHelper.accessor('sbRoas', {
        header: 'SB ROAS',
        cell: ({ row }) => (
          <Typography color='success.main' className='font-medium'>
            {fmt.roas(row.original.sbRoas)}
          </Typography>
        )
      }),

      // ── Sponsored Display (SD) ──
      columnHelper.accessor('sdClicks', {
        header: 'SD Clicks',
        cell: ({ row }) => <Typography>{fmt.number(row.original.sdClicks)}</Typography>
      }),
      columnHelper.accessor('sdSpend', {
        header: 'SD Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.sdSpend)}</Typography>
      }),
      columnHelper.accessor('sdOrders', {
        header: 'SD Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.sdOrders)}</Typography>
      }),
      columnHelper.accessor('sdRevenue', {
        header: 'SD Revenue',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.sdRevenue)}</Typography>
      }),
      columnHelper.accessor('sdRoas', {
        header: 'SD ROAS',
        cell: ({ row }) => (
          <Typography color='warning.main' className='font-medium'>
            {fmt.roas(row.original.sdRoas)}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: flatData,
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

          exportToCSV(weeks, TABLE3_COLUMNS, 'ppc-table3-campaign-breakdown', periodContext)
        }
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Part 3 — Campaign Breakdown by Type (SP, SB, SD)'
        subheader='SP vs SB vs SD weekly performance comparison'
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

export default PPCTable3CampaignBreakdown
