import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { systemsApi } from '../api/endpoints/teams';

export default function NewSystemForm({ team, system }) {
  // States
  const [name, setName] = useState(system?.name);

  const handleUpdateSystem = () => {
    systemsApi.updateSystem(system.id, {
      name,
      team_id: team.id,
    }).then((res) => {
      if (res.status === 200) {
        // TODO: Give success notification
        console.log('System edited successfully');
      }
    });
  };

  const handleDeleteSystem = () => {
    systemsApi.deleteSystem(system.id).then((res) => {
      if (res.status === 200) {
        console.log('System deleted successfully');
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
