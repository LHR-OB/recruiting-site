import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

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

        <InterviewAvailabilityList user={user} />

      </Box>
    </Container>
  );
}