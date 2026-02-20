'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import ReactApexcharts from 'react-apexcharts'

const SalesTrendChart = ({ weeks }) => {
  const theme = useTheme()

  const { categories, salesData, ordersData } = useMemo(() => {
    return {
      categories: weeks.map(w => w.weekRange),
      salesData: weeks.map(w => parseFloat(w.totalSales.toFixed(2))),
      ordersData: weeks.map(w => w.totalOrders)
    }
  }, [weeks])

  const options = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent'
    },
    theme: { mode: theme.palette.mode },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    xaxis: {
      categories,
      labels: {
        rotate: -30,
        style: { fontSize: '11px', colors: theme.palette.text.secondary }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        title: { text: 'Sales ($)', style: { color: theme.palette.primary.main } },
        labels: {
          formatter: val => `$${(val / 1000).toFixed(1)}k`,
          style: { colors: theme.palette.text.secondary }
        }
      },
      {
        opposite: true,
        title: { text: 'Orders', style: { color: theme.palette.success.main } },
        labels: {
          formatter: val => Math.round(val),
          style: { colors: theme.palette.text.secondary }
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
        { formatter: val => `${Math.round(val)} orders` }
      ]
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: theme.palette.text.primary }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4
    }
  }

  const series = [
    { name: 'Total Sales', data: salesData },
    { name: 'Total Orders', data: ordersData }
  ]

  return (
    <Card>
      <CardHeader
        title='Sales & Orders Trend'
        subheader='Weekly performance'
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <ReactApexcharts type='area' height={280} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default SalesTrendChart
