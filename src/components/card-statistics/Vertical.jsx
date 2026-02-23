// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import CustomAvatar from '@core/components/mui/Avatar'

const Vertical = props => {
  // Props
  const {
    title,
    imageSrc,
    stats,
    trendNumber,
    trend,
    avatarIcon,
    avatarColor,
    avatarSkin,
    avatarVariant,
    avatarSize = 40
  } = props

  return (
    <Card className='border'>
      <CardHeader
        avatar={
          avatarIcon ? (
            <CustomAvatar
              variant={avatarVariant || 'rounded'}
              skin={avatarSkin || 'light'}
              color={avatarColor || 'primary'}
              size={avatarSize}
            >
              <i className={classnames(avatarIcon, 'text-xl')} />
            </CustomAvatar>
          ) : (
            <img src={imageSrc} alt={title} width='40' height='40' />
          )
        }
        action={<OptionMenu options={['Yesterday', 'Last Week', 'Last Month']} />}
      />

      <CardContent className='flex flex-col gap-y-3'>
        <div className='flex flex-col gap-0.5'>
          <Typography>{title}</Typography>
          <Typography variant='h4'>{stats}</Typography>
        </div>
        <Typography color={trend === 'positive' ? 'success.main' : 'error.main'} className='flex gap-0.5 items-center'>
          <i className={classnames('text-xl', trend === 'positive' ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt')} />
          <span className='text-[13px] font-medium'>{trendNumber}%</span>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Vertical
