// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import WelcomeCard from '@views/apps/academy/dashboard/WelcomeCard'
import InterestedTopics from '@views/apps/academy/dashboard/InterestedTopics'
import PopularInstructors from '@views/apps/academy/dashboard/PopularInstructors'
import TopCourses from '@views/apps/academy/dashboard/TopCourses'
import UpcomingWebinar from '@views/apps/academy/dashboard/UpcomingWebinar'
import AssignmentProgress from '@views/apps/academy/dashboard/AssignmentProgress'
import CourseTable from '@views/apps/academy/dashboard/CourseTable'
import GlobalTimeFilter from '@/components/GlobalTimeFilter'

// Data Imports
import { getAcademyData } from '@/app/server/actions'

const DashboardReports = async () => {
  // Vars
  const data = await getAcademyData()

  return (
    <Grid container spacing={6}>
      {/* Filter Row */}
      <Grid size={{ xs: 12 }} className='flex justify-end'>
        <GlobalTimeFilter />
      </Grid>

      {/* Welcome Banner */}
      <Grid size={{ xs: 12 }}>
        <WelcomeCard />
      </Grid>

      {/* Key Performance Indicators */}
      <Grid size={{ xs: 12, md: 8 }}>
        <InterestedTopics />
      </Grid>

      {/* Top Selling Products */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <PopularInstructors />
      </Grid>

      {/* Top Categories */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <TopCourses />
      </Grid>

      {/* Scheduled Reports */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <UpcomingWebinar />
      </Grid>

      {/* Monthly Targets */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <AssignmentProgress />
      </Grid>

      {/* Detailed Products Report */}
      <Grid size={{ xs: 12 }}>
        <CourseTable courseData={data?.courses} />
      </Grid>
    </Grid>
  )
}

export default DashboardReports
