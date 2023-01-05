import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';

export default function NewTeamForm() {
  // States
  const [name, setName] = useState('');

  const handleAddTeam = () => {
    teamsApi.createTeam({
      name
    }).then((res) => {
      if (res.status === 200) {
        // TODO: Give success notification
        console.log('Team created successfully');
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
          Add Team
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
          onClick={handleAddTeam}
          sx={{ margin: 4 }}
        >
          Add Team
        </Button>
      </Box>
    </Container>
  );
}
