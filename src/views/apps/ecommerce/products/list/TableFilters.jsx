// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const DEFAULTS = { condition: '', stockLevel: '', status: '', minQty: '', maxQty: '' }

const TableFilters = ({ setData, productData }) => {
  // Staged state — what the user is currently editing in the UI
  const [staged, setStaged] = useState(DEFAULTS)

  // Applied state — what's actually used to filter (only updated on button click)
  const [applied, setApplied] = useState(DEFAULTS)

  const set = key => e => setStaged(prev => ({ ...prev, [key]: e.target.value }))

  // Only runs when applied changes (i.e. user clicked Apply)
  useEffect(() => {
    const { condition, status, stockLevel, minQty, maxQty } = applied

    const filtered = (productData ?? []).filter(product => {
      if (condition && product.condition !== condition) return false
      if (status && product.status !== status) return false

      if (stockLevel === 'in_stock' && product.qty <= 0) return false
      if (stockLevel === 'low_stock' && (product.qty <= 0 || product.qty > 10)) return false
      if (stockLevel === 'out_of_stock' && product.qty > 0) return false

      if (minQty !== '' && product.qty < Number(minQty)) return false
      if (maxQty !== '' && product.qty > Number(maxQty)) return false

      return true
    })

    setData(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, productData])

  const handleApply = () => setApplied({ ...staged })

  const handleReset = () => {
    setStaged(DEFAULTS)
    setApplied(DEFAULTS)
  }

  const uniqueConditions = [...new Set((productData ?? []).map(p => p.condition).filter(Boolean))]

  return (
    <CardContent>
      <Grid container spacing={4} alignItems='flex-end'>
        {/* Condition */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            label='Condition'
            value={staged.condition}
            onChange={set('condition')}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value=''>All</MenuItem>
            {uniqueConditions.map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {/* Stock Level */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            label='Stock Level'
            value={staged.stockLevel}
            onChange={set('stockLevel')}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='in_stock'>In Stock (&gt;10)</MenuItem>
            <MenuItem value='low_stock'>Low Stock (1–10)</MenuItem>
            <MenuItem value='out_of_stock'>Out of Stock</MenuItem>
          </CustomTextField>
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <CustomTextField
            select
            fullWidth
            label='Status'
            value={staged.status}
            onChange={set('status')}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='Published'>Published</MenuItem>
            <MenuItem value='Scheduled'>Scheduled</MenuItem>
            <MenuItem value='Inactive'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>

        {/* Qty Range */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
            Qty Range
          </Typography>
          <Box className='flex items-center gap-2'>
            <CustomTextField
              type='number'
              placeholder='Min'
              value={staged.minQty}
              onChange={set('minQty')}
              inputProps={{ min: 0 }}
              sx={{ flex: 1 }}
            />
            <Typography variant='body2' color='text.secondary' sx={{ flexShrink: 0 }}>
              –
            </Typography>
            <CustomTextField
              type='number'
              placeholder='Max'
              value={staged.maxQty}
              onChange={set('maxQty')}
              inputProps={{ min: 0 }}
              sx={{ flex: 1 }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Action Buttons */}
        <Grid size={{ xs: 12 }} sx={{ mt: 4 }} container className="justify-end">
          <Box className='flex gap-2'>
            <Button fullWidth variant='contained' onClick={handleApply} startIcon={<i className='bx-filter-alt' />}>
              Apply
            </Button>
            <Button
              fullWidth
              variant='tonal'
              color='secondary'
              onClick={handleReset}
              startIcon={<i className='bx-reset' />}
            >
              Reset
            </Button>
          </Box>
        </Grid>
    </CardContent>
  )
}

export default TableFilters
