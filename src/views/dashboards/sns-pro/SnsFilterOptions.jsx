// React Imports
// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Component Imports
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

const SnsFilterOptions = ({ dateRange, onDateRangeChange, customDate, onCustomDateChange }) => {
  return (
    <Box className='flex flex-wrap items-center justify-between gap-4'>
      <div>
        <Typography variant='h5' fontWeight={700}>
          ASIN Matrics S&S Pro
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Subscribe & Save Revenue Intelligence
        </Typography>
      </div>

      <Box className='flex flex-wrap items-center gap-4'>
        <GlobalTimeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          customDateRange={customDate}
          onCustomDateRangeChange={onCustomDateChange}
        />
      </Box>
    </Box>
  )
}

export default SnsFilterOptions
