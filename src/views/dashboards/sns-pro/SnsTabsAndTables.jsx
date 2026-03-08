// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'

// Component Imports
import SnsAsinTable from '@/views/dashboards/sns-pro/SnsAsinTable'

const CustomTabList = styled(TabList)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
}))

const SnsTabsAndTables = ({ productData, dateRange, metricsData, inventoryData }) => {
  const [activeTab, setActiveTab] = useState('asin-breakdown')

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Card>
      <TabContext value={activeTab}>
        <CustomTabList onChange={handleTabChange} variant='scrollable' allowScrollButtonsMobile>
          <Tab
            icon={<i className='bx-list-ul' />}
            iconPosition='start'
            value='asin-breakdown'
            label='ASIN Wise Breakdown'
          />
          <Tab icon={<i className='bx-line-chart' />} iconPosition='start' value='sns-trends' label='S&S Trends' />
          <Tab
            icon={<i className='bx-calendar-alt' />}
            iconPosition='start'
            value='weekly-analysis'
            label='Weekly Analysis'
          />
          <Tab
            icon={<i className='bx-bar-chart-square' />}
            iconPosition='start'
            value='revenue-forecast'
            label='Revenue Forecast'
          />
        </CustomTabList>

        <TabPanel value='asin-breakdown' className='p-0'>
          <SnsAsinTable inventoryData={inventoryData} />
        </TabPanel>

        <TabPanel value='sns-trends' className='p-6 text-center'>
          <i className='bx-bar-chart-alt-2 text-6xl text-textSecondary mb-4' />
          <h4>S&S Trends Data will appear here</h4>
        </TabPanel>

        <TabPanel value='weekly-analysis' className='p-6 text-center'>
          <i className='bx-calendar-check text-6xl text-textSecondary mb-4' />
          <h4>Weekly Analysis Data will appear here</h4>
        </TabPanel>

        <TabPanel value='revenue-forecast' className='p-6'>
          {metricsData && metricsData.length > 0 ? (
            <div className='flex flex-col gap-4'>
              <h4>Account-Level Subscription Forecast</h4>
              <div className='flex gap-6 mt-2'>
                <div className='flex flex-col border p-4 rounded'>
                  <span className='text-sm text-textSecondary'>30 Days</span>
                  <span className='text-lg font-bold text-primary'>
                    ${Number(metricsData[0].forecasted_shipped_subscription_revenue_30 || 0).toLocaleString()}
                  </span>
                  <span className='text-xs text-textDisabled'>
                    {Number(metricsData[0].forecasted_shipped_subscription_units_30 || 0).toLocaleString()} units
                  </span>
                </div>
                <div className='flex flex-col border p-4 rounded'>
                  <span className='text-sm text-textSecondary'>60 Days</span>
                  <span className='text-lg font-bold text-primary'>
                    ${Number(metricsData[0].forecasted_shipped_subscription_revenue_60 || 0).toLocaleString()}
                  </span>
                  <span className='text-xs text-textDisabled'>
                    {Number(metricsData[0].forecasted_shipped_subscription_units_60 || 0).toLocaleString()} units
                  </span>
                </div>
                <div className='flex flex-col border p-4 rounded'>
                  <span className='text-sm text-textSecondary'>90 Days</span>
                  <span className='text-lg font-bold text-primary'>
                    ${Number(metricsData[0].forecasted_shipped_subscription_revenue_90 || 0).toLocaleString()}
                  </span>
                  <span className='text-xs text-textDisabled'>
                    {Number(metricsData[0].forecasted_shipped_subscription_units_90 || 0).toLocaleString()} units
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center'>
              <i className='bx-trending-up text-6xl text-textSecondary mb-4' />
              <h4>No Forecast Data Available. Sync S&S Metrics first.</h4>
            </div>
          )}
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default SnsTabsAndTables
