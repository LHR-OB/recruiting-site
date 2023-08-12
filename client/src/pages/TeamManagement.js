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

export default function TeamManagement({ user, setSnackbarData }) {
  // States
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (user) {
      teamsApi.getTeams().then((res) => {
        if (res.status === 200) {
          const allTeams = res.data;
          if (user?.type !== 'ADMIN') {
            const userTeams = allTeams.filter((team) => team.id === user.team_id);
            setTeams(userTeams);
            setSelectedTeam(userTeams[0]);
          } else {
            setTeams(allTeams);
            setSelectedTeam(allTeams[0]);
          }
        }
      });
    }
  }, [user]);

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
