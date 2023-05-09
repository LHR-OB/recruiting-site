import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

export default function Dashboard({ user, setSnackbarData }) {
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
          Welcome to the Longhorn Racing Application Portal!
        </Typography>
        <Typography variant="body1" mt={2}>
          Make sure to log in or create an account to get started.
        </Typography>
        <Typography variant="body1" mt={2}>
          If you are an applicant, you can use the navigation bar on the side to submit an application, schedule interviews, and view the status of your application.
        </Typography>
        <Typography variant="body1" mt={2}>
          If you are a current member, you can use the navigation bar on the side to view and mark applications, schedule interviews, and manage your team.
        </Typography>
      </Box>
    </Container>
  );
}
