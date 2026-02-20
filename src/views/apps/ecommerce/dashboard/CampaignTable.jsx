'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Component Imports
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Mock campaign data
const campaignData = [
  {
    name: 'Spring Sale Campaign',
    spend: '$2,845',
    clicks: 3420,
    impressions: 45200,
    cpc: '$0.83',
    acos: '18.5%',
    roas: 5.4,
    status: 'active'
  },
  {
    name: 'Product Launch - Premium',
    spend: '$1,950',
    clicks: 2180,
    impressions: 32100,
    cpc: '$0.89',
    acos: '22.3%',
    roas: 4.5,
    status: 'active'
  },
  {
    name: 'Holiday Promo',
    spend: '$3,120',
    clicks: 4210,
    impressions: 58900,
    cpc: '$0.74',
    acos: '15.8%',
    roas: 6.3,
    status: 'active'
  },
  {
    name: 'Brand Awareness',
    spend: '$890',
    clicks: 1250,
    impressions: 28400,
    cpc: '$0.71',
    acos: '28.4%',
    roas: 3.5,
    status: 'paused'
  },
  {
    name: 'Clearance Sale',
    spend: '$1,420',
    clicks: 1890,
    impressions: 25600,
    cpc: '$0.75',
    acos: '19.2%',
    roas: 5.2,
    status: 'active'
  }
]

const CampaignTable = () => {
  return (
    <Card>
      <CardHeader
        title='Campaign Performance'
        subheader='PPC Campaign-level Reporting'
        action={<OptionMenu options={['Last 7 Days', 'Last 30 Days', 'Last 90 Days']} />}
      />
      <CardContent>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Spend</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CPC</th>
                <th>ACoS</th>
                <th>ROAS</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.map((campaign, index) => (
                <tr key={index}>
                  <td>
                    <Typography className='font-medium' color='text.primary'>
                      {campaign.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography>{campaign.spend}</Typography>
                  </td>
                  <td>
                    <Typography>{campaign.clicks.toLocaleString()}</Typography>
                  </td>
                  <td>
                    <Typography>{campaign.impressions.toLocaleString()}</Typography>
                  </td>
                  <td>
                    <Typography>{campaign.cpc}</Typography>
                  </td>
                  <td>
                    <Typography
                      color={parseFloat(campaign.acos) < 20 ? 'success.main' : 'warning.main'}
                      className='font-medium'
                    >
                      {campaign.acos}
                    </Typography>
                  </td>
                  <td>
                    <Typography color={campaign.roas > 5 ? 'success.main' : 'primary.main'} className='font-medium'>
                      {campaign.roas}x
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      label={campaign.status}
                      color={campaign.status === 'active' ? 'success' : 'secondary'}
                      variant='tonal'
                      size='small'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignTable
