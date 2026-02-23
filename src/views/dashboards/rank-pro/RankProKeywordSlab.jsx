'use client'

// React Imports
import { useMemo } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const RankProKeywordSlab = ({
  rank,
  change,
  changeType, // 'up', 'down', 'stable'
  keyword,
  searchVolume,
  difficulty,
  targetRank,
  away,
  history = [] // array of 7 numbers for the trend
}) => {
  const theme = useTheme()

  // Determine styles for the rank
  let rankColor = 'primary'

  if (rank >= 1 && rank <= 5) rankColor = 'warning'
  else if (rank > 5 && rank <= 20) rankColor = 'info'
  else if (rank > 20) rankColor = 'secondary'

  // Change chip styles
  let changeColor = 'success'
  let changeIcon = 'bx-up-arrow-alt'

  if (changeType === 'down') {
    changeColor = 'error'
    changeIcon = 'bx-down-arrow-alt'
  } else if (changeType === 'stable') {
    changeColor = 'secondary'
    changeIcon = 'bx-minus'
  }

  // Ultra-compact Line Chart Options
  const chartOptions = useMemo(
    () => ({
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
        sparkline: { enabled: true }
      },
      grid: { show: false },
      stroke: { curve: 'smooth', width: 2 },
      colors: [theme.palette[rankColor].main],
      xaxis: { crosshairs: { width: 1 } },
      tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        y: { title: { formatter: () => '' } },
        marker: { show: false }
      }
    }),
    [theme, rankColor]
  )

  return (
    <tr className='border-none'>
      {/* 1. Rank */}
      <td>
        <div className='flex items-center justify-center'>
          <CustomAvatar size={30} variant='rounded' skin='light' color={rankColor}>
            <Typography variant='caption' color='inherit' className='font-bold'>
              {rank}
            </Typography>
          </CustomAvatar>
        </div>
      </td>

      {/* 2. Keyword */}
      <td>
        <Typography className='font-medium text-textPrimary' noWrap>
          {keyword}
        </Typography>
      </td>

      {/* 3. Search Volume */}
      <td>
        <div className='flex flex-col gap-1'>
          <Typography variant='body2' className='font-medium'>
            {searchVolume}
          </Typography>
          <LinearProgress variant='determinate' value={85} color='primary' sx={{ height: 2, borderRadius: 1 }} />
        </div>
      </td>

      {/* 4. Difficulty */}
      <td>
        <div className='flex flex-col gap-1'>
          <Typography variant='body2' className='font-medium' color={difficulty > 70 ? 'error.main' : 'warning.main'}>
            {difficulty}%
          </Typography>
          <LinearProgress
            variant='determinate'
            value={difficulty}
            color={difficulty > 70 ? 'error' : difficulty > 40 ? 'warning' : 'success'}
            sx={{ height: 2, borderRadius: 1 }}
          />
        </div>
      </td>

      {/* 5. Target Rank */}
      <td>
        <div className='flex flex-col'>
          <Typography variant='body2' className='font-bold text-warning'>
            #{targetRank}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            {away} away
          </Typography>
        </div>
      </td>

      {/* 6. Change */}
      <td>
        <Chip
          label={
            changeType === 'up'
              ? `+${change.replace('+', '')}`
              : changeType === 'down'
                ? `-${change.replace('-', '')}`
                : '—'
          }
          color={changeColor}
          size='small'
          variant='tonal'
          className='font-bold h-6'
          sx={{ '& .MuiChip-label': { px: 1.5 } }}
        />
      </td>

      {/* 7. 7D trend */}
      <td>
        <div className='w-[80px]' style={{ height: 30 }}>
          <AppReactApexCharts
            type='line'
            height={30}
            width={80}
            options={chartOptions}
            series={[{ name: 'Rank', data: history }]}
          />
        </div>
      </td>

      {/* 8. Actions */}
      <td>
        <div className='flex items-center justify-end'>
          <OptionMenu options={['Edit', 'Refresh', { divider: true }, 'Delete']} iconClassName='text-textSecondary' />
        </div>
      </td>
    </tr>
  )
}

export default RankProKeywordSlab
