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


export default function InterviewAvailability({ user }) {
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
            <InterviewAvailabilityList user={user} /> :
            <InterviewAvailabilityCalendar user={user} />
        }

      </Box>
    </Container>
  );
}
