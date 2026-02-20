// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const defaultSuggestions = [
  {
    sectionLabel: 'Dashboards',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboards/overview',
        icon: 'bx-home-smile'
      },
      {
        label: 'Sales',
        href: '/dashboards/crm',
        icon: 'bx-doughnut-chart'
      },
      {
        label: 'Inventory',
        href: '/dashboards/analytics',
        icon: 'bx-bar-chart-alt-2'
      },
      {
        label: 'Advertising',
        href: '/dashboards/ecommerce',
        icon: 'bx-cart'
      },
      {
        label: 'Reports',
        href: '/dashboards/academy',
        icon: 'bx-book-open'
      }
    ]
  },
  {
    sectionLabel: 'Orders',
    items: [
      {
        label: 'Order List',
        href: '/apps/ecommerce/orders/list',
        icon: 'bx-box'
      },
      {
        label: 'Order Details',
        href: '/apps/ecommerce/orders/details/5434',
        icon: 'bx-detail'
      }
    ]
  },
  {
    sectionLabel: 'Users & Permissions',
    items: [
      {
        label: 'User List',
        href: '/apps/user/list',
        icon: 'bx-user'
      },
      {
        label: 'User View',
        href: '/apps/user/view',
        icon: 'bx-show'
      },
      {
        label: 'Roles & Permissions',
        href: '/apps/roles',
        icon: 'bx-check-shield'
      },
      {
        label: 'Permissions',
        href: '/apps/permissions',
        icon: 'bx-lock-alt'
      }
    ]
  },
  {
    sectionLabel: 'Settings',
    items: [
      {
        label: 'Settings',
        href: '/apps/ecommerce/settings',
        icon: 'bx-cog'
      }
    ]
  }
]

const DefaultSuggestions = ({ setOpen }) => {
  // Hooks
  const { lang: locale } = useParams()

  return (
    <div className='flex grow flex-wrap gap-x-12 gap-y-8 plb-10 pli-10 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => (
        <div key={index} className='flex flex-col overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'>
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
            {section.sectionLabel}
          </p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <i className={classnames(item.icon, 'flex text-xl')} />}
                  <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
