'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
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

// Vars
const productCategoryObj = {
  Accessories: { icon: 'bx-headphone', color: 'error' },
  'Home Decor': { icon: 'bx-home-smile', color: 'info' },
  Electronics: { icon: 'bx-laptop', color: 'primary' },
  Shoes: { icon: 'bx-walk', color: 'success' },
  Office: { icon: 'bx-briefcase', color: 'warning' },
  Games: { icon: 'bx-game', color: 'secondary' }
}

const productStatusObj = {
  Scheduled: { title: 'Scheduled', color: 'warning' },
  Published: { title: 'Publish', color: 'success' },
  Inactive: { title: 'Inactive', color: 'error' }
}

// Column Definitions
const columnHelper = createColumnHelper()

const ProductListTable = ({ inventoryData, financesData, loading }) => {
  // Map real fba_inventory rows to the shape the table columns expect.
  // We use financesData to calculate revenue, fees, and profit.
  const initialData = useMemo(() => {
    return (inventoryData || []).map(item => {
      const sku = item.seller_sku || item.fn_sku || '—'

      // Filter financial events matching this product's SKU
      const productFinances = (financesData || []).filter(f => f.seller_sku === sku || f.seller_sku === item.asin)

      // Aggregate revenue and fees
      const totalRevenue = productFinances.reduce((sum, f) => sum + (Number(f.revenue) || 0), 0)
      const totalFees = Math.abs(productFinances.reduce((sum, f) => sum + (Number(f.fees) || 0), 0))

      // Calculate profit and margin
      const cogs = 0 // Mock COGS for now, would come from another table
      const ppc = 0 // Mock PPC, requires Ads API

      const profit = totalRevenue - totalFees - cogs - ppc
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

      return {
        id: item.id,
        productName: item.product_name || '—',
        productBrand: sku,
        image: '', // No image from API
        asin: item.asin || '—',
        qty: item.total_quantity || 0,
        status: 'Published', // Default — no status field in inventory API

        revenue: totalRevenue,
        cogs: cogs,
        fees: totalFees,
        ppc: ppc,
        acos: 0,
        profit: profit,
        margin: margin
      }
    })
  }, [inventoryData, financesData])

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(initialData)
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Sync state if productData prop changes
  useEffect(() => {
    setData(initialData)
    setFilteredData(initialData)
  }, [initialData])

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      {
        id: 'select',
        size: 48,
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('productName', {
        header: 'Product',
        size: 250,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {row.original.image ? (
              <img src={row.original.image} width={38} height={38} className='rounded bg-actionHover' />
            ) : (
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover'
                }}
              >
                <i className='bx-package text-textSecondary' style={{ fontSize: '1.2rem' }} />
              </Box>
            )}
            <div
              className='flex flex-col no-scrollbar'
              style={{ overflowX: 'auto', whiteSpace: 'nowrap', cursor: 'pointer' }}
            >
              <Typography variant='h6' style={{ display: 'inline' }}>
                {row.original.productName}
              </Typography>
              <br />
              <Typography variant='body2' style={{ display: 'inline' }}>
                {row.original.productBrand}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('asin', {
        header: 'ASIN',
        size: 140,
        cell: ({ row }) => <Typography noWrap>{row.original.asin}</Typography>
      }),
      columnHelper.accessor('qty', {
        header: 'Units',
        size: 80,
        cell: ({ row }) => <Typography>{row.original.qty}</Typography>
      }),
      columnHelper.accessor('revenue', {
        header: 'Revenue',
        size: 100,
        cell: ({ row }) => (
          <Typography>
            ${row.original.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }),
      columnHelper.accessor('cogs', {
        header: 'COGS',
        size: 100,
        cell: ({ row }) => (
          <Chip
            label={`$${row.original.cogs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            variant='tonal'
            color='secondary'
            size='small'
          />
        )
      }),
      columnHelper.accessor('fees', {
        header: 'Fees',
        size: 90,
        cell: ({ row }) => (
          <Typography>
            ${row.original.fees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }),
      columnHelper.accessor('ppc', {
        header: 'PPC',
        size: 90,
        cell: ({ row }) => (
          <Typography>
            ${row.original.ppc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }),
      columnHelper.accessor('acos', {
        header: 'ACOS',
        size: 80,
        cell: ({ row }) => <Typography>{row.original.acos.toFixed(2)}%</Typography>
      }),
      columnHelper.accessor('profit', {
        header: 'Profit',
        size: 100,
        cell: ({ row }) => (
          <Typography color={row.original.profit >= 0 ? 'success.main' : 'error.main'} className='font-medium'>
            ${row.original.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        )
      }),
      columnHelper.accessor('margin', {
        header: 'Margin',
        size: 80,
        cell: ({ row }) => (
          <Typography color={row.original.margin >= 0 ? 'success.main' : 'error.main'} className='font-medium'>
            {row.original.margin.toFixed(2)}%
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        size: 100,
        cell: ({ row }) => (
          <Chip
            label={productStatusObj[row.original.status].title}
            variant='tonal'
            color={productStatusObj[row.original.status].color}
            size='small'
          />
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 25
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loading) {
    return (
      <Box className='flex justify-center items-center p-20'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' />
        <TableFilters setData={setFilteredData} productData={data} />
        <Divider />
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
              {/* <MenuItem value='10'>10</MenuItem> */}
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
            <Button color='secondary' variant='tonal' startIcon={<i className='bx-export' />}>
              Export
            </Button>
            <Button
              variant='contained'
              component={Link}
              href={getLocalizedUrl('/apps/ecommerce/products/add', locale)}
              startIcon={<i className='bx-plus' />}
            >
              Add Product
            </Button>
          </div>
        </div>
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
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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
                    )
                  })}
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
    </>
  )
}

export default ProductListTable
