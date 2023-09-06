import { React, useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';
import { interviewNotesApi } from '../api/endpoints/interviews';
import consts from '../config/consts';

export default function ViewApplication({ user, application, setApplication, setApplications, setSnackbarData, setOpen }) {
  // States
  const [interviewNotes, setInterviewNotes] = useState([]);
  const [qWraps, setQWraps] = useState([false, false, false, false]);
  const [shortAnswers, setShortAnswers] = useState(['', '', '', '']); // [shortAnswer1, shortAnswer2, shortAnswer3, shortAnswer4]
  const [otherApplications, setOtherApplications] = useState([]);
  const [showOtherApplications, setShowOtherApplications] = useState(false);

  useEffect(() => {
    if (application && application.interview_id && user?.type !== 'APPLICANT') {
      interviewNotesApi.getInterviewNotesByInterview(application.interview_id).then(res => {
        if (res.status === 200) {
          setInterviewNotes(res.data);
        }
      });
    }
    // Other applications
    if (application && user?.type !== 'APPLICANT') {
      applicationCyclesApi.getApplicationCycleActive().then(res => {
        if (res.status === 200) {
          applicationsApi.getApplicationsByUser(res.data.id, application.user.id).then(res => {
            if (res.status === 200) {
              setOtherApplications(res.data.filter(app => app.id !== application.id));
            }
          });
        }
      })
    }
  }, [application, user]);

  useEffect(() => {
    if (application) {
      setShortAnswers([
        application.short_answer1,
        application.short_answer2,
        application.short_answer4,
        application.short_answer3,
      ]);
    }
  }, [application]);

  const handleMarkStageDecision = (decision) => {
    applicationsApi.updateApplication(application.id, { stage_decision: decision }).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
        setApplications((curr) => {
          const index = curr.findIndex(a => a.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          message: 'Application marked ' + decision,
          severity: 'success',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Error marking application ' + decision,
        severity: 'error',
      });
    });
  }

  const handleConfirmTrialAttendance = () => {
    applicationsApi.updateApplication(application.id, { status: 'TRIAL_CONFIRMED'} ).then(res => {
      if (res.status === 200) {
        setApplication(res.data);
        setApplications((curr) => {
          const index = curr.findIndex(a => a.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          message: 'Trial attendance confirmed',
          severity: 'success',
        });
        setOpen(false);
      }
    });
  }

  const getFullLink = (link) => {
    if (link.includes('http')) {
      return link;
    } else {
      return `//${link}`;
    }
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
          {consts.APPLICATION_QUESTIONS.map((question, index) => (
            <div key={index}>
              <Typography
                variant="subtitle1"
                mt={2}
              >
                {question.question}
              </Typography>
              <Typography
                variant="body1"
                mt={2}
                onClick={() => {
                  const newQWraps = [...qWraps];
                  newQWraps[index] = !newQWraps[index];
                  setQWraps(newQWraps);
                }}
                sx={{ cursor: 'pointer' }}
                noWrap={!qWraps[index]}
              >
                {shortAnswers[index]}
              </Typography>
            </div>
          ))}
          {/* Resume */}
          <Typography variant="subtitle1" mt={2}>
            <a href={getFullLink(application?.resume_link)} target='_blank' rel='noreferrer'>Resume</a>
          </Typography>
          {/* Portfolio */}
          {
            application?.portfolio_link &&
            <Typography variant="subtitle1" mt={2}>
              <a href={getFullLink(application?.portfolio_link)} target='_blank' rel='noreferrer'>Portfolio</a>
            </Typography>
          }
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
            {/* Other Applications */}
            <Typography
              variant="h6"
              mt={2}
              onClick={() => setShowOtherApplications(!showOtherApplications)}
              sx={{ cursor: 'pointer' }}
            >
              Other Applications (click to show)
            </Typography>
            {
              showOtherApplications && otherApplications.map((app, index) => (
                <Typography variant="body1" mt={2} key={index}>
                  {app.team.name} {' '} {app.system.name}: {app.status} ({app.stage_decision})
                </Typography>
              ))
            }
          </Grid>
        }
      </Grid>

      {
        user.type === 'APPLICANT' && application?.status === 'TRIAL' &&
        <Grid item xs>
          <Button
            variant="outlined"
            onClick={handleConfirmTrialAttendance}
            sx={{
              marginTop: 2,
            }}
          >
            Confirm Trial Workday Attendance
          </Button>
        </Grid>
      }

      {user.type !== 'APPLICANT' && application?.status !== 'OFFER' && application?.status !== 'ACCEPTED' && !application?.status.includes("REJECTED") && <Grid container spacing={1}>
        <Grid item xs>
          <Button
            variant="outlined"
            color="success"
            onClick={() => handleMarkStageDecision('ACCEPT')}
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
            onClick={() => handleMarkStageDecision('POSITIVE')}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'POSITIVE' ? 'lightgreen' : 'white',
              color: application.stage_decision === 'POSITIVE' ? 'white' : 'lightgreen',
            }}
          >
            Mark Positive
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleMarkStageDecision('NEUTRAL')}
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
            onClick={() => handleMarkStageDecision('NEGATIVE')}
            sx={{
              marginTop: 2,
              backgroundColor: application.stage_decision === 'NEGATIVE' ? 'orange' : 'white',
              color: application.stage_decision === 'NEGATIVE' ? 'white' : 'orange',
            }}
          >
            Mark Negative
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleMarkStageDecision('REJECT')}
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
