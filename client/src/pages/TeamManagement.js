import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography,
} from '@mui/material';
import TeamOverview from '../components/TeamOverview';
import { teamsApi } from '../api/endpoints/teams';

export default function TeamManagement({ setSnackbarData }) {
  // States
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    teamsApi.getTeams().then((res) => {
      if (res.status === 200) {
        setTeams(res.data);
        setSelectedTeam(res.data[0]);
      }
    });
  }, []);

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
        <Typography variant="h4" mt={2} mb={2}>
          Team Management
        </Typography>
        <ButtonGroup variant="outlined">
          {teams.map((team) => (
            <Button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              sx={{
                backgroundColor: selectedTeam?.id === team.id ? 'primary.main' : 'white',
                color: selectedTeam?.id === team.id ? 'white' : 'primary.main',
              }}
            >
              {team.name}
            </Button>
          ))}
        </ButtonGroup>
        <br />
        <TeamOverview team={selectedTeam} setTeam={setSelectedTeam} setTeams={setTeams} setSnackbarData={setSnackbarData} />
      </Box>
    </Container>
  );
}
