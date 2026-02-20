// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Vars
const data = [
  { icon: 'bx-calendar', title: 'Feb 15, 2026', value: 'Report Date' },
  { icon: 'bx-time-five', title: 'Monthly', value: 'Frequency' }
]

const UpcomingWebinar = () => {
  return (
    <Card>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex justify-center pli-2.5 pbs-2.5 rounded bg-primaryLight'>
          <img src='/images/illustrations/characters-with-objects/1.png' className='bs-[150px]' />
        </div>
        <div>
          <Typography variant='h5' className='mbe-2'>
            Monthly Performance Report
          </Typography>
          <Typography>
            Review your comprehensive sales analytics, inventory status, and performance metrics for the month.
          </Typography>
        </div>
        <div className='flex flex-wrap justify-between gap-4'>
          {data.map((item, i) => (
            <div key={i} className='flex items-center gap-3'>
              <CustomAvatar size={40} variant='rounded' skin='light' color='primary'>
                <i className={item.icon} />
              </CustomAvatar>
              <div>
                <Typography variant='h6'>{item.title}</Typography>
                <Typography variant='body2'>{item.value}</Typography>
              </div>
            </div>
          ))}
        </div>
        <Button variant='contained'>View Report</Button>
      </CardContent>
    </Card>
  )
}

export default UpcomingWebinar
