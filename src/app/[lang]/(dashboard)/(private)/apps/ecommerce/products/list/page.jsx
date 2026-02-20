// Component Imports
import ProductsDashboard from '@views/apps/ecommerce/products/list/ProductsDashboard'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const eCommerceProductsList = async () => {
  // Vars
  const data = await getEcommerceData()

  return <ProductsDashboard initialData={data?.products} />
}

export default eCommerceProductsList
