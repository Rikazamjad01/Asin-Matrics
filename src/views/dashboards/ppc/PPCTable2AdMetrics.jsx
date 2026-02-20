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
import { exportToCSV, TABLE2_COLUMNS } from '@/libs/ppc/exportService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ImprovementBadge = ({ value, invertColor = false }) => {
  if (value == null) return <span className='text-textDisabled text-sm'>N/A</span>
  const isPositive = value >= 0
  const isGood = invertColor ? !isPositive : isPositive

  return (
    <Chip
      label={fmt.improvement(value)}
      color={isGood ? 'success' : 'error'}
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

const PPCTable2AdMetrics = ({ weeks }) => {
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
      columnHelper.accessor('adClicks', {
        header: 'Ad Clicks',
        cell: ({ row }) => <Typography>{fmt.number(row.original.adClicks)}</Typography>
      }),
      columnHelper.accessor('adSpend', {
        header: 'Ad Spend',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.adSpend)}</Typography>
      }),
      columnHelper.accessor('adOrders', {
        header: 'Ad Orders',
        cell: ({ row }) => <Typography>{fmt.number(row.original.adOrders)}</Typography>
      }),
      columnHelper.accessor('adSales', {
        header: 'Ad Sales',
        cell: ({ row }) => <Typography>{fmt.currency(row.original.adSales)}</Typography>
      }),
      columnHelper.accessor('roas', {
        header: 'ROAS',
        cell: ({ row }) => (
          <Typography color='primary.main' className='font-medium'>
            {fmt.roas(row.original.roas)}
          </Typography>
        )
      }),
      columnHelper.accessor('improvementROAS', {
        header: 'ROAS Δ%',
        cell: ({ row }) => <ImprovementBadge value={row.original.improvementROAS} />,
        enableSorting: false
      }),
      columnHelper.accessor('acos', {
        header: 'ACOS',
        cell: ({ row }) => (
          <Typography color='error.main' className='font-medium'>
            {fmt.percent(row.original.acos)}
          </Typography>
        )
      }),
      columnHelper.accessor('improvementACOS', {
        header: 'ACOS Δ%',
        cell: ({ row }) => <ImprovementBadge value={row.original.improvementACOS} invertColor />,
        enableSorting: false
      }),
      columnHelper.accessor('tacos', {
        header: 'TACOS',
        cell: ({ row }) => (
          <Typography color='warning.main' className='font-medium'>
            {fmt.percent(row.original.tacos)}
          </Typography>
        )
      }),
      columnHelper.accessor('improvementTACOS', {
        header: 'TACOS Δ%',
        cell: ({ row }) => <ImprovementBadge value={row.original.improvementTACOS} invertColor />,
        enableSorting: false
      }),
      columnHelper.accessor('campaignStatusSP', {
        header: 'SP Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.campaignStatusSP}
            color={row.original.campaignStatusSP === 'Active' ? 'success' : 'secondary'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('campaignStatusSB', {
        header: 'SB Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.campaignStatusSB}
            color={row.original.campaignStatusSB === 'Active' ? 'success' : 'secondary'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('campaignStatusSD', {
        header: 'SD Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.campaignStatusSD}
            color={row.original.campaignStatusSD === 'Active' ? 'success' : 'secondary'}
            variant='tonal'
            size='small'
          />
        )
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

          exportToCSV(weeks, TABLE2_COLUMNS, 'ppc-table2-ad-metrics', periodContext)
        }
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Part 2 — PPC Performance & Efficiency'
        subheader='Weekly ad performance with ROAS, ACOS, TACOS and improvement tracking'
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

export default PPCTable2AdMetrics
