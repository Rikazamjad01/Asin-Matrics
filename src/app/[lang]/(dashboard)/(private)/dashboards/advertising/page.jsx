'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'

// MUI Lab Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

// PPC Table Components
import PPCTable1SalesOrganic from '@/views/dashboards/ppc/PPCTable1SalesOrganic'
import PPCTable2AdMetrics from '@/views/dashboards/ppc/PPCTable2AdMetrics'
import PPCTable3CampaignBreakdown from '@/views/dashboards/ppc/PPCTable3CampaignBreakdown'
import PPCTable4SPSegmentation from '@/views/dashboards/ppc/PPCTable4SPSegmentation'

// Filter Service
import { getWeeksForPreset, DATE_RANGE_PRESETS } from '@/libs/ppc/filterService'

const DashboardAdvertising = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('1')

  // Date preset filter
  const [anchorEl, setAnchorEl] = useState(null)
  const [preset, setPreset] = useState('last8')

  const weeks = useMemo(() => getWeeksForPreset(preset), [preset])
  const presetLabel = DATE_RANGE_PRESETS.find(p => p.value === preset)?.label || 'Last 8 Weeks'

  return (
    <Grid container spacing={6}>
      {/* Page Header */}
      <Grid size={{ xs: 12 }} className='flex items-center justify-between'>
        <div>
          <Typography variant='h5' fontWeight={700}>
            PPC Dashboard
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Full Amazon PPC Template — Parts 1, 2, 3 & 5
          </Typography>
        </div>
        <Button
          variant='outlined'
          onClick={e => setAnchorEl(e.currentTarget)}
          endIcon={<i className='bx-chevron-down text-xl' />}
          className='min-w-[160px]'
        >
          {presetLabel}
        </Button>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {DATE_RANGE_PRESETS.map(p => (
            <MenuItem
              key={p.value}
              onClick={() => {
                setPreset(p.value)
                setAnchorEl(null)
              }}
              selected={preset === p.value}
            >
              {p.label}
            </MenuItem>
          ))}
        </Menu>
      </Grid>

      {/* Tabbed Tables — One table per tab */}
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <TabList onChange={(_, newValue) => setActiveTab(newValue)} variant='scrollable' scrollButtons='auto'>
            <Tab label='Part 1 — Organic & General' value='1' />
            <Tab label='Part 2 — PPC Performance' value='2' />
            <Tab label='Part 3 — Campaign Breakdown' value='3' />
            <Tab label='Part 5 — Branded vs Non-Branded' value='4' />
          </TabList>

          <TabPanel value='1' sx={{ p: 0, pt: 3 }}>
            <PPCTable1SalesOrganic weeks={weeks} />
          </TabPanel>

          <TabPanel value='2' sx={{ p: 0, pt: 3 }}>
            <PPCTable2AdMetrics weeks={weeks} />
          </TabPanel>

          <TabPanel value='3' sx={{ p: 0, pt: 3 }}>
            <PPCTable3CampaignBreakdown weeks={weeks} />
          </TabPanel>

          <TabPanel value='4' sx={{ p: 0, pt: 3 }}>
            <PPCTable4SPSegmentation weeks={weeks} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default DashboardAdvertising
