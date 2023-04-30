import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import ScheduleSelector from 'react-schedule-selector';

import CenterModal from './CenterModal';
import availabilitiesApi from '../api/endpoints/availabilities';
import { applicationCyclesApi } from '../api/endpoints/applications';


export default function InterviewAvailabilityList({ user }) {
  // States
  const [oldAvailabilities, setOldAvailabilities] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [applicationCycle, setApplicationCycle] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  const handleSetSchedule = () => {
    if (schedule.length === 0) {
      for (let oldAvailability of oldAvailabilities) {
        availabilitiesApi.deleteAvailability(oldAvailability.id);
      }
      return;
    } 
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
    availabilities.push({
      start_time: new Date(start),
      end_time: new Date(schedule[schedule.length - 1]),
      offset: new Date(start).getTimezoneOffset() / 60,
    });
    console.log(availabilities);
    // Send to backend
    for (let oldAvailability of oldAvailabilities) {
      availabilitiesApi.deleteAvailability(oldAvailability.id);
    }
    for (let availability of availabilities) {
      availabilitiesApi.createAvailability(availability);
    }
  }

  useEffect(() => {
    console.log(schedule);
  }, [schedule]);

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
      if (user?.type === 'applicant') {
        // Get all availabilities that they are approved for
        // TODO
      } else {
        availabilitiesApi.getAvailabilitiesByUser(user.id).then((res) => {
          if (res.status === 200) {
            setOldAvailabilities(res.data);
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
            setSchedule(currentSchedule);
          }
        });
      }
    }
  }, [user]);

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
          endDate={applicationCycle?.end_date}
          minTime={8}
          maxTime={22}
          hourlyChunks={2}
          onChange={(newSchedule) => setSchedule(newSchedule)}
        />
      </Box>
    </Container>
  );
}