'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'

// import PPCSummaryCard from '@/views/dashboards/ppc/PPCSummaryCard'
// import ROASTrendChart from '@/views/dashboards/ppc/ROASTrendChart'
// import CampaignTable from '@views/apps/ecommerce/dashboard/CampaignTable'

// New Section Components
import SectionFilter from '@/views/dashboards/overview/SectionFilter'
import GeoRankTrackerSection from '@/views/dashboards/overview/GeoRankTrackerSection'
import InventoryPlanningSection from '@/views/dashboards/overview/InventoryPlanningSection'
import SubscribeSaveSection from '@/views/dashboards/overview/SubscribeSaveSection'
import ReviewRequestSection from '@/views/dashboards/overview/ReviewRequestSection'

// Mock Data
import { getKpiData } from '@/libs/overview/overviewMockData'

// Calculation Engine
import { fmt } from '@/libs/ppc/calculationEngine'

const DashboardOverview = () => {
  // KPI Section filter state
  const [kpiProduct, setKpiProduct] = useState('all')
  const [kpiDateRange, setKpiDateRange] = useState('7d')

  // Filtered KPI data — recomputes when product or date range changes
  const agg = useMemo(() => getKpiData(kpiProduct, kpiDateRange), [kpiProduct, kpiDateRange])

  return (
    <Grid container spacing={6}>
      {/* ═══════════════════════════════════════════════════════════════════════
          Section 1 — KPI Tiles (with per-section filter)
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }} className='flex items-center justify-between flex-wrap gap-4'>
        <Typography variant='h5' fontWeight={700}>
          Performance Overview
        </Typography>
        <SectionFilter
          product={kpiProduct}
          onProductChange={setKpiProduct}
          dateRange={kpiDateRange}
          onDateRangeChange={setKpiDateRange}
        />
      </Grid>

      {agg && (
        <>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Total Sales'
              imageSrc='/images/cards/wallet-info-bg.png'
              stats={fmt.currency(agg.totalSales)}
              trendNumber={5.2}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Total Orders'
              imageSrc='/images/cards/mac-warning-bg.png'
              stats={fmt.number(agg.totalOrders)}
              trendNumber={3.8}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Ad Spend'
              imageSrc='/images/cards/credit-card-warning-bg.png'
              stats={fmt.currency(agg.adSpend)}
              trendNumber={1.2}
              trend='negative'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='ROAS'
              imageSrc='/images/cards/chart-success-bg.png'
              stats={fmt.roas(agg.roas)}
              trendNumber={4.1}
              trend='positive'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='ACOS'
              imageSrc='/images/cards/wallet-primary-bg.png'
              stats={fmt.percent(agg.acos)}
              trendNumber={2.3}
              trend='negative'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='TACOS'
              imageSrc='/images/cards/briefcase-primary-bg.png'
              stats={fmt.percent(agg.tacos)}
              trendNumber={1.5}
              trend='negative'
            />
          </Grid>
          {/* NEW: Organic Sales */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Organic Sales'
              imageSrc='/images/cards/wallet-success-bg.png'
              stats={fmt.currency(agg.organicSales)}
              trendNumber={6.4}
              trend='positive'
            />
          </Grid>
          {/* NEW: Organic Conv. Rate */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Organic Conv. Rate'
              imageSrc='/images/cards/chart-info-bg.png'
              stats={fmt.percent(agg.organicConvRate)}
              trendNumber={0.8}
              trend='positive'
            />
          </Grid>
          {/* NEW: Sponsored Conv. Rate */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Vertical
              title='Sponsored Conv. Rate'
              imageSrc='/images/cards/mobile-success-bg.png'
              stats={fmt.percent(agg.sponsoredConvRate)}
              trendNumber={1.1}
              trend='positive'
            />
          </Grid>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Sections 2-5 — COMMENTED OUT
          ═══════════════════════════════════════════════════════════════════════ */}
      {/* Period Summary (PPCSummaryCard) — commented out */}
      {/* <Grid size={{ xs: 12 }}><PPCSummaryCard /></Grid> */}

      {/* ROAS / ACOS / TACOS Trend — commented out */}
      {/* <Grid size={{ xs: 12 }}><ROASTrendChart weeks={weeks} /></Grid> */}

      {/* Campaign Performance — commented out */}
      {/* <Grid size={{ xs: 12 }}><CampaignTable /></Grid> */}

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 6 — Geo Rank Tracker Summary
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }}>
        <GeoRankTrackerSection />
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 7 — Inventory Planning Snapshot
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }}>
        <InventoryPlanningSection />
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 8 — Subscribe & Save Overview
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }}>
        <SubscribeSaveSection />
      </Grid>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 9 — Review Request Insights
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }}>
        <ReviewRequestSection />
      </Grid>
    </Grid>
  )
}

export default DashboardOverview
