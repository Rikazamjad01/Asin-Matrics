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
import ReviewsAsinTable from '@/views/dashboards/reviews/ReviewsAsinTable'

const CustomTabList = styled(TabList)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
}))

const ReviewsTabsAndTables = ({ productData, dateRange }) => {
  const [activeTab, setActiveTab] = useState('review-breakdown')

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
            value='review-breakdown'
            label='Product Wise Reviews'
          />
          <Tab
            icon={<i className='bx-line-chart' />}
            iconPosition='start'
            value='sentiment-trends'
            label='Sentiment Trends'
          />
          <Tab
            icon={<i className='bx-chat' />}
            iconPosition='start'
            value='keyword-analysis'
            label='Keyword Analysis'
          />
          <Tab
            icon={<i className='bx-pie-chart-alt' />}
            iconPosition='start'
            value='rating-breakdown'
            label='Global Rating Breakdown'
          />
        </CustomTabList>

        <TabPanel value='review-breakdown' className='p-0'>
          <ReviewsAsinTable productData={productData} />
        </TabPanel>

        <TabPanel value='sentiment-trends' className='p-6 text-center'>
          <i className='bx-bar-chart-alt-2 text-6xl text-textSecondary mb-4' />
          <h4>Sentiment Trends Data will appear here</h4>
        </TabPanel>

        <TabPanel value='keyword-analysis' className='p-6 text-center'>
          <i className='bx-brain text-6xl text-textSecondary mb-4' />
          <h4>AI Keyword Analysis will appear here</h4>
        </TabPanel>

        <TabPanel value='rating-breakdown' className='p-6 text-center'>
          <i className='bx-pie-chart text-6xl text-textSecondary mb-4' />
          <h4>Detailed Rating Breakdown will appear here</h4>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default ReviewsTabsAndTables
