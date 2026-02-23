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
import { getWeeksForPreset } from '@/libs/ppc/filterService'

// Section Filter
import SectionFilter from '@/views/dashboards/overview/SectionFilter'

// Libs
import { enrichAllWeeks } from '@/libs/ppc/calculationEngine'

// Multiplier for mock data scaling (matches overview page)
const productMultiplier = {
  all: 1,
  'asin-1': 0.45,
  'asin-2': 0.32,
  'asin-3': 0.23
}

const PPCDashboard = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('1')

  // Filter state
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)

  // Filtered/Scaled data
  const weeks = useMemo(() => {
    const rawWeeks = getWeeksForPreset(dateRange)
    const k = productMultiplier[selectedProduct] ?? 1

    if (k === 1) return rawWeeks

    // Scale raw values
    const scaled = rawWeeks.map(w => ({
      ...w,
      sessions: Math.round(w.sessions * k),
      totalOrders: Math.round(w.totalOrders * k),
      totalSales: Math.round(w.totalSales * k),
      ntbCustomers: Math.round(w.ntbCustomers * k),
      ntbOrders: Math.round(w.ntbOrders * k),
      ntbSales: Math.round(w.ntbSales * k),
      repeatCustomers: Math.round(w.repeatCustomers * k),
      repeatOrders: Math.round(w.repeatOrders * k),
      repeatSales: Math.round(w.repeatSales * k),
      organicOrders: Math.round(w.organicOrders * k),
      adClicks: Math.round(w.adClicks * k),
      adSpend: Math.round(w.adSpend * k),
      adOrders: Math.round(w.adOrders * k),
      adSales: Math.round(w.adSales * k),
      sp: {
        clicks: Math.round(w.sp.clicks * k),
        spend: Math.round(w.sp.spend * k),
        orders: Math.round(w.sp.orders * k),
        revenue: Math.round(w.sp.revenue * k)
      },
      sb: {
        clicks: Math.round(w.sb.clicks * k),
        spend: Math.round(w.sb.spend * k),
        orders: Math.round(w.sb.orders * k),
        revenue: Math.round(w.sb.revenue * k)
      },
      sd: {
        clicks: Math.round(w.sd.clicks * k),
        spend: Math.round(w.sd.spend * k),
        orders: Math.round(w.sd.orders * k),
        revenue: Math.round(w.sd.revenue * k)
      },
      nonBranded: {
        spend: Math.round(w.nonBranded.spend * k),
        sales: Math.round(w.nonBranded.sales * k)
      },
      branded: {
        spend: Math.round(w.branded.spend * k),
        sales: Math.round(w.branded.sales * k)
      }
    }))

    // Re-enrich to recalculate KPIs (ROAS, etc.)
    return enrichAllWeeks(scaled)
  }, [selectedProduct, dateRange])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }} className='flex items-center justify-between flex-wrap gap-4'>
        <div>
          <Typography variant='h5' fontWeight={700}>
            PPC Dashboard
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Full Amazon PPC Template
          </Typography>
        </div>
        <SectionFilter
          product={selectedProduct}
          onProductChange={setSelectedProduct}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      </Grid>

      {/* Tabbed Tables — One table per tab */}
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <TabList onChange={(_, newValue) => setActiveTab(newValue)} variant='scrollable' scrollButtons='auto'>
            <Tab label='Organic & General' value='1' />
            <Tab label='PPC Performance' value='2' />
            <Tab label='Campaign Breakdown' value='3' />
            <Tab label='Branded vs Non-Branded' value='4' />
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

export default PPCDashboard
