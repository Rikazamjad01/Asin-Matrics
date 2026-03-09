'use client'

import { useEffect } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import { useAmazonConnection } from '@/contexts/AmazonConnectionContext'
import { getLocalizedUrl } from '@/utils/i18n'

export default function AmazonConnectionGuard({ children, locale }) {
  const { isConnected, isLoading } = useAmazonConnection()
  const router = useRouter()
  const pathname = usePathname()

  // Find out if current route is the settings page (which is the connection page now)
  const isSettingsPage = pathname.includes('/apps/ecommerce/settings')

  useEffect(() => {
    // If not loading, and user is NOT connected, and they are NOT already on settings page
    if (!isLoading && !isConnected && !isSettingsPage) {
      router.push(getLocalizedUrl('/apps/ecommerce/settings', locale))
    }
  }, [isLoading, isConnected, isSettingsPage, router, locale])

  // If not connected and not on settings page, we are in the middle of a redirect, render nothing
  if (!isLoading && !isConnected && !isSettingsPage) {
    return null
  }

  return children
}
