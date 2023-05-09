import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
} from '@mui/material';
import ScheduleSelector from 'react-schedule-selector';

import availabilitiesApi from '../api/endpoints/availabilities';
import { applicationCyclesApi } from '../api/endpoints/applications';


export default function InterviewAvailabilityCalendar({ user, setSnackbarData }) {
  // States
  const [schedule, setSchedule] = useState([]);
  const [applicationCycle, setApplicationCycle] = useState(null);

  useEffect(() => {
    // Get the current active application cycle
    applicationCyclesApi.getApplicationCycleActive().then((res) => {
      if (res.status === 200) {
        setApplicationCycle(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      availabilitiesApi.getAvailabilitiesCurrentUser().then((res) => {
        if (res.status === 200) {
          const currentSchedule = [];
          for (let availability of res.data) {
            // Split availability into 30 minute chunks for schedule
            const start = (new Date(availability.start_time)).getTime();
            const end = (new Date(availability.end_time)).getTime();
            const offset = availability.offset;
            for (let i = start; i <= end; i += 30 * 60 * 1000) {
              currentSchedule.push(new Date(i) - offset * 60 * 60 * 1000);
            }
          }
          setSchedule(currentSchedule.map((date) => new Date(date)));
        }
      });
    }
  }, [user]);

  const handleSetSchedule = () => {
    // Create new array of availabilities by grouping consecutive 30 minute time blocks
    const availabilities = [];
    let start = null;
    let end = null;
    for (let i = 0; i < schedule.length; i++) {
      if (start === null) {
        start = schedule[i];
      }
      if (schedule[i + 1] - schedule[i] > 30 * 60 * 1000) {
        end = schedule[i];
        availabilities.push({
          start_time: new Date(start),
          end_time: new Date(end),
          offset: new Date(start).getTimezoneOffset() / 60,
        });
        start = null;
      }
    }
    if (schedule.length > 0) {
      availabilities.push({
        start_time: new Date(start),
        end_time: new Date(schedule[schedule.length - 1]),
        offset: new Date(start).getTimezoneOffset() / 60,
      });
    }
    availabilitiesApi.setAvailabilities(availabilities).then((res) => {
      if (res.status === 200) {
        setSnackbarData({
          open: true,
          message: 'Successfully set interview availability.',
          severity: 'success',
        });
      }
    }, (err) => {
      setSnackbarData({
        open: true,
        message: 'Failed to set interview availability.',
        severity: 'error',
      });
    });
  }

  const getInterviewDays = () => {
    if (applicationCycle) {
      const start = new Date(applicationCycle.interview_start_date);
      const end = new Date(applicationCycle.interview_end_date);
      const numDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return numDays;
    }
    return 1;
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
        <Button
          variant="outlined"
          onClick={handleSetSchedule}
        >
          Set Schedule
        </Button>
        <ScheduleSelector
          selection={schedule}
          startDate={applicationCycle?.interview_start_date}
          numDays={getInterviewDays()}
          minTime={8}
          maxTime={22}
          hourlyChunks={2}
          onChange={(newSchedule) => {
            newSchedule.sort((a, b) => a - b);
            setSchedule(newSchedule);
          }}
        />
      </Box>
    </Container>
  );
}
