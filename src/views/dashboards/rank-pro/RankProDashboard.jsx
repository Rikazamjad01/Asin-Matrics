'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

// Utility Imports
import classnames from 'classnames'

// MUI Imports
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import RankProKeywordSlab from './RankProKeywordSlab'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

const CustomTabList = styled(TabList)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
}))

const KpiTile = ({ title, value, subtitle, icon, color }) => (
  <Card className='flex-1 min-w-[200px]'>
    <CardContent className='flex items-center gap-3 p-4'>
      <CustomAvatar size={46} variant='rounded' skin='light' color={color}>
        <i className={classnames(icon, 'text-2xl')} />
      </CustomAvatar>
      <div>
        <Typography variant='caption' color='text.secondary' className='font-medium uppercase tracking-wide'>
          {title}
        </Typography>
        <Typography variant='h5' className='font-bold leading-tight my-0.5'>
          {value}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {subtitle}
        </Typography>
      </div>
    </CardContent>
  </Card>
)

const RankProDashboard = () => {
  const [activeAsin, setActiveAsin] = useState('asin1')
  const [dateRange, setDateRange] = useState('7d')
  const [customDateRange, setCustomDateRange] = useState(null)
  const [activeKeywordTab, setActiveKeywordTab] = useState('all')
  const [activeSectionTab, setActiveSectionTab] = useState('tracking')

  return (
    <Grid container spacing={6}>
      {/* Header & ASIN / Filters */}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex flex-col'>
            <Typography variant='h5' fontWeight={700}>
              ASIN Matrics Rank Pro
            </Typography>
            <Typography variant='subtitle1' color='text.secondary'>
              Amazon keyword Rank Trackor
            </Typography>
          </div>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Typography className='font-medium' sx={{ mr: 2 }}>
                Select ASIN:
              </Typography>
              <TabContext value={activeAsin}>
                <CustomTabList
                  onChange={(e, val) => setActiveAsin(val)}
                  variant='scrollable'
                  scrollButtons='auto'
                  sx={{ mb: 0, borderBottom: 'none' }}
                >
                  <Tab label='B0CX23LKWM' value='asin1' />
                  <Tab label='B0D9PRQ37Y' value='asin2' />
                  <Tab label='B0BXMLKK3N' value='asin3' />
                </CustomTabList>
              </TabContext>
            </div>
            <GlobalTimeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              customDateRange={customDateRange}
              onCustomDateRangeChange={setCustomDateRange}
            />
          </div>
        </div>
      </Grid>

      {/* 5 KPI Tiles */}
      <Grid size={{ xs: 12 }}>
        <div className='flex flex-wrap gap-4'>
          <KpiTile title='Tracked' value='142' subtitle='Active monitoring' icon='bx-target-lock' color='primary' />
          <KpiTile title='#1-5' value='28' subtitle='Prime positions' icon='bx-trophy' color='warning' />
          <KpiTile title='#6-20' value='45' subtitle='Visible results' icon='bx-show' color='info' />
          <KpiTile title='#21-100' value='56' subtitle='Improvement Needed' icon='bx-trending-up' color='secondary' />
          <KpiTile title='Out' value='13' subtitle='Need optimization' icon='bx-error-circle' color='error' />
        </div>
      </Grid>

      {/* 2 Velocity / Opt Score Tiles */}
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent className='flex items-center gap-4'>
                <CustomAvatar size={54} variant='rounded' skin='light' color='primary'>
                  <i className='bx-tachometer text-3xl' />
                </CustomAvatar>
                <div className='flex-1'>
                  <Typography variant='h6' className='mb-2'>
                    7-day Velocity
                  </Typography>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-col items-start gap-1.5'>
                      <Typography variant='body1' className='font-bold'>
                        34
                      </Typography>
                      <Typography component='div' variant='body2' className='font-bold flex items-center gap-2'>
                        <CustomAvatar size={24} color='success' skin='light' variant='rounded'>
                          <i className='bx-trending-up text-sm' />
                        </CustomAvatar>{' '}
                        Improved
                      </Typography>
                    </div>
                    <div className='flex flex-col items-start gap-1.5'>
                      <Typography variant='body1' className='font-bold'>
                        85
                      </Typography>
                      <Typography component='div' variant='body2' className='font-bold flex items-center gap-2'>
                        <CustomAvatar size={24} color='warning' skin='light' variant='rounded'>
                          <i className='bx-minus text-sm' />
                        </CustomAvatar>{' '}
                        Stable
                      </Typography>
                    </div>
                    <div className='flex flex-col items-start gap-1.5'>
                      <Typography variant='body1' className='font-bold'>
                        23
                      </Typography>
                      <Typography component='div' variant='body2' className='font-bold flex items-center gap-2'>
                        <CustomAvatar size={24} color='error' skin='light' variant='rounded'>
                          <i className='bx-trending-down text-sm' />
                        </CustomAvatar>{' '}
                        Declined
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent className='flex items-center gap-4'>
                <CustomAvatar size={54} variant='rounded' skin='light' color='success'>
                  <i className='bx-check-shield text-3xl' />
                </CustomAvatar>
                <div className='flex-1'>
                  <div className='flex items-center justify-between mb-5'>
                    <Typography variant='h6'>Optimization Score</Typography>
                    <Typography variant='h5' className='font-bold text-success'>
                      85/100
                    </Typography>
                  </div>
                  <LinearProgress variant='determinate' value={85} color='success' className='bs-2 rounded-sm mb-1' />
                  <Typography variant='caption' color='text.secondary'>
                    Excellent portfolio Health
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Keyword Filter Tabs + Add Button */}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <TabContext value={activeKeywordTab}>
            <CustomTabList
              onChange={(e, val) => setActiveKeywordTab(val)}
              variant='scrollable'
              scrollButtons='auto'
              sx={{ mb: 0, borderBottom: 'none' }}
            >
              <Tab label='All Keywords' value='all' />
              <Tab label='Top 5' value='top5' />
              <Tab label='Top 20' value='top20' />
              <Tab label='Unranked' value='unranked' />
            </CustomTabList>
          </TabContext>
          <Button variant='contained' startIcon={<i className='bx-plus' />}>
            Add Keyword
          </Button>
        </div>
      </Grid>

      {/* Three Main Tabs */}
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeSectionTab}>
          <CustomTabList onChange={(e, val) => setActiveSectionTab(val)} variant='scrollable'>
            <Tab icon={<i className='bx-list-ul' />} iconPosition='start' value='tracking' label='Keyword Tracking' />
            <Tab icon={<i className='bx-bar-chart-alt-2' />} iconPosition='start' value='analytics' label='Analytics' />
            <Tab icon={<i className='bx-bulb' />} iconPosition='start' value='insights' label='Ai Insights' />
          </CustomTabList>

          <TabPanel value='tracking' className='p-0'>
            <Card>
              <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                  <thead>
                    <tr>
                      <th className='text-center'>Rank</th>
                      <th>Keyword</th>
                      <th>Search Volume</th>
                      <th>Difficulty</th>
                      <th>Target</th>
                      <th>Change</th>
                      <th>7D Trend</th>
                      <th className='text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <RankProKeywordSlab
                      rank={3}
                      change='+2'
                      changeType='up'
                      keyword='wireless earbuds'
                      searchVolume='12,500'
                      difficulty={65}
                      targetRank={1}
                      away={2}
                      history={[20, 30, 40, 60, 50, 40, 30]} // example bar heights
                    />
                    <RankProKeywordSlab
                      rank={12}
                      change='-4'
                      changeType='down'
                      keyword='bluetooth headphones over ear'
                      searchVolume='8,200'
                      difficulty={82}
                      targetRank={5}
                      away={7}
                      history={[60, 50, 45, 40, 30, 20, 15]}
                    />
                    <RankProKeywordSlab
                      rank={1}
                      change='-'
                      changeType='stable'
                      keyword='noise cancelling earbuds'
                      searchVolume='24,100'
                      difficulty={91}
                      targetRank={1}
                      away={0}
                      history={[80, 80, 80, 80, 80, 80, 80]}
                    />
                  </tbody>
                </table>
              </div>
            </Card>
          </TabPanel>
          <TabPanel value='analytics' className='p-0'>
            <Card>
              <CardContent>
                <Typography>Analytics Content Here...</Typography>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value='insights' className='p-0'>
            <Card>
              <CardContent>
                <Typography>AI Insights Content Here...</Typography>
              </CardContent>
            </Card>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default RankProDashboard
