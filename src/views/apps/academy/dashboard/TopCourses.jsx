// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Vars
const data = [
  { title: 'Electronics & Accessories', views: '3.2k', icon: 'bx-laptop', color: 'primary' },
  { title: 'Home & Kitchen Essentials', views: '2.8k', icon: 'bx-home', color: 'info' },
  { title: 'Beauty & Personal Care', views: '2.1k', icon: 'bx-heart', color: 'success' },
  { title: 'Sports & Outdoors', views: '1.5k', icon: 'bx-football', color: 'warning' },
  { title: 'Books & Media', views: '948', icon: 'bx-book', color: 'error' }
]

const TopCourses = () => {
  return (
    <Card>
      <CardHeader
        title='Top Categories'
        action={<OptionMenu iconClassName='text-[22px]' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent className='flex flex-col gap-6'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <CustomAvatar size={40} variant='rounded' skin='light' color={item.color}>
              <i className={item.icon} />
            </CustomAvatar>
            <div className='flex justify-between items-center gap-4 is-full flex-wrap'>
              <Typography variant='h6' className='flex-1'>
                {item.title}
              </Typography>
              <Chip label={`${item.views} Sales`} variant='tonal' size='small' color='secondary' />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopCourses
