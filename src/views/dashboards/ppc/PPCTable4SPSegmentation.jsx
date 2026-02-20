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
import { exportToCSV, TABLE4_COLUMNS } from '@/libs/ppc/exportService'

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

const PPCTable4SPSegmentation = ({ weeks }) => {
  const [globalFilter, setGlobalFilter] = useState('')

  // Flatten nested nonBranded/branded data for TanStack column binding
  const flatData = useMemo(
    () =>
      weeks.map(row => ({
        ...row,
        nonBrandedSpend: row.nonBranded?.spend ?? 0,
        nonBrandedSales: row.nonBranded?.sales ?? 0,
        nonBrandedRoas: row.nonBranded?.roas ?? null,
        brandedSpend: row.branded?.spend ?? 0,
        brandedSales: row.branded?.sales ?? 0,
        brandedRoas: row.branded?.roas ?? null
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

      // ── Non-Branded ──
      columnHelper.accessor('nonBrandedSpend', {
        header: 'NB Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.nonBrandedSpend)}</Typography>
      }),
      columnHelper.accessor('nonBrandedSales', {
        header: 'NB Sales',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.nonBrandedSales)}</Typography>
      }),
      columnHelper.accessor('nonBrandedRoas', {
        header: 'NB ROAS',
        cell: ({ row }) => (
          <Typography color='info.main' className='font-medium'>
            {fmt.roas(row.original.nonBrandedRoas)}
          </Typography>
        )
      }),

      // ── Branded ──
      columnHelper.accessor('brandedSpend', {
        header: 'B Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.brandedSpend)}</Typography>
      }),
      columnHelper.accessor('brandedSales', {
        header: 'B Sales',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.brandedSales)}</Typography>
      }),
      columnHelper.accessor('brandedRoas', {
        header: 'B ROAS',
        cell: ({ row }) => (
          <Typography color='secondary.main' className='font-medium'>
            {fmt.roas(row.original.brandedRoas)}
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

          exportToCSV(weeks, TABLE4_COLUMNS, 'ppc-table4-sp-segmentation', periodContext)
        }
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Part 5 — Branded vs Non-Branded Performance'
        subheader='Sponsored Products spend and revenue split by brand intent'
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

export default PPCTable4SPSegmentation
