import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { systemsApi } from '../api/endpoints/teams';

export default function NewSystemForm({ team, setSystems, setSnackbarData, setOpen }) {
  // States
  const [name, setName] = useState('');

  const handleAddSystem = () => {
    systemsApi.createSystem({
      name,
      team_id: team.id,
    }).then((res) => {
      if (res.status === 200) {
        setSystems((curr) => [...curr, res.data]);
        setSnackbarData({
          severity: 'success',
          message: 'System created successfully',
          open: true,
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        severity: 'error',
        message: 'Error creating system',
        open: true,
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
          Add System for { team.name }
        </Typography>
        <TextField
          label="System Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="outlined"
          onClick={handleAddSystem}
          sx={{ margin: 4 }}
        >
          Add System
        </Button>
      </Box>
    </Container>
  );
}
