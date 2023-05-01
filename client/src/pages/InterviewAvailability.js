import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

import InterviewAvailabilityCalendar from '../components/InterviewAvailabilityCalendar';
import InterviewAvailabilityList from '../components/InterviewAvailabilityList';


export default function InterviewAvailability({ user }) {
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
