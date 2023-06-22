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
import ApplicationCycleClosed from '../components/ApplicationCycleClosed';

export default function Applications({ user, setSnackbarData }) {
  // States
  const [applicationCycle, setApplicationCycle] = useState(null);
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [acceptingApplications, setAcceptingApplications] = useState(false);

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

  useEffect(() => {
    if (applicationCycle) {
      const today = new Date().setHours(0, 0, 0, 0);
      const openDate = new Date(applicationCycle.application_open_date).setHours(0, 0, 0, 0);
      const closeDate = new Date(applicationCycle.application_close_date).setHours(0, 0, 0, 0);
      if (openDate <= today && today <= closeDate) {
        setAcceptingApplications(true);
      } else {
        setAcceptingApplications(false);
      }
    } else {
      setAcceptingApplications(false);
    }
  }, [applicationCycle]);

  if (!acceptingApplications) return (
    <ApplicationCycleClosed />
  )

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
          applications={applications}
          setApplications={setApplications}
          setSnackbarData={setSnackbarData}
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
              <NewApplicationForm setApplications={setApplications} setSnackbarData={setSnackbarData} setOpen={setOpen} /> :
              <ViewApplication user={user} application={application} setApplication={setApplication} setApplications={setApplications} setSnackbarData={setSnackbarData} setOpen={setOpen} />
          }
        </CenterModal>
      </Box>
    </Container>
  );
}
