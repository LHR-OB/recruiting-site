import { React } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import SystemsAdmin from './SystemsAdmin';
import PeopleList from './PeopleList';
import ApplicationInfo from './ApplicationInfo';

export default function TeamOverview({ team }) {
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
          {team?.name}
        </Typography>
          {/* Three columns (Systems, People, Application Info) */}
          {team ?
            <Grid
              container
              direction="row"
              justifyContent="center"
            >
              <Grid item xs>
                <SystemsAdmin team={team} />
              </Grid>
              <Grid item xs>
                <PeopleList team={team} />
              </Grid>
              <Grid item xs>
                <ApplicationInfo team={team} />
              </Grid>
            </Grid>
          : null}
      </Box>
    </Container>
  );
}
