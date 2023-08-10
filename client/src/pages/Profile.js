import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Typography,
} from '@mui/material';
import CenterModal from '../components/CenterModal';
import JoinSystemForm from '../components/JoinSystemForm';
import LeaveSystemForm from '../components/LeaveSystemForm';
import EditProfileForm from '../components/EditProfileForm';
import usersApi from '../api/endpoints/users';


export default function Profile({ user, setUser, setSnackbarData }) {
  // States
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    if (user && parseInt(id) !== user.id) {
      usersApi.getUserById(id).then((res) => {
        if (res.status === 200) {
          setProfileUser(res.data);
        }
      });
    } else {
      setProfileUser(user);
    }
  }, [user, id]);

  const handleJoinSystem = () => {
    setOpen(true);
    setModalMode("JOIN");
  }

  const handleLeaveSystem = () => {
    setOpen(true);
    setModalMode("LEAVE");
  }

  const handleUpdateProfile = () => {
    setOpen(true);
    setModalMode("UPDATE");
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
          {profileUser?.first_name} {profileUser?.last_name}
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
          Email: {profileUser?.email}
        </Typography>
        <Typography variant="h6" mt={2}>
          Role: {profileUser?.type?.replace('_', ' ')}
        </Typography>
        {
          profileUser?.type !== "APPLICANT" &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" mt={2}>
              Team: {profileUser?.team?.name}
            </Typography>
            <Typography variant="h6" mt={2}>
              Interview Location: {profileUser?.interview_location}
            </Typography>
            <Typography variant="h6" mt={2}>
              Systems: {profileUser?.systems?.map((system) => system.name).join(', ')}
            </Typography>
          </Box>
        }
        {
          user?.id === profileUser?.id &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleUpdateProfile}
              sx={{
                marginTop: 2,
                width: "25%",
              }}
            >
              Update Profile
            </Button>
          </Box>
        }
        {
          profileUser?.type !== "APPLICANT" && user?.id === profileUser?.id &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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
        }
      </Box>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        {modalMode === "UPDATE" ?
          <EditProfileForm user={user} setUser={setUser} setSnackbarData={setSnackbarData} setOpen={setOpen} /> :
          modalMode === "JOIN" ?
          <JoinSystemForm user={user} setUser={setUser} setSnackbarData={setSnackbarData} setOpen={setOpen} /> :
          <LeaveSystemForm user={user} setUser={setUser} setSnackbarData={setSnackbarData} setOpen={setOpen} />
        }
      </CenterModal>
    </Container>
  );
}
