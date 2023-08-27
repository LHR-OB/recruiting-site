import { React } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import SystemInfo from './SystemInfo';
import PeopleList from './PeopleList';
import ApplicationInfo from './ApplicationInfo';

export default function SystemOverview({ system, setSystem, setSystems, setSnackbarData }) {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" mt={2}>
          {system?.name}
        </Typography>
          {/* Three columns (System Info, People, Application Info) */}
          {system ?
            <Grid
              container
              direction="row"
              justifyContent="center"
            >
              <Grid item xs>
                <SystemInfo system={system} setSystem={setSystem} setSystems={setSystems} setSnackbarData={setSnackbarData} />
              </Grid>
              <Grid item xs>
                <PeopleList system={system} setSnackbarData={setSnackbarData} />
              </Grid>
              <Grid item xs>
                <ApplicationInfo system={system} />
              </Grid>
            </Grid>
          : null}
      </Box>
    </Container>
  );
}
