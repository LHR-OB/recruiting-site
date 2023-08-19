import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

export default function Dashboard({ user, setSnackbarData }) {
  return (
    <>
      <Container>
        {/* Collage */}
        <Box
          component="img"
          src="/homepage-collage.png"
          sx={{
            width: '100%',
            height: 'auto',
            marginTop: 8,
            alignItems: 'center',
          }}
        />
        {/* Welcome Text */}
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
        {/* Team Summaries */}
        <Box
          component="img"
          src="/team-summary.png"
          sx={{
            width: '100%',
            height: 'auto',
            marginTop: 8,
            alignItems: 'center',
          }}
        />
        {/* Application Timeline */}
        <Box
          component="img"
          src="/timeline-placeholder.jpeg"
          sx={{
            width: '100%',
            height: 'auto',
            marginTop: 8,
            alignItems: 'center',
          }}
        />
        {/* Presentation */}
        <iframe 
          src="https://onedrive.live.com/embed?resid=4BA294DF1AB09DE7%2110219&amp;authkey=!ABpNUr7Gd0juJsg&amp;em=2&amp;wdAr=1.7777777777777777"
          width="100%"
          height="500px"
        />
      </Container>
    </>
  );
}
