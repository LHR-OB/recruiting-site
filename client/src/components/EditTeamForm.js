import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';

export default function NewTeamForm({ team, setTeams, setSnackbarData, setOpen }) {
  // States
  const [name, setName] = useState(team?.name);

  const handleUpdateTeam = () => {
    teamsApi.updateTeam(team.id, {
      name,
    }).then((res) => {
      if (res.status === 200) {
        setTeams((curr) => {
          const index = curr.findIndex((t) => t.id === team.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Team edited successfully',
        });
        setOpen(false);
      }
    }, (err) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error editing team',
      });
    });
  };

  const handleDeleteTeam = () => {
    teamsApi.deleteTeam(team.id).then((res) => {
      if (res.status === 200) {
        setTeams((curr) => {
          const index = curr.findIndex((t) => t.id === team.id);
          curr.splice(index, 1);
          return curr;
        });
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Team deleted successfully',
        });
        setOpen(false);
      }
    }, (err) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error deleting team',
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
