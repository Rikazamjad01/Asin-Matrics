'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ButtonGroup from '@mui/material/ButtonGroup'
import Chip from '@mui/material/Chip'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useTheme } from '@mui/material'

import { rgbaToHex } from '@/utils/rgbaToHex'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Supabase client
import { supabase } from '@/utils/supabase/client'

// Removed mock seriesByYear

const SalesAnalytics = () => {
  // States
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [events, setEvents] = useState([])

  // Hooks
  const theme = useTheme()

  // Vars
  const dropdownOptions = [`${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`, 'All Time']

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('financial_events').select('*')

      if (!error && data) {
        setEvents(data)
      }
    }

    fetchData()
  }, [])

  // Get current series based on selected year
  const selectedYear = dropdownOptions[selectedIndex]

  // Map events to dynamic monthly heatmap
  const getDynamicSeries = () => {
    // group by product/seller_sku
    const seriesMap = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    events.forEach(e => {
      const date = new Date(e.posted_date)

      if (selectedYear !== 'All Time' && date.getFullYear().toString() !== selectedYear) return

      const month = months[date.getMonth()]
      const sku = e.seller_sku || 'Unknown'

      if (!seriesMap[sku]) {
        seriesMap[sku] = {}
        months.forEach(m => (seriesMap[sku][m] = 0))
      }

      // Add revenue to that cell mapping
      seriesMap[sku][month] += Number(e.revenue) || 0
    })

    const finalSeries = Object.keys(seriesMap).map(sku => {
      return {
        name: sku,
        data: months.map(m => ({ x: m, y: Math.round(seriesMap[sku][m]) }))
      }
    })

    if (finalSeries.length === 0) {
      // Return empty skeleton to prevent crash
      return [{ name: 'No Data', data: months.map(m => ({ x: m, y: 0 })) }]
    }

    return finalSeries
  }

  const currentSeries = getDynamicSeries()

  // Refs
  const anchorRef = useRef(null)

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const options = {
    chart: {
      offsetX: 3,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    stroke: {
      width: 5,
      colors: ['var(--mui-palette-background-paper)']
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-primary-main)'],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: {
      padding: {
        top: -30,
        right: 25,
        bottom: 3
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      crosshairs: { stroke: { color: 'transparent' } },
      labels: {
        style: {
          fontSize: '15px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '15px',
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: 'Public Sans'
        }
      }
    },
    plotOptions: {
      heatmap: {
        radius: 6,
        enableShades: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 1000,
              name: '1K',
              color: rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 0.2)`)
            },
            {
              from: 1001,
              to: 2000,
              name: '2K',
              color: rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 0.4)`)
            },
            {
              from: 2001,
              to: 3000,
              name: '3K',
              color: rgbaToHex(`rgb(${theme.palette.primary.mainChannel} / 0.6)`)
            },
            {
              from: 3001,
              to: 4000,
              name: '4K',
              color: theme.palette.primary.main
            }
          ]
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Sales Analytics'
        subheader={
          <div className='flex gap-x-2 mbs-1'>
            <Typography>Monthly Revenue Heatmap from FBA</Typography>
          </div>
        }
        action={
          <>
            <ButtonGroup variant='tonal' size='small' ref={anchorRef} aria-label='split button'>
              <Button>{dropdownOptions[selectedIndex]}</Button>
              <Button
                className='pli-0 plb-[5px]'
                aria-haspopup='menu'
                onClick={handleToggle}
                aria-label='select merge strategy'
                aria-expanded={open ? 'true' : undefined}
                aria-controls={open ? 'split-button-menu' : undefined}
              >
                <i className='bx-chevron-down text-xl' />
              </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition placement='bottom-end'>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom' }}
                >
                  <Paper className='shadow-lg'>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id='split-button-menu'>
                        {dropdownOptions.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={event => handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        }
      />
      <CardContent>
        <AppReactApexCharts type='heatmap' height={345} width='100%' series={currentSeries} options={options} />
      </CardContent>
    </Card>
  )
}

export default SalesAnalytics
