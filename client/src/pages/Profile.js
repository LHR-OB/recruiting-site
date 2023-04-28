import { React } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
} from '@mui/material';


export default function Profile({ user }) {
  const handleJoinSystem = () => {
    console.log("Join System");
  }

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
        <Typography variant="h4" mt={2}>
          {user?.first_name} {user?.last_name}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
        }}
      >
        <Typography variant="h6" mt={2}>
          Email: {user?.email}
        </Typography>
        <Typography variant="h6" mt={2}>
          Role: {user?.type}
        </Typography>
        <Typography variant="h6" mt={2}>
          Team: {user?.team?.name}
        </Typography>
        <Typography variant="h6" mt={2}>
          Status: {user?.status}
        </Typography>
        <Typography variant="h6" mt={2}>
          Systems: {user?.systems?.map((system) => system.name).join(', ')}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleJoinSystem}
          sx={{
            marginTop: 2,
            width: "25%",
          }}
        >
          Join System
        </Button>
      </Box>
    </Container>
  );
}
