import { React, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

import InterviewAvailabilityCalendar from '../components/InterviewAvailabilityCalendar';
import InterviewAvailabilityList from '../components/InterviewAvailabilityList';
import { applicationCyclesApi } from '../api/endpoints/applications';
import ApplicationCycleClosed from '../components/ApplicationCycleClosed';


export default function InterviewAvailability({ user, setSnackbarData }) {
  // States
  const [applicationCycle, setApplicationCycle] = useState(null);

  useEffect(() => {
    applicationCyclesApi.getApplicationCycleActive().then((res) => {
      if (res.status === 200) {
        setApplicationCycle(res.data);
      }
    });
  }, []);

  if (!applicationCycle) {
    return (
      <ApplicationCycleClosed />
    );
  }
  
  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Interview Availability
        </Typography>
        {
          user?.type === 'APPLICANT' ?
          <>
            <Typography variant="body1" mt={2}>
              If you are invited to interview for a system, you will see options below. Please follow the team's instructions for scheduling interviews. If you do not see any options below and believe this is a mistake, please contact a system administrator.
            </Typography>
            <Typography variant="body1" mt={2}>
              If you want to see a demonstration on how to properly schedule an interview, please watch <a href='https://drive.google.com/file/d/1BPtX8ZTIkoYX-j6owPhdl6nCtgaFMUVT/view?usp=sharing' target='_blank' rel='noopener noreferrer'>this video</a>.
            </Typography>
            <Typography variant="body1" mt={2}>
              All times are in Central Time (CT).
            </Typography>
            <InterviewAvailabilityList user={user} setSnackbarData={setSnackbarData} />
          </>
            :
            <InterviewAvailabilityCalendar user={user} setSnackbarData={setSnackbarData} />
        }

      </Box>
    </Container>
  );
}
