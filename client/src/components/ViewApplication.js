import { React, useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { applicationsApi } from '../api/endpoints/applications';
import { interviewNotesApi } from '../api/endpoints/interviews';

export default function ViewApplication({ user, application, setApplication, setApplications, setSnackbarData, setOpen }) {
  // States
  const [interviewNotes, setInterviewNotes] = useState([]);

  useEffect(() => {
    if (application && application.interview_id && user?.type !== 'APPLICANT') {
      interviewNotesApi.getInterviewNotesByInterview(application.interview_id).then(res => {
        if (res.status === 200) {
          setInterviewNotes(res.data);
        }
      });
    }
  }, [application, user]);

  const handleAccept = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'ACCEPT' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
        setApplications((curr) => {
          const index = curr.findIndex(a => a.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          message: 'Application marked accepted',
          severity: 'success',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Error marking application accepted',
        severity: 'error',
      });
    });
  }

  const handleNeutral = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'NEUTRAL' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
        setApplications((curr) => {
          const index = curr.findIndex(a => a.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          message: 'Application marked neutral',
          severity: 'success',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Error marking application neutral',
        severity: 'error',
      });
    });
  }

  const handleReject = () => {
    applicationsApi.updateApplication(application.id, { stage_decision: 'REJECT' }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
        setApplications((curr) => {
          const index = curr.findIndex(a => a.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          message: 'Application marked rejected',
          severity: 'success',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Error marking application rejected',
        severity: 'error',
      });
    });
  }

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs>
          <Typography variant="h4" mt={2}>
            {application?.user?.first_name + ' ' + application?.user?.last_name}
          </Typography>
          <Typography variant="h6" mt={2}>
            Team: {application?.team?.name}
          </Typography>
          <Typography variant="h6" mt={2}>
            System: {application?.system?.name}
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
        </Grid>
        {
          user.type !== 'APPLICANT' &&
          <Grid item xs>
            <Typography variant="h4" mt={2}>
              Interview Notes
            </Typography>
            {
              interviewNotes.length === 0 && 
              <Typography variant="body1" mt={2} sx={{ fontStyle: "italic" }}>
                No interview notes
              </Typography>
            }
            {
              interviewNotes.map((note, index) => (
                <Typography variant="body1" mt={2} key={index}>
                  {note.note.split('\n').map((item, i) => (
                      <p key={i}>{item}<br /></p>
                  ))}
                </Typography>
              ))
            }
          </Grid>
        }
      </Grid>

      {user.type !== 'APPLICANT' && application?.status !== 'OFFER' && application?.status !== 'ACCEPTED' && application?.status !== 'REJECTED' && <Grid container spacing={1}>
        <Grid item xs>
          <Button
            variant="outlined"
            color="success"
            onClick={handleAccept}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'ACCEPT' ? 'green' : 'white',
              color: application.stage_decision === 'ACCEPT' ? 'white' : 'green',
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
              color: application.stage_decision === 'NEUTRAL' ? 'white' : 'primary.main',
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
              color: application.stage_decision === 'REJECT' ? 'white' : 'red',
            }}
          >
            Mark Rejected
          </Button>
        </Grid>
      </Grid>}
    </Container>
  );
}
