// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children, locale }) {
  // Authentication disabled - always allow access
  // const session = await getServerSession()

  return <>{children}</>
}
