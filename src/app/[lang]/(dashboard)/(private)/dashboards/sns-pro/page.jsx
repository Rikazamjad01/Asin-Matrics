// Component Imports
import SnsProDashboard from '@/views/dashboards/sns-pro/SnsProDashboard'

import { getEcommerceData } from '@/app/server/actions'

const SnsProPage = async () => {
  // Fetching data purely for mock integration if needed by SnsProDashboard
  const data = await getEcommerceData()

  return <SnsProDashboard productData={data?.products} />
}

export default SnsProPage
