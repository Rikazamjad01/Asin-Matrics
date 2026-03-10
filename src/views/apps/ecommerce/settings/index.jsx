'use client'

import { useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import { useAmazonConnection } from '@/contexts/AmazonConnectionContext'

const Settings = () => {
  const { isConnected, userId } = useAmazonConnection()
  const searchParams = useSearchParams()
  const amazonError = searchParams.get('amazon_error')

  const handleConnect = () => {
    // The application ID is generated when you create an LWA app in Seller Central
    const appId = process.env.NEXT_PUBLIC_AMAZON_APP_ID || 'amzn1.sp.solution.xxxx'

    const redirectUri =
      process.env.NEXT_PUBLIC_AMAZON_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/amazon-oauth-callback`

    const authUrl = `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${appId}&state=${userId}&redirect_uri=${encodeURIComponent(redirectUri)}&version=beta`

    window.location.href = authUrl
  }

  return (
    <Grid container justifyContent='center'>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Card className='p-10 text-center shadow-lg w-full flex flex-col items-center'>
          <Box className='mb-6'>
            <i className='bx-store' style={{ fontSize: '64px', color: '#ff9900' }} />
          </Box>
          <Typography variant='h4' className='mb-4 font-bold'>
            {isConnected ? 'Amazon Account Connected' : 'Connect Your Amazon Account'}
          </Typography>
          <Typography variant='body1' className='mb-8 text-secondary'>
            {isConnected
              ? 'Your Amazon Seller Central account is successfully linked and syncing.'
              : 'To view your metrics and access the tracking dashboards, you need to securely link your Amazon Seller Central account.'}
          </Typography>

          {amazonError && (
            <Box className='mb-6 p-4 bg-error-light text-error rounded w-full'>
              <Typography variant='body2' color='error'>
                Connection failed: {amazonError}
              </Typography>
            </Box>
          )}

          {!isConnected ? (
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
          ) : (
            <Button
              variant='contained'
              size='large'
              color='success'
              disabled
              startIcon={<i className='bx-check-circle' />}
            >
              Connected
            </Button>
          )}

          {!isConnected && (
            <Typography variant='caption' className='mt-8 text-secondary max-w-sm'>
              You will be redirected to Amazon.com to authorize our application for Selling Partner API access.
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default Settings
