// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Vars
const shortcuts = [
  {
    url: '/dashboards/overview',
    icon: 'bx-home-smile',
    title: 'Dashboard',
    subtitle: 'Main Dashboard'
  },
  {
    url: '/apps/ecommerce/orders/list',
    icon: 'bx-box',
    title: 'Orders',
    subtitle: 'Manage Orders'
  },
  {
    url: '/apps/user/list',
    icon: 'bx-user',
    title: 'Users',
    subtitle: 'Manage Users'
  },
  {
    url: '/apps/roles',
    icon: 'bx-check-shield',
    title: 'Roles',
    subtitle: 'Permissions'
  },
  {
    url: '/dashboards/crm',
    icon: 'bx-doughnut-chart',
    title: 'Sales',
    subtitle: 'Sales Dashboard'
  },
  {
    url: '/apps/ecommerce/settings',
    icon: 'bx-cog',
    title: 'Settings',
    subtitle: 'App Settings'
  }
]

const notifications = [
  {
    avatarImage: '/images/avatars/8.png',
    title: 'Congratulations Flora 🎉',
    subtitle: 'Won the monthly bestseller gold badge',
    time: '1h ago',
    read: false
  },
  {
    title: 'Cecilia Becker',
    avatarColor: 'secondary',
    subtitle: 'Accepted your connection',
    time: '12h ago',
    read: false
  },
  {
    avatarImage: '/images/avatars/3.png',
    title: 'Bernard Woods',
    subtitle: 'You have new message from Bernard Woods',
    time: 'May 18, 8:26 AM',
    read: true
  },
  {
    avatarIcon: 'bx-bar-chart',
    title: 'Monthly report generated',
    subtitle: 'July month financial report is generated',
    avatarColor: 'info',
    time: 'Apr 24, 10:30 AM',
    read: true
  },
  {
    avatarText: 'MG',
    title: 'Application has been approved 🚀',
    subtitle: 'Your Meta Gadgets project application has been approved.',
    avatarColor: 'success',
    time: 'Feb 17, 12:17 PM',
    read: true
  },
  {
    avatarIcon: 'bx-envelope',
    title: 'New message from Harry',
    subtitle: 'You have new message from Harry',
    avatarColor: 'error',
    time: 'Jan 6, 1:48 PM',
    read: true
  }
]

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-2 is-full')}>
      <div className='flex items-center gap-2'>
        <NavToggle />
        <NavSearch />
      </div>
      <div className='flex items-center'>
        {/* <LanguageDropdown /> */}
        {/* <ModeDropdown /> */}
        <ShortcutsDropdown shortcuts={shortcuts} />
        {/* <NotificationsDropdown notifications={notifications} /> */}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
