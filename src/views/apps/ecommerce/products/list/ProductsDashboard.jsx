'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'

// Component Imports
import GlobalTimeFilter from '@/components/GlobalTimeFilter'
import ProductsKpiSection from './ProductsKpiSection'
import ProductListTable from './ProductListTable'
import AnalyticsTable from './AnalyticsTable'
import AiInsightsTable from './AiInsightsTable'
import ForecastTable from './ForecastTable'

// Styled TabList wrapper
const CustomTabList = styled(TabList)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
}))

const ProductsDashboard = ({ initialData }) => {
  // State for filter and tabs
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)
  const [activeTab, setActiveTab] = useState('products')

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* 1. Header & Filter */}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <Typography variant='h5' fontWeight={700}>
            Products Dashboard
          </Typography>
          <GlobalTimeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
          />
        </div>
      </Grid>

      {/* 2. KPI Section */}
      <Grid size={{ xs: 12 }}>
        <ProductsKpiSection dateRange={dateRange} />
      </Grid>

      {/* 3. Tabs & Tables */}
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <CustomTabList onChange={handleTabChange} variant='scrollable' allowScrollButtonsMobile>
            <Tab icon={<i className='bx-package' />} iconPosition='start' value='products' label='Products' />
            <Tab icon={<i className='bx-line-chart' />} iconPosition='start' value='analytics' label='Analytics' />
            <Tab icon={<i className='bx-bulb' />} iconPosition='start' value='insights' label='AI Insights' />
            <Tab icon={<i className='bx-calendar' />} iconPosition='start' value='forecast' label='Forecast' />
          </CustomTabList>

          <TabPanel value='products' className='p-0'>
            <ProductListTable productData={initialData} />
          </TabPanel>
          <TabPanel value='analytics' className='p-0'>
            <AnalyticsTable dateRange={dateRange} />
          </TabPanel>
          <TabPanel value='insights' className='p-0'>
            <AiInsightsTable />
          </TabPanel>
          <TabPanel value='forecast' className='p-0'>
            <ForecastTable dateRange={dateRange} />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ProductsDashboard
