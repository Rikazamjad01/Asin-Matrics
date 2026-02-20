// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Vars
const data = [
  { name: 'Wireless Headphones', profession: 'Electronics', totalCourses: 847, avatar: '/images/avatars/1.png' },
  { name: 'Kitchen Blender Pro', profession: 'Home & Kitchen', totalCourses: 652, avatar: '/images/avatars/2.png' },
  { name: 'Organic Face Serum', profession: 'Beauty', totalCourses: 428, avatar: '/images/avatars/3.png' },
  { name: 'Yoga Mat Premium', profession: 'Sports', totalCourses: 312, avatar: '/images/avatars/4.png' }
]

const PopularInstructors = () => {
  return (
    <Card className='bs-full'>
      <CardHeader title='Top Selling Products' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <Divider />
      <div className='flex justify-between plb-4 pli-6'>
        <Typography className='uppercase'>products</Typography>
        <Typography className='uppercase'>units sold</Typography>
      </div>
      <Divider />
      <CardContent className='flex flex-col gap-4'>
        {data.map((item, i) => (
          <div key={i} className='flex items-center gap-4'>
            <CustomAvatar size={34} src={item.avatar} />
            <div className='flex justify-between items-center is-full gap-4'>
              <div>
                <Typography variant='h6'>{item.name}</Typography>
                <Typography variant='body2'>{item.profession}</Typography>
              </div>
              <Typography variant='h6'>{item.totalCourses}</Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default PopularInstructors
