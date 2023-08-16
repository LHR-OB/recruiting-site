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
  const [q1Wrap, setQ1Wrap] = useState(false);

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
        <Grid item xs={8}>
          {/* Name */}
          <Typography variant="h4" mt={2}>
            {application?.user?.first_name + ' ' + application?.user?.last_name}
          </Typography>
          {/* Team */}
          <Typography display="inline" variant="h6" mt={2}>
            Team:
          </Typography>
          <Typography display="inline" variant="subtitle1" mt={2}>
            {' ' + application?.team?.name}
          </Typography>
          <br />
          {/* System */}
          <Typography display="inline" variant="h6" mt={2}>
            System:
          </Typography>
          <Typography display="inline" variant="subtitle1" mt={2}>
            {' ' + application?.system?.name}
          </Typography>
          <br />
          {/* Email */}
          <Typography display="inline" variant="h6" mt={2}>
            Email:
          </Typography>
          <Typography display="inline" variant="subtitle1" mt={2}>
            {' ' + application?.user?.email}
          </Typography>
          <br />
          {/* Phone Number */}
          <Typography display="inline" variant="h6" mt={2}>
            Phone Number:
          </Typography>
          <Typography display="inline" variant="subtitle1" mt={2}>
            {' ' + application?.phone_number}
          </Typography>
          <br />
          {/* Year Entering */}
          <Typography display="inline" variant="h6" mt={2}>
            Year Entering:
          </Typography>
          <Typography display="inline" variant="subtitle1" mt={2}>
            {' ' + application?.year_entering}
          </Typography>
          {/* Major */}
          <Typography variant="h6" mt={2}>
            Major:
          </Typography>
          <Typography variant="subtitle1" mt={2} noWrap>
            {' ' + application?.major}
          </Typography>
          {/* Short Answers */}
          <Typography variant="h6" mt={2}>
            Short Answers (click to expand):
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            noWrap={!q1Wrap}
            onClick={() => setQ1Wrap(!q1Wrap)}
            sx={{ cursor: 'pointer' }}
          >
            {' ' + application?.short_answer}
          </Typography>
          {/* Resume */}
          <Typography variant="subtitle1" mt={2}>
            <a href={application?.resume_link} target='_blank' rel='noreferrer'>Resume</a>
          </Typography>
          <Typography variant="subtitle1" mt={2}>
            <a href={application?.portfolio_link} target='_blank' rel='noreferrer'>Portfolio</a>
          </Typography>
        </Grid>
        {
          user.type !== 'APPLICANT' &&
          <Grid item xs={4}>
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

      {user.type !== 'APPLICANT' && application?.status !== 'OFFER' && application?.status !== 'ACCEPTED' && !application?.status.includes("REJECTED") && <Grid container spacing={1}>
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
