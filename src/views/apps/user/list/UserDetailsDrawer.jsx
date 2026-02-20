'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const UserDetailsDrawer = props => {
  // Props
  const { open, handleClose, userDetails } = props

  const handleReset = () => {
    handleClose()
  }

  // Vars
  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500, md: 600 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>User Details</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <div className='flex flex-col gap-6'>
          {/* User Profile Section */}
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                {userDetails?.avatar ? (
                  <CustomAvatar alt='user-profile' src={userDetails.avatar} variant='rounded' size={120} />
                ) : (
                  <CustomAvatar variant='rounded' size={120}>
                    {getInitials(userDetails?.fullName || 'User')}
                  </CustomAvatar>
                )}
                <Typography variant='h5'>{userDetails?.fullName || 'N/A'}</Typography>
              </div>
              <Chip
                label={userDetails?.role || 'User'}
                color={
                  userDetails?.role === 'admin'
                    ? 'error'
                    : userDetails?.role === 'author'
                      ? 'warning'
                      : userDetails?.role === 'editor'
                        ? 'info'
                        : userDetails?.role === 'maintainer'
                          ? 'success'
                          : 'primary'
                }
                size='small'
                variant='tonal'
                className='capitalize'
              />
            </div>

            {/* Stats Section */}
            <div className='flex items-center justify-around flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='bx-check' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>1.23k</Typography>
                  <Typography>Task Done</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='bx-customize' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>568</Typography>
                  <Typography>Project Done</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Username:</Typography>
                <Typography>{userDetails?.username || 'N/A'}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Email:</Typography>
                <Typography>{userDetails?.email || 'N/A'}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Status:</Typography>
                <Chip
                  label={userDetails?.status || 'N/A'}
                  color={
                    userDetails?.status === 'active'
                      ? 'success'
                      : userDetails?.status === 'pending'
                        ? 'warning'
                        : 'secondary'
                  }
                  size='small'
                  variant='tonal'
                  className='capitalize'
                />
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Role:</Typography>
                <Typography color='text.primary' className='capitalize'>
                  {userDetails?.role || 'N/A'}
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Current Plan:</Typography>
                <Typography color='text.primary' className='capitalize'>
                  {userDetails?.currentPlan || 'N/A'}
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Billing:</Typography>
                <Typography color='text.primary'>{userDetails?.billing || 'N/A'}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Contact:</Typography>
                <Typography color='text.primary'>{userDetails?.contact || 'N/A'}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography variant='h6'>Country:</Typography>
                <Typography color='text.primary'>{userDetails?.country || 'N/A'}</Typography>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userDetails }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'tonal')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default UserDetailsDrawer
