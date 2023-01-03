import { React, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import SystemsAdmin from './SystemsAdmin';
import { systemsApi } from '../api/endpoints/teams';

export default function TeamOverview({ team }) {
  // States
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    if (team) {
      systemsApi.getSystemsByTeam(team.id).then((res) => {
        if (res.status === 200) {
          setSystems(res.data);
        }
      });
    }
  }, [team]);

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
            direction="column"
          >
            <Grid 
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs>
                <Typography variant="h6" mt={2}>
                  Systems
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" mt={2}>
                  People
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" mt={2}>
                  Application Info
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs>
                <SystemsAdmin team={team} systems={systems} />
              </Grid>
            </Grid>
          </Grid>
          : null}
      </Box>
    </Container>
  );
}
