'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'

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

// Mock order product data
const orderData = [
  {
    productName: 'OnePlus 7 Pro',
    productImage: '/images/apps/ecommerce/product-21.png',
    brand: 'OnePlus',
    price: 799,
    quantity: 1,
    total: 799
  },
  {
    productName: 'Magic Mouse',
    productImage: '/images/apps/ecommerce/product-22.png',
    brand: 'Google',
    price: 89,
    quantity: 1,
    total: 89
  },
  {
    productName: 'Wooden Chair',
    productImage: '/images/apps/ecommerce/product-23.png',
    brand: 'Insofar',
    price: 289,
    quantity: 2,
    total: 578
  },
  {
    productName: 'Air Jordan',
    productImage: '/images/apps/ecommerce/product-24.png',
    brand: 'Nike',
    price: 299,
    quantity: 2,
    total: 598
  }
]

const columnHelper = createColumnHelper()

const OrderTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data] = useState(...[orderData])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <img src={row.original.productImage} alt={row.original.productName} height={34} className='rounded' />
            <div className='flex flex-col items-start'>
              <Typography variant='body1'>{row.original.productName}</Typography>
              <Typography variant='body2'>{row.original.brand}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => <Typography>{`$${row.original.price}`}</Typography>
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: ({ row }) => <Typography>{`${row.original.quantity}`}</Typography>
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => <Typography>{`$${row.original.total}`}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: data,
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
        pageSize: 10
      }
    },
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

  return (
    <div className='overflow-x-auto'>
      <table className={tableStyles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
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
          <tbody className='border-be'>
            {table
              .getRowModel()
              .rows.slice(0, table.getState().pagination.pageSize)
              .map(row => {
                return (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        )}
      </table>
    </div>
  )
}

const OrderDetailsDrawer = props => {
  // Props
  const { open, handleClose, orderDetails } = props

  const handleReset = () => {
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600, md: 800 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>Order Details - {orderDetails?.order || 'N/A'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        {/* Order Header Info */}
        <div className='flex flex-col gap-4 mb-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='body2' color='text.secondary'>
                Order ID
              </Typography>
              <Typography variant='h6'>{orderDetails?.order}</Typography>
            </div>
            <Chip
              label={orderDetails?.status}
              color={
                orderDetails?.status === 'Delivered'
                  ? 'success'
                  : orderDetails?.status === 'Out for Delivery'
                    ? 'primary'
                    : orderDetails?.status === 'Ready to Pickup'
                      ? 'info'
                      : 'warning'
              }
              variant='tonal'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <Typography variant='body2' color='text.secondary'>
                Customer
              </Typography>
              <Typography variant='body1'>{orderDetails?.customer || 'N/A'}</Typography>
            </div>
            <div>
              <Typography variant='body2' color='text.secondary'>
                Email
              </Typography>
              <Typography variant='body1'>{orderDetails?.email || 'customer@email.com'}</Typography>
            </div>
            <div>
              <Typography variant='body2' color='text.secondary'>
                Order Date
              </Typography>
              <Typography variant='body1'>{orderDetails?.date || 'N/A'}</Typography>
            </div>
            <div>
              <Typography variant='body2' color='text.secondary'>
                Payment Status
              </Typography>
              <Chip
                label={
                  orderDetails?.payment === 1
                    ? 'Paid'
                    : orderDetails?.payment === 2
                      ? 'Pending'
                      : orderDetails?.payment === 3
                        ? 'Failed'
                        : 'Cancelled'
                }
                color={
                  orderDetails?.payment === 1
                    ? 'success'
                    : orderDetails?.payment === 2
                      ? 'warning'
                      : orderDetails?.payment === 3
                        ? 'error'
                        : 'secondary'
                }
                variant='tonal'
                size='small'
              />
            </div>
          </div>
        </div>

        <Divider className='mb-6' />

        {/* Order Items Table */}
        <div className='mb-6'>
          <Typography variant='h6' className='mb-4'>
            Order Items
          </Typography>
          <OrderTable />
        </div>

        {/* Order Summary */}
        <div className='flex justify-end'>
          <div>
            <div className='flex items-center justify-between gap-12 mb-2'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Subtotal:
              </Typography>
              <Typography variant='h6'>$2,093</Typography>
            </div>
            <div className='flex items-center justify-between gap-12 mb-2'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Shipping Fee:
              </Typography>
              <Typography variant='h6'>$2</Typography>
            </div>
            <div className='flex items-center justify-between gap-12 mb-2'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Tax:
              </Typography>
              <Typography variant='h6'>$28</Typography>
            </div>
            <Divider className='my-2' />
            <div className='flex items-center justify-between gap-12'>
              <Typography variant='h6' className='min-is-[100px]'>
                Total:
              </Typography>
              <Typography variant='h6'>$2,113</Typography>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-4 mt-6'>
          <Button variant='contained' onClick={handleReset}>
            Close
          </Button>
          <Button variant='tonal' color='secondary'>
            Print Order
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default OrderDetailsDrawer
