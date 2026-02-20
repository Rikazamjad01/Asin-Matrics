'use client'

import { useState, useMemo } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import SectionFilter from './SectionFilter'

// Mock Data
import { getInventoryData } from '@/libs/overview/overviewMockData'

const InventoryPlanningSection = () => {
  const router = useRouter()
  const [product, setProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  const data = useMemo(() => getInventoryData(product, dateRange), [product, dateRange])

  const tiles = [
    { icon: 'bx-package', color: 'primary', label: 'Current Stock', value: data.currentStock.toLocaleString() },
    { icon: 'bx-calendar', color: 'info', label: 'Days of Supply', value: data.daysOfSupply },
    {
      icon: 'bx-error-circle',
      color: 'error',
      label: 'ASINs Needing Reorder',
      value: data.asinsNeedingReorder
    },
    { icon: 'bx-time-five', color: 'warning', label: 'Avg Lead Time', value: data.avgLeadTime }
  ]

  return (
    <Card>
      <CardHeader
        title='Inventory Planning Snapshot'
        subheader='Stock levels, reorder alerts & forecasted stock-out dates'
        action={
          <SectionFilter
            product={product}
            onProductChange={setProduct}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        }
      />
      <Divider />
      <CardContent>
        {/* KPI Tiles */}
        <Grid container spacing={4} className='mbe-5'>
          {tiles.map((tile, i) => (
            <Grid key={i} size={{ xs: 6, sm: 3 }}>
              <Box className='flex items-center gap-3 p-3 rounded bg-actionHover'>
                <CustomAvatar size={40} variant='rounded' skin='light' color={tile.color}>
                  <i className={`${tile.icon} text-lg`} />
                </CustomAvatar>
                <div>
                  <Typography variant='caption' color='text.disabled'>
                    {tile.label}
                  </Typography>
                  <Typography variant='h6' className='font-semibold leading-tight'>
                    {tile.value}
                  </Typography>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Inventory Alert */}
        <Box className='mbe-5'>
          <div className='flex items-center justify-between mbe-3'>
            <Typography variant='subtitle2' color='text.secondary'>
              Inventory Alerts
            </Typography>
            <Button variant='tonal' color='warning' size='small'>
              View Details
            </Button>
          </div>
          {data.inventoryAlerts.map((alert, i) => (
            <Box
              key={i}
              className='flex items-center gap-3 p-3 rounded mbe-2'
              sx={{ bgcolor: alert.severity === 'error' ? 'error.lightOpacity' : 'warning.lightOpacity' }}
            >
              <i
                className={`bx-${alert.severity === 'error' ? 'error' : 'info-circle'} text-xl`}
                style={{
                  color:
                    alert.severity === 'error' ? 'var(--mui-palette-error-main)' : 'var(--mui-palette-warning-main)'
                }}
              />
              <div>
                <Typography variant='body2' className='font-medium'>
                  {alert.asin}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {alert.message}
                </Typography>
              </div>
            </Box>
          ))}
        </Box>

        {/* Forecasted Stock-out Dates */}
        <Typography variant='subtitle2' color='text.secondary' className='mbe-3'>
          Forecasted Stock-out Dates
        </Typography>
        <Grid container spacing={3} className='mbe-5'>
          {data.forecastedStockOutDates.map((item, i) => (
            <Grid key={i} size={{ xs: 12, sm: 4 }}>
              <Box className='p-3 rounded bg-actionHover'>
                <Typography variant='body2' className='font-medium'>
                  {item.product}
                </Typography>
                <Typography variant='caption' color='text.disabled'>
                  {item.asin}
                </Typography>
                <div className='mbs-1'>
                  <Chip label={item.date} size='small' variant='tonal' color='error' />
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Navigate Button */}
        <div className='flex justify-end'>
          <Button
            variant='contained'
            endIcon={<i className='bx-right-arrow-alt' />}
            onClick={() => router.push('/en/dashboards/inventory')}
          >
            Go to Inventory Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default InventoryPlanningSection
