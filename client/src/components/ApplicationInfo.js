import { React, useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
} from '@mui/material';

import CenterModal from './CenterModal';
import EditApplicationInfoForm from './EditApplicationInfoForm';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';

export default function ApplicationInfo({ team, setTeam, setTeams, setSnackbarData }) {
  // States
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState([]);

  const handleEditApplicationInfo = () => {
    setOpen(true);
  }

  useEffect(() => {
    if (team) {
      applicationCyclesApi.getApplicationCycleActive().then((res) => {
        if (res.status === 200) {
          applicationsApi.getApplicationsByTeam(res.data.id, team.id).then((res) => {
            if (res.status === 200) {
              setApplications(res.data);
            }
          })
        }
      })
    }
  }, [team]);

  const getUniqueApplicationsLength = (applications) => {
    const uniqueApplications = [];
    applications.forEach((application) => {
      if (!uniqueApplications.some((uniqueApplication) => uniqueApplication.user_id === application.user_id)) {
        uniqueApplications.push(application);
      }
    });
    return uniqueApplications.length;
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        Application Info
      </Typography>
      <Typography variant="body1" mt={2}>
        Applications: {applications.length} {' '}
        ({getUniqueApplicationsLength(applications)} unique)
      </Typography>
      <Typography variant="body1" mt={2}>
        Stage Accepted: {applications.filter((application) => application.stage_decision === 'ACCEPT').length} {' '}
        ({getUniqueApplicationsLength(applications.filter((application) => application.stage_decision === 'ACCEPT'))} unique)
      </Typography>
      <Typography variant="body1" mt={2}>
        Stage Rejected: {applications.filter((application) => application.stage_decision === 'REJECT').length} {' '}
        ({getUniqueApplicationsLength(applications.filter((application) => application.stage_decision === 'REJECT'))} unique)
      </Typography>
      <Typography variant="body1" mt={2}>
        Stage Neutral: {applications.filter((application) => application.stage_decision === 'NEUTRAL').length} {' '}
        ({getUniqueApplicationsLength(applications.filter((application) => application.stage_decision === 'NEUTRAL'))} unique)
      </Typography>
      <Button
        variant="outlined"
        onClick={handleEditApplicationInfo}
        sx={{ mt: 2 }}
      >
        Edit Application Info
      </Button>
      <CenterModal
        open={open}
        handleClose={() => {setOpen(false)}}
      >
        <EditApplicationInfoForm team={team} setTeam={setTeam} setTeams={setTeams} setSnackbarData={setSnackbarData} setOpen={setOpen} />
      </CenterModal>
    </Container>
  );
}
