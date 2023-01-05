import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { applicationCyclesApi } from '../api/endpoints/applications';
import ApplicationsTable from '../components/ApplicationsTable';
import CenterModal from '../components/CenterModal';
import NewApplicationForm from '../components/NewApplicationForm';

export default function Applications({ user }) {
  // States
  const [applicationCycle, setApplicationCycle] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Get active application cycle
    applicationCyclesApi.getApplicationCycleActive().then(res => {
      setApplicationCycle(res.data);
    });
  }, []);

  const handleNewApplication = () => {
    setOpen(true);
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
          Applications for {applicationCycle?.semester + ' ' + applicationCycle?.year}
        </Typography>
        <ApplicationsTable user={user} />
        {user?.type === 'APPLICANT' &&
          <Button
            variant="outlined"
            onClick={handleNewApplication}
            sx={{ marginTop: 2 }}
          >
            New Application
          </Button>
        }
        <CenterModal
          open={open}
          handleClose={() => setOpen(false)}
        >
          <NewApplicationForm user={user} applicationCycle={applicationCycle} />
        </CenterModal>
      </Box>
    </Container>
  );
}
