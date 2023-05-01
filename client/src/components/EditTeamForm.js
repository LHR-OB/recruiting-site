import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';

export default function NewTeamForm({ team }) {
  // States
  const [name, setName] = useState(team?.name);

  const handleUpdateTeam = () => {
    teamsApi.updateTeam(team.id, {
      name,
    }).then((res) => {
      if (res.status === 200) {
        // TODO: Give success notification
        console.log('Team edited successfully');
      }
    });
  };

  const handleDeleteTeam = () => {
    teamsApi.deleteTeam(team.id).then((res) => {
      if (res.status === 200) {
        console.log('Team deleted successfully');
      }
    });
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Edit {team?.name}
        </Typography>
        <TextField
          label="Team Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="outlined"
          onClick={handleUpdateTeam}
          sx={{ margin: 4 }}
        >
          Update Team
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteTeam}
        >
          Delete Team
        </Button>
      </Box>
    </Container>
  );
}
