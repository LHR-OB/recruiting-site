import { React, useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
} from '@mui/material';
import CenterModal from '../components/CenterModal';
import JoinSystemForm from '../components/JoinSystemForm';
import LeaveSystemForm from '../components/LeaveSystemForm';


export default function Profile({ user, setSnackbarData }) {
  // States
  const [open, setOpen] = useState(false);
  const [join, setJoin] = useState(false);
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    if (user) {
      setSystems(user.systems);
    }
  }, [user]);

  const handleJoinSystem = () => {
    setOpen(true);
    setJoin(true);
  }

  const handleLeaveSystem = () => {
    setOpen(true);
    setJoin(false);
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
          Systems: {systems?.map((system) => system.name).join(', ')}
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
        <Button
          variant="outlined"
          color="error"
          onClick={handleLeaveSystem}
          sx={{
            marginTop: 2,
            width: "25%",
          }}
        >
          Leave System
        </Button>
      </Box>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        {join ?
          <JoinSystemForm user={user} setUserSystems={setSystems} setSnackbarData={setSnackbarData} setOpen={setOpen} /> :
          <LeaveSystemForm user={user} userSystems={systems} setUserSystems={setSystems} setSnackbarData={setSnackbarData} setOpen={setOpen} />
        }
      </CenterModal>
    </Container>
  );
}
