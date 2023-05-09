import { React } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import PeopleList from '../components/PeopleList';
import TeamsAdmin from '../components/TeamsAdmin';
import ApplicationCycleInfo from '../components/ApplicationCycleInfo';

export default function Admin({ user, setSnackbarData }) {
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
          Admin
        </Typography>
        {/* Three Columns (Teams, People, Application Cycles) */}
        <br />
        <Grid
          container
          direction="row"
          justifyContent="center"
        >
          <Grid item xs>
            <TeamsAdmin setSnackbarData={setSnackbarData} />
          </Grid>
          <Grid item xs>
            <PeopleList team={null} setSnackbarData={setSnackbarData} />
          </Grid>
          <Grid item xs>
            <ApplicationCycleInfo setSnackbarData={setSnackbarData} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
