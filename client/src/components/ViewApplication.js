import { React, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { applicationsApi } from '../api/endpoints/applications';

export default function ViewApplication({ user, application, setApplication }) {

  const handleAccept = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'ACCEPT' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
      }
    });
  }

  const handleNeutral = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'NEUTRAL' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
      }
    });
  }

  const handleReject = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'REJECT' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
      }
    });
  }

  return (
    <Container>
      <Typography variant="h4" mt={2}>
        {application?.user?.first_name + ' ' + application?.user?.last_name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Team: {application?.team?.name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Systems: {application?.systems?.map(s => s.name).join(', ')}
      </Typography>
      <Typography variant="h6" mt={2}>
        Subsystems: {application?.subsystems}
      </Typography>
      <Typography variant="h6" mt={2}>
        Email: {application?.user?.email}
      </Typography>
      <Typography variant="h6" mt={2}>
        Phone: {application?.phone_number}
      </Typography>
      <Typography variant="h6" mt={2}>
        Major: {application?.major}
      </Typography>
      <Typography variant="h6" mt={2}>
        Year Entering: {application?.year_entering}
      </Typography>
      <Typography variant="h6" mt={2}>
        Short Answer
      </Typography>
      <Typography variant="body1" mt={2}>
        {application?.short_answer}
      </Typography>
      <Typography variant="h6" mt={2}>
        Resume: {application?.resume_link}
      </Typography>

      {user.type !== 'APPLICANT' && application?.status !== 'OFFER' && application?.status !== 'ACCEPTED' && application?.status !== 'REJECTED' && <Grid container>
        <Grid item xs>
          <Button
            variant="outlined"
            color="success"
            onClick={handleAccept}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'ACCEPT' ? 'green' : 'white',
            }}
          >
            Mark Accepted
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNeutral}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'NEUTRAL' ? 'primary.main' : 'white',
            }}
          >
            Mark Neutral
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="outlined"
            color="error"
            onClick={handleReject}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'REJECT' ? 'red' : 'white',
            }}
          >
            Mark Rejected
          </Button>
        </Grid>
      </Grid>}
    </Container>
  );
}
