// Component Imports
import ReviewsDashboard from '@/views/dashboards/reviews/ReviewsDashboard'

import { getEcommerceData } from '@/app/server/actions'

const ReviewsPage = async () => {
  // Fetching data for modular integration
  const data = await getEcommerceData()

  return <ReviewsDashboard productData={data?.products} />
}

export default ReviewsPage
