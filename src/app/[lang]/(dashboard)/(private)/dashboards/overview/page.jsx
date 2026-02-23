'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports

// import PPCSummaryCard from '@/views/dashboards/ppc/PPCSummaryCard'
// import ROASTrendChart from '@/views/dashboards/ppc/ROASTrendChart'
// import CampaignTable from '@views/apps/ecommerce/dashboard/CampaignTable'

// New Section Components
import PpcPerformanceSection from '@/views/dashboards/overview/PpcPerformanceSection'
import GeoRankTrackerSection from '@/views/dashboards/overview/GeoRankTrackerSection'
import InventoryPlanningSection from '@/views/dashboards/overview/InventoryPlanningSection'
import SubscribeSaveSection from '@/views/dashboards/overview/SubscribeSaveSection'
import ReviewRequestSection from '@/views/dashboards/overview/ReviewRequestSection'

// Mock Data

// Calculation Engine

const DashboardOverview = () => {
  return (
    <Grid container spacing={6}>
      {/* ═══════════════════════════════════════════════════════════════════════
          Section 1 — KPI Tiles (with per-section filter)
          ═══════════════════════════════════════════════════════════════════════ */}
      <Grid size={{ xs: 12 }}>
        <PpcPerformanceSection />
      </Grid>

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
