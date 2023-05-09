import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { systemsApi } from '../api/endpoints/teams';

export default function NewSystemForm({ team, system, setSystems, setSnackbarData, setOpen }) {
  // States
  const [name, setName] = useState(system?.name);
  const [interviewDefaultLocation, setInterviewDefaultLocation] = useState(system?.interview_default_location);

  const handleUpdateSystem = () => {
    systemsApi.updateSystem(system.id, {
      name,
      interview_default_location: interviewDefaultLocation,
      team_id: team.id,
    }).then((res) => {
      if (res.status === 200) {
        setSystems((curr) => {
          const index = curr.findIndex((s) => s.id === system.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          severity: 'success',
          message: 'System updated successfully',
          open: true,
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        severity: 'error',
        message: 'Error updating system',
        open: true,
      });
    });
  };

  const handleDeleteSystem = () => {
    systemsApi.deleteSystem(system.id).then((res) => {
      if (res.status === 200) {
        setSystems((curr) => curr.filter((s) => s.id !== system.id));
        setSnackbarData({
          severity: 'success',
          message: 'System deleted successfully',
          open: true,
        });
        setOpen(false);
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
          Edit {system?.name}
        </Typography>
        <TextField
          label="System Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Interview Default Location"
          variant="standard"
          value={interviewDefaultLocation || ''}
          onChange={(e) => setInterviewDefaultLocation(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="outlined"
          onClick={handleUpdateSystem}
          sx={{ margin: 4 }}
        >
          Update System
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSystem}
        >
          Delete System
        </Button>
      </Box>
    </Container>
  );
}
