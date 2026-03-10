'use client'

import { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'

import { supabase } from '@/utils/supabase/client'

export default function AmazonConnectGate({ children }) {
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [userId, setUserId] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const amazonError = searchParams.get('amazon_error')
  const amazonConnected = searchParams.get('amazon_connected')

  useEffect(() => {
    const checkConnection = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        router.push('/en/login') // Redirect to login page if no user

        return
      }

      setUserId(user.id)

      const { data } = await supabase.from('amazon_accounts').select('id').eq('user_id', user.id).limit(1)

      if (data && data.length > 0) {
        setIsConnected(true)
      }

      setLoading(false)
    }

    checkConnection()
  }, [amazonConnected, router]) // Re-run if query param changes

  if (loading) {
    return (
      <Box className='flex justify-center items-center h-full min-h-[50vh]'>
        <CircularProgress />
      </Box>
    )
  }

  if (!isConnected) {
    const handleConnect = () => {
      // The application ID is generated when you create an LWA app in Seller Central
      const appId = process.env.NEXT_PUBLIC_AMAZON_APP_ID || 'amzn1.sp.solution.xxxx'

      const redirectUri =
        process.env.NEXT_PUBLIC_AMAZON_REDIRECT_URI ||
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/amazon-oauth-callback`

      const authUrl = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${appId}&state=${userId}&version=beta`

      window.location.href = authUrl
    }

    return (
      <Box className='flex justify-center items-center h-full min-h-[50vh] p-4'>
        <Card className='p-10 max-w-xl text-center shadow-lg w-full flex flex-col items-center'>
          <Box className='mb-6'>
            <i className='bx-store' style={{ fontSize: '64px', color: '#ff9900' }} />
          </Box>
          <Typography variant='h4' className='mb-4 font-bold'>
            Connect Your Amazon Account
          </Typography>
          <Typography variant='body1' className='mb-8 text-secondary'>
            To view your metrics and access the tracking dashboards, you need to securely link your Amazon Seller
            Central account.
          </Typography>

          {amazonError && (
            <Box className='mb-6 p-4 bg-error-light text-error rounded w-full'>
              <Typography variant='body2' color='error'>
                Connection failed: {amazonError}
              </Typography>
            </Box>
          )}

          <Button
            variant='contained'
            size='large'
            onClick={handleConnect}
            sx={{
              backgroundColor: '#ff9900',
              '&:hover': { backgroundColor: '#e38800' },
              color: '#000',
              fontWeight: 'bold',
              px: 4,
              py: 1.5
            }}
            startIcon={<i className='bx-link' />}
          >
            Authorize Amazon
          </Button>

          <Typography variant='caption' className='mt-8 text-secondary max-w-sm'>
            You will be redirected to Amazon.com to authorize our application for Selling Partner API access.
          </Typography>
        </Card>
      </Box>
    )
  }

  return children
}
