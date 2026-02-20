// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'
import OptionMenu from '@core/components/option-menu'
import DirectionalIcon from '@components/DirectionalIcon'

// Vars
const data = [
  { title: 'Monthly Sales Target', tasks: 2500, progress: 72, color: 'primary' },
  { title: 'Customer Satisfaction', tasks: 95, progress: 88, color: 'success' },
  { title: 'Inventory Turnover', tasks: 180, progress: 45, color: 'error' },
  { title: 'Order Fulfillment Rate', tasks: 98, progress: 94, color: 'info' }
]

const AssignmentProgress = () => {
  return (
    <Card>
      <CardHeader
        title='Performance Goals'
        action={<OptionMenu iconClassName='text-[22px]' options={['Refresh', 'Update', 'Share']} />}
      />
      <CardContent className='flex flex-col gap-8'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <div className='relative flex items-center justify-center'>
              <CircularProgress
                variant='determinate'
                size={54}
                value={100}
                thickness={3}
                className='absolute text-[var(--mui-palette-customColors-trackBg)]'
              />
              <CircularProgress
                variant='determinate'
                size={54}
                value={item.progress}
                thickness={3}
                color={item.color}
                sx={{ '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
              />
              <Typography variant='h6' className='absolute'>
                {`${item.progress}%`}
              </Typography>
            </div>
            <div className='flex justify-between items-center is-full gap-4'>
              <div>
                <Typography variant='h6' className='mbe-1'>
                  {item.title}
                </Typography>
                <Typography>
                  {item.title === 'Monthly Sales Target' || item.title === 'Inventory Turnover'
                    ? `${item.tasks} Units`
                    : `${item.tasks}%`}
                </Typography>
              </div>
              <CustomIconButton size='small' variant='tonal' color='secondary' className='min-is-fit'>
                <DirectionalIcon ltrIconClass='bx-chevron-right' rtlIconClass='bx-chevron-left' />
              </CustomIconButton>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default AssignmentProgress
