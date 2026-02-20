'use client'

// React Imports
import { useRef, useState } from 'react'

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

// Mock data for different years
const seriesByYear = {
  2024: [
    {
      name: '1k',
      data: [
        { x: 'Jan', y: '250' },
        { x: 'Feb', y: '350' },
        { x: 'Mar', y: '220' },
        { x: 'Apr', y: '290' },
        { x: 'May', y: '650' },
        { x: 'Jun', y: '260' },
        { x: 'Jul', y: '274' },
        { x: 'Aug', y: '850' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '2k',
      data: [
        { x: 'Jan', y: '750' },
        { x: 'Feb', y: '3350' },
        { x: 'Mar', y: '1220' },
        { x: 'Apr', y: '1290' },
        { x: 'May', y: '1650' },
        { x: 'Jun', y: '1260' },
        { x: 'Jul', y: '1274' },
        { x: 'Aug', y: '850' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '3k',
      data: [
        { x: 'Jan', y: '375' },
        { x: 'Feb', y: '1350' },
        { x: 'Mar', y: '3220' },
        { x: 'Apr', y: '2290' },
        { x: 'May', y: '2650' },
        { x: 'Jun', y: '2260' },
        { x: 'Jul', y: '1274' },
        { x: 'Aug', y: '815' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '4k',
      data: [
        { x: 'Jan', y: '575' },
        { x: 'Feb', y: '1350' },
        { x: 'Mar', y: '2220' },
        { x: 'Apr', y: '3290' },
        { x: 'May', y: '3650' },
        { x: 'Jun', y: '2260' },
        { x: 'Jul', y: '1274' },
        { x: 'Aug', y: '315' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '5k',
      data: [
        { x: 'Jan', y: '875' },
        { x: 'Feb', y: '1350' },
        { x: 'Mar', y: '2220' },
        { x: 'Apr', y: '3290' },
        { x: 'May', y: '3650' },
        { x: 'Jun', y: '2260' },
        { x: 'Jul', y: '1274' },
        { x: 'Aug', y: '965' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '5k+',
      data: [
        { x: 'Jan', y: '575' },
        { x: 'Feb', y: '1350' },
        { x: 'Mar', y: '2220' },
        { x: 'Apr', y: '2290' },
        { x: 'May', y: '2650' },
        { x: 'Jun', y: '3260' },
        { x: 'Jul', y: '1274' },
        { x: 'Aug', y: '815' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '10k+',
      data: [
        { x: 'Jan', y: '575' },
        { x: 'Feb', y: '350' },
        { x: 'Mar', y: '220' },
        { x: 'Apr', y: '290' },
        { x: 'May', y: '650' },
        { x: 'Jun', y: '260' },
        { x: 'Jul', y: '274' },
        { x: 'Aug', y: '815' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    },
    {
      name: '15k+',
      data: [
        { x: 'Jan', y: '575' },
        { x: 'Feb', y: '350' },
        { x: 'Mar', y: '220' },
        { x: 'Apr', y: '290' },
        { x: 'May', y: '650' },
        { x: 'Jun', y: '260' },
        { x: 'Jul', y: '274' },
        { x: 'Aug', y: '815' },
        { x: 'Sep', y: '850' },
        { x: 'Oct', y: '850' },
        { x: 'Nov', y: '850' },
        { x: 'Dec', y: '850' }
      ]
    }
  ],
  2025: [
    {
      name: '1k',
      data: [
        { x: 'Jan', y: '320' },
        { x: 'Feb', y: '420' },
        { x: 'Mar', y: '310' },
        { x: 'Apr', y: '380' },
        { x: 'May', y: '720' },
        { x: 'Jun', y: '340' },
        { x: 'Jul', y: '360' },
        { x: 'Aug', y: '920' },
        { x: 'Sep', y: '910' },
        { x: 'Oct', y: '930' },
        { x: 'Nov', y: '940' },
        { x: 'Dec', y: '950' }
      ]
    },
    {
      name: '2k',
      data: [
        { x: 'Jan', y: '820' },
        { x: 'Feb', y: '3450' },
        { x: 'Mar', y: '1320' },
        { x: 'Apr', y: '1390' },
        { x: 'May', y: '1750' },
        { x: 'Jun', y: '1360' },
        { x: 'Jul', y: '1380' },
        { x: 'Aug', y: '950' },
        { x: 'Sep', y: '920' },
        { x: 'Oct', y: '940' },
        { x: 'Nov', y: '960' },
        { x: 'Dec', y: '980' }
      ]
    },
    {
      name: '3k',
      data: [
        { x: 'Jan', y: '450' },
        { x: 'Feb', y: '1450' },
        { x: 'Mar', y: '3320' },
        { x: 'Apr', y: '2390' },
        { x: 'May', y: '2750' },
        { x: 'Jun', y: '2360' },
        { x: 'Jul', y: '1380' },
        { x: 'Aug', y: '920' },
        { x: 'Sep', y: '950' },
        { x: 'Oct', y: '960' },
        { x: 'Nov', y: '970' },
        { x: 'Dec', y: '990' }
      ]
    },
    {
      name: '4k',
      data: [
        { x: 'Jan', y: '680' },
        { x: 'Feb', y: '1450' },
        { x: 'Mar', y: '2320' },
        { x: 'Apr', y: '3390' },
        { x: 'May', y: '3750' },
        { x: 'Jun', y: '2380' },
        { x: 'Jul', y: '1390' },
        { x: 'Aug', y: '420' },
        { x: 'Sep', y: '960' },
        { x: 'Oct', y: '980' },
        { x: 'Nov', y: '1000' },
        { x: 'Dec', y: '1020' }
      ]
    },
    {
      name: '5k',
      data: [
        { x: 'Jan', y: '980' },
        { x: 'Feb', y: '1480' },
        { x: 'Mar', y: '2350' },
        { x: 'Apr', y: '3420' },
        { x: 'May', y: '3780' },
        { x: 'Jun', y: '2420' },
        { x: 'Jul', y: '1420' },
        { x: 'Aug', y: '1080' },
        { x: 'Sep', y: '1000' },
        { x: 'Oct', y: '1020' },
        { x: 'Nov', y: '1040' },
        { x: 'Dec', y: '1060' }
      ]
    },
    {
      name: '5k+',
      data: [
        { x: 'Jan', y: '690' },
        { x: 'Feb', y: '1480' },
        { x: 'Mar', y: '2380' },
        { x: 'Apr', y: '2450' },
        { x: 'May', y: '2820' },
        { x: 'Jun', y: '3420' },
        { x: 'Jul', y: '1450' },
        { x: 'Aug', y: '950' },
        { x: 'Sep', y: '1010' },
        { x: 'Oct', y: '1030' },
        { x: 'Nov', y: '1050' },
        { x: 'Dec', y: '1070' }
      ]
    },
    {
      name: '10k+',
      data: [
        { x: 'Jan', y: '720' },
        { x: 'Feb', y: '480' },
        { x: 'Mar', y: '350' },
        { x: 'Apr', y: '420' },
        { x: 'May', y: '780' },
        { x: 'Jun', y: '380' },
        { x: 'Jul', y: '390' },
        { x: 'Aug', y: '980' },
        { x: 'Sep', y: '1020' },
        { x: 'Oct', y: '1040' },
        { x: 'Nov', y: '1060' },
        { x: 'Dec', y: '1080' }
      ]
    },
    {
      name: '15k+',
      data: [
        { x: 'Jan', y: '690' },
        { x: 'Feb', y: '450' },
        { x: 'Mar', y: '320' },
        { x: 'Apr', y: '390' },
        { x: 'May', y: '750' },
        { x: 'Jun', y: '350' },
        { x: 'Jul', y: '370' },
        { x: 'Aug', y: '950' },
        { x: 'Sep', y: '1000' },
        { x: 'Oct', y: '1020' },
        { x: 'Nov', y: '1040' },
        { x: 'Dec', y: '1060' }
      ]
    }
  ]
}

const SalesAnalytics = () => {
  // States
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(1)

  // Hooks
  const theme = useTheme()

  // Vars
  const dropdownOptions = [`${new Date().getFullYear() - 1}`, `${new Date().getFullYear()}`, 'Custom Range']

  // Get current series based on selected year
  const currentSeries = seriesByYear[dropdownOptions[selectedIndex]] || seriesByYear['2025']

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
            <Chip label='+42.6%' color='success' size='small' variant='tonal' />
            <Typography>Than last year</Typography>
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
