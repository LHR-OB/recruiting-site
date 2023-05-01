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
import ViewApplication from '../components/ViewApplication';

export default function Applications({ user }) {
  // States
  const [applicationCycle, setApplicationCycle] = useState(null);
  const [application, setApplication] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  useEffect(() => {
    // Get active application cycle
    applicationCyclesApi.getApplicationCycleActive().then(res => {
      setApplicationCycle(res.data);
    });
  }, []);

  const handleNewApplication = () => {
    setOpen(true);
    setModalMode('NEW');
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
        <ApplicationsTable
          user={user}
          setOpen={setOpen}
          setModalMode={setModalMode}
          setApplication={setApplication}
        />
        {user?.type === 'APPLICANT' && applicationCycle?.stage === 'APPLICATION' &&
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
          {
            modalMode === 'NEW' ?
              <NewApplicationForm /> :
              <ViewApplication user={user} application={application} setApplication={setApplication} />
          }
        </CenterModal>
      </Box>
    </Container>
  );
}
