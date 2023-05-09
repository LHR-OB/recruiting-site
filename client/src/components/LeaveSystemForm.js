import { React, useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';

export default function LeaveSystemForm({ user, userSystems, setUserSystems, setSnackbarData, setOpen }) {
  // States
  const [system, setSystem] = useState({});

  const handleLeaveSystem = () => {
    usersApi.leaveSystem(user.id, system.id).then((res) => {
      if (res.status === 200) {
        setUserSystems(res.data.systems);
        setSnackbarData({
          open: true,
          message: 'Successfully left system!',
          severity: 'success'
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Failed to leave system!',
        severity: 'error'
      });
    });
  }

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
          Leave System
        </Typography>
        <FormControl
          fullWidth
          variant="standard"
        >
          <InputLabel>System</InputLabel>
          <Select
            value={system || ''}
            label="System"
            onChange={(e) => setSystem(e.target.value)}
          >
            {userSystems.map(system => (
              <MenuItem key={system.id} value={system}>{system.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLeaveSystem}
          sx={{ margin: 4 }}
        >
          Leave System
        </Button>
      </Box>
    </Container>
  )
}
