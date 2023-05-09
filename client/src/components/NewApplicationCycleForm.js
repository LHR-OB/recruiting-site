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

export default function NewApplicationCycleForm({ applicationCycles, setApplicationCycles, setSnackbarData, setOpen }) {
  // States
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [openDate, setOpenDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [interviewStartDate, setInterviewStartDate] = useState(null);
  const [interviewEndDate, setInterviewEndDate] = useState(null);

  const handleAddNewApplicationCycle = () => {
    // Get any current active application cycles and set them to inactive
    for (let applicationCycle in applicationCycles) {
      if (applicationCycle.is_active) {
        applicationCyclesApi.updateApplicationCycle(applicationCycle.id, {
          is_active: false,
        });
      }
    }
    applicationCyclesApi.createApplicationCycle({
      year: year,
      semester: semester,
      application_open_date: new Date(openDate),
      application_close_date: new Date(closeDate),
      interview_start_date: new Date(interviewStartDate),
      interview_end_date: new Date(interviewEndDate),
      is_active: true,
    }).then((res) => {
      if (res.status === 200) {
        setApplicationCycles((curr) => ([...curr, res.data]));
        setSnackbarData({
          open: true,
          severity: 'success',
          message: 'New application cycle created',
        });
        setOpen(false);
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Error creating new application cycle',
      });
    });
  };

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
          Create New Application Cycle
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
          onClick={handleAddNewApplicationCycle}
          sx={{ margin: 4 }}
        >
          Create Application Cycle
        </Button>
      </Box>
    </Container>
  );
}
