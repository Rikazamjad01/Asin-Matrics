'use client'

import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'
import SectionFilter from './SectionFilter'

// Mock Data
import { getKpiData } from '@/libs/overview/overviewMockData'

// Calculation Engine
import { fmt } from '@/libs/ppc/calculationEngine'

const PpcPerformanceSection = () => {
  // KPI Section filter state
  const [product, setProduct] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  // Filtered KPI data
  const agg = useMemo(() => getKpiData(product, dateRange), [product, dateRange])

  if (!agg) return null

  return (
    <Card>
      <CardHeader
        title='PPC Performance Overview'
        subheader='Key advertising metrics for the selected product and period'
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
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Total Sales'
              imageSrc='/images/cards/wallet-info-bg.png'
              stats={fmt.currency(agg.totalSales)}
              trendNumber={5.2}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Total Orders'
              imageSrc='/images/cards/mac-warning-bg.png'
              stats={fmt.number(agg.totalOrders)}
              trendNumber={3.8}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Ad Spend'
              imageSrc='/images/cards/credit-card-warning-bg.png'
              stats={fmt.currency(agg.adSpend)}
              trendNumber={1.2}
              trend='negative'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='ROAS'
              imageSrc='/images/cards/chart-success-bg.png'
              stats={fmt.roas(agg.roas)}
              trendNumber={4.1}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='ACOS'
              imageSrc='/images/cards/wallet-primary-bg.png'
              stats={fmt.percent(agg.acos)}
              trendNumber={2.3}
              trend='negative'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='TACOS'
              imageSrc='/images/cards/briefcase-primary-bg.png'
              stats={fmt.percent(agg.tacos)}
              trendNumber={1.5}
              trend='negative'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Organic Sales'
              imageSrc='/images/cards/wallet-success-bg.png'
              stats={fmt.currency(agg.organicSales)}
              trendNumber={6.4}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Organic Conv. Rate'
              imageSrc='/images/cards/chart-info-bg.png'
              stats={fmt.percent(agg.organicConvRate)}
              trendNumber={0.8}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Vertical
              title='Sponsored Conv. Rate'
              imageSrc='/images/cards/mobile-success-bg.png'
              stats={fmt.percent(agg.sponsoredConvRate)}
              trendNumber={1.1}
              trend='positive'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PpcPerformanceSection
