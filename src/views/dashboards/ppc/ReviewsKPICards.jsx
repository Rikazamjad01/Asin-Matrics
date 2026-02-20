'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Components Imports
import Vertical from '@components/card-statistics/Vertical'

// Calculation Engine
import { calcImprovement, fmt } from '@/libs/ppc/calculationEngine'

const ReviewsKPICards = ({ summary }) => {
  const { totalReviews, avgRating, newReviewsThisWeek, previousWeekReviews } = summary
  const reviewGrowth = calcImprovement(newReviewsThisWeek, previousWeekReviews)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Total Reviews'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats={totalReviews.toLocaleString()}
          trendNumber={2.4}
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Average Rating'
          imageSrc='/images/cards/mac-warning-bg.png'
          stats={`${avgRating.toFixed(1)} ★`}
          trendNumber={0.1}
          trend='positive'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='New Reviews (This Week)'
          imageSrc='/images/cards/wallet-info-bg.png'
          stats={String(newReviewsThisWeek)}
          trendNumber={reviewGrowth != null ? Math.abs(parseFloat(reviewGrowth.toFixed(1))) : 0}
          trend={reviewGrowth != null && reviewGrowth >= 0 ? 'positive' : 'negative'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Vertical
          title='Review Count Change'
          imageSrc='/images/cards/mac-warning-bg.png'
          stats={reviewGrowth != null ? fmt.improvement(reviewGrowth) : 'N/A'}
          trendNumber={reviewGrowth != null ? Math.abs(parseFloat(reviewGrowth.toFixed(1))) : 0}
          trend={reviewGrowth != null && reviewGrowth >= 0 ? 'positive' : 'negative'}
        />
      </Grid>
    </Grid>
  )
}

export default ReviewsKPICards
