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
import { systemsApi } from '../api/endpoints/teams';

export default function JoinSystemForm({ user }) {
  // States
  const [systems, setSystems] = useState([]);
  const [system, setSystem] = useState({});

  const handleJoinSystem = () => {
    usersApi.joinSystem(user.id, system.id).then((res) => {
      if (res.status === 200) {
        console.log('Joined system successfully');
      }
    });
  }

  useEffect(() => {
    if (user) {
      // Get all systems
      systemsApi.getSystemsByTeam(user.team_id).then((res) => {
        if (res.status === 200) {
          setSystems(res.data);
        }
      });
    }
  }, [user]);

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
          Join System
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
            {systems.map(system => (
              <MenuItem key={system.id} value={system}>{system.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={handleJoinSystem}
          sx={{ margin: 4 }}
        >
          Join System
        </Button>
      </Box>
    </Container>
  )
}
