'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const Settings = ({ tabContentList }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h5'>Store Details</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>{tabContentList['store-details']}</Grid>
      <Grid size={{ xs: 12 }}>
        <div className='flex justify-end gap-4'>
          <Button variant='tonal' color='secondary'>
            Discard
          </Button>
          <Button variant='contained'>Save Changes</Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default Settings
