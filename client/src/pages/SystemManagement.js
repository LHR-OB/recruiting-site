import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography,
} from '@mui/material';
import { systemsApi } from '../api/endpoints/teams';
import SystemOverview from '../components/SystemOverview';

export default function SystemManagement({ user, setSnackbarData }) {
  // States
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);

  useEffect(() => {
    if (user) {
      setSystems(user.systems);
      setSelectedSystem(user.systems[0]);
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
          System Management
        </Typography>
        <ButtonGroup variant="outlined">
          {systems.map((system) => (
            <Button
              key={system.id}
              onClick={() => setSelectedSystem(system)}
              sx={{
                backgroundColor: selectedSystem?.id === system.id ? 'primary.main' : 'white',
                color: selectedSystem?.id === system.id ? 'white' : 'primary.main',
              }}
            >
              {system.name}
            </Button>
          ))}
        </ButtonGroup>
        <br />
        <SystemOverview system={selectedSystem} setSystem={setSelectedSystem} setSystems={setSystems} setSnackbarData={setSnackbarData} />
      </Box>
    </Container>
  );
}
