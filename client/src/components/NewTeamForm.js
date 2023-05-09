import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';

export default function NewTeamForm({ setTeams, setSnackbarData, setOpen }) {
  // States
  const [name, setName] = useState('');

  const handleAddTeam = () => {
    teamsApi.createTeam({
      name
    }).then((res) => {
      if (res.status === 200) {
        setTeams((curr) => [...curr, res.data]);
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Team created successfully',
        });
        setOpen(false);
      }
    }, (err) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error creating team',
      });
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
