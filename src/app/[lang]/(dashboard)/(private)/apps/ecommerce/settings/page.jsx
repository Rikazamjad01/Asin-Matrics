// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/apps/ecommerce/settings'

const StoreDetailsTab = dynamic(() => import('@views/apps/ecommerce/settings/store-details'))

const eCommerceSettings = () => {
  return <Settings tabContentList={{ 'store-details': <StoreDetailsTab /> }} />
}

export default eCommerceSettings
