import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { applicationCyclesApi } from '../api/endpoints/applications';

export default function EditApplicationCycleForm({ applicationCycle, setApplicationCycles, setSnackbarData, setOpen }) {
  // States
  const [year, setYear] = useState(applicationCycle?.year);
  const [semester, setSemester] = useState(applicationCycle?.semester);
  const [openDate, setOpenDate] = useState(applicationCycle?.application_open_date);
  const [closeDate, setCloseDate] = useState(applicationCycle?.application_close_date);
  const [interviewStartDate, setInterviewStartDate] = useState(applicationCycle?.interview_start_date);
  const [interviewEndDate, setInterviewEndDate] = useState(applicationCycle?.interview_end_date);
  const [confirm, setConfirm] = useState(false);

  const applicationCycleStages = [
    "APPLICATION",
    "REVIEW",
    "INTERVIEW",
    "TRIAL",
    "OFFER",
    "COMPLETE",
  ];

  const handleUpdateApplicationCycle = () => {
    applicationCyclesApi.updateApplicationCycle(applicationCycle.id, {
      year: year,
      semester: semester,
      application_open_date: new Date(openDate),
      application_close_date: new Date(closeDate),
      interview_start_date: new Date(interviewStartDate),
      interview_end_date: new Date(interviewEndDate),
    }).then((res) => {
      if (res.status === 200) {
        setApplicationCycles((curr) => {
          const index = curr.findIndex((applicationCycle) => applicationCycle.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Application cycle updated',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error updating application cycle',
      });
    });
  };

  const handleDeleteApplicationCycle = () => {
    applicationCyclesApi.deleteApplicationCycle(applicationCycle.id).then((res) => {
      if (res.status === 200) {
        setApplicationCycles((curr) => {
          const index = curr.findIndex((applicationCycle) => applicationCycle.id === res.data.id);
          curr.splice(index, 1);
          return curr;
        });
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Application cycle deleted',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error deleting application cycle',
      });
    });
  };

  const handleAdvanceStage = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    applicationCyclesApi.advanceApplicationCycle(applicationCycle.id).then((res) => {
      if (res.status === 200) {
        setApplicationCycles((curr) => {
          const index = curr.findIndex((applicationCycle) => applicationCycle.id === res.data.id);
          curr[index] = res.data;
          return curr;
        });
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'Application cycle advanced',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error advancing application cycle',
      });
    });
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Edit {applicationCycle?.semester + ' ' + applicationCycle?.year}
        </Typography>
        <TextField
          label="Year"
          variant="standard"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Semester"
          variant="standard"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          sx={{ width: '100%' }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Application Open Date"
            value={openDate}
            onChange={(openDate) => {
              setOpenDate(openDate);
            }}
            renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
          />
          <DatePicker
            label="Application Close Date"
            value={closeDate}
            onChange={(closeDate) => {
              setCloseDate(closeDate);
            }}
            renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
          />
          <DatePicker
            label="Interview Start Date"
            value={interviewStartDate}
            onChange={(interviewStartDate) => {
              setInterviewStartDate(interviewStartDate);
            }}
            renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
          />
          <DatePicker
            label="Interview End Date"
            value={interviewEndDate}
            onChange={(interviewEndDate) => {
              setInterviewEndDate(interviewEndDate);
            }}
            renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          onClick={handleUpdateApplicationCycle}
          sx={{ marginTop: 2 }}
        >
          Update Application Cycle
        </Button>
        {applicationCycle.stage !== 'COMPLETE' ? <Button
          variant="outlined"
          onClick={handleAdvanceStage}
          sx={{ marginTop: 2 }}
        >
          {
            confirm ? 'Confirm (This Will Notify All Applicants)' : 'Advance to ' + applicationCycleStages[applicationCycleStages.indexOf(applicationCycle.stage) + 1]
          }
        </Button> : null}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteApplicationCycle}
          sx={{ marginTop: 2 }}
        >
          Delete Application Cycle
        </Button>
      </Box>
    </Container>
  );
}
