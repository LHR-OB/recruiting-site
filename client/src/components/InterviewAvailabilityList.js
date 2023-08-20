import { React, useState, useEffect } from 'react';
import {
    Box,
    Container,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CenterModal from './CenterModal';
import availabilitiesApi from '../api/endpoints/availabilities';
import eventsApi from '../api/endpoints/events';
import usersApi from '../api/endpoints/users';
import { systemsApi } from '../api/endpoints/teams';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';
import ScheduleInterviewForm from './ScheduleInterviewForm';

export default function InterviewAvailabilityList({ user, setSnackbarData }) {
    // States
    const [value, onChange] = useState(new Date());
    const [dayAvailabilities, setDayAvailabilities] = useState([]);
    const [highlightedDays, setHighlightedDays] = useState(new Set());
    const [availabilities, setAvailabilities] = useState([]);
    const [applicationCycle, setApplicationCycle] = useState(null);
    const [systems, setSystems] = useState([]);
    const [selectedSystem, setSelectedSystem] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Gets the systems available for interview
        if (user && applicationCycle) {
            applicationsApi.getApplicationsByUser(applicationCycle.id, user.id).then((res) => {
                if (res.status === 200) {
                    setSystems([]);
                    for (let application of res.data) {
                        if (application.status === "INTERVIEW") {
                            setSystems((prev) => [...prev, {
                                name: application.team.name + " " + application.system.name,
                                id: application.system.id,
                                application: application,
                                scheduled: false,
                            }]);
                        } else if (application.status === "INTERVIEW_SCHEDULED") {
                            setSystems((prev) => [...prev, {
                                name: application.team.name + " " + application.system.name,
                                id: application.system.id,
                                application: application,
                                scheduled: true,
                            }]);
                        }
                    }
                }
            });
        }
    }, [user, applicationCycle]);

    useEffect(() => {
        // Get active application cycle
        applicationCyclesApi.getApplicationCycleActive().then((res) => {
            if (res.status === 200) {
                setApplicationCycle(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (availabilities) {
          // Mark days with events
          const newHighlightedDays = new Set();
          availabilities.forEach((availability) => {
            const eventDate = new Date(availability.start_time);
            newHighlightedDays.add(new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).toDateString());
          });
          setHighlightedDays(newHighlightedDays);
          // Sort events
          availabilities.sort((a, b) => {
            return new Date(a.start_time) - new Date(b.start_time);
          });
        }
    }, [availabilities]);

    useEffect(() => {
        const newDayAvailabilities = availabilities.filter((availability) => {
            const eventDate = new Date(availability.start_time);
            return (
                eventDate.getDate() === value.getDate() &&
                eventDate.getMonth() === value.getMonth() &&
                eventDate.getFullYear() === value.getFullYear()
            );
        });
        setDayAvailabilities(newDayAvailabilities);
    }, [value, availabilities]);

    const getNonConflictingTimes = (availability, events, application, interviewer) => {
        const availabilityStart = new Date(availability.start_time).getTime() - availability.offset * 60 * 60 * 1000;
        const availabilityEnd = new Date(availability.end_time).getTime() - availability.offset * 60 * 60 * 1000;
        const interviewTimes = [];
        for (let i = availabilityStart; i + (application.team.interview_time_duration * 60 * 1000) <= availabilityEnd + (30 * 60 * 1000); i += application.team.interview_time_duration * 60 * 1000) {
            const start_time = i;
            const end_time = i + application.team.interview_time_duration * 60 * 1000;
            let conflict = false;
            for (let event of events) {
                const event_start_time = new Date(event.start_time).getTime() - event.offset * 60 * 60 * 1000;
                const event_end_time = new Date (event.end_time).getTime() - event.offset * 60 * 60 * 1000;
                if ((event_start_time < end_time && event_end_time > start_time) || (start_time < event_end_time && end_time > event_start_time)) {
                    conflict = true;
                    break;
                }
            }
            if (!conflict) {
                interviewTimes.push({
                    start_time: new Date(start_time),
                    end_time: new Date(end_time),
                    offset: availability.offset,
                    interviewer_id: availability.user_id,
                    application_id: application.id,
                    location: interviewer.interview_location || application.system.interview_default_location,
                });
            }
        }
        return interviewTimes;
    }

    const handleSelectSystem = (system) => {
        if (system.scheduled) return;   // Shouldn't get here, but just in case
        setSelectedSystem(system);
        setAvailabilities([]);
        // Get availabilities for system
        availabilitiesApi.getAvailabilitiesBySystem(system.id).then((res) => {
            if (res.status === 200) {
                // Go through each availability window
                for (let availability of res.data) {
                    // Get all events for the interviewer
                    usersApi.getUserById(availability.user_id).then((res) => {
                        if (res.status === 200) {
                            const interviewer = res.data;
                            eventsApi.getEventsByUser(interviewer.id).then((res) => {
                                if (res.status === 200) {
                                    // Get all non-conflicting times
                                    const interviewTimes = getNonConflictingTimes(availability, res.data, system.application, interviewer);
                                    // Add to availabilities
                                    setAvailabilities((prev) => ([...prev, ...interviewTimes]));
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    const handleClickAvailability = (availability) => {
        console.log(selectedSystem.name);
        setSelectedInterview({
            system: selectedSystem?.name,
            start_time: availability.start_time,
            end_time: availability.end_time,
            offset: availability.offset,
            interviewer_id: availability.interviewer_id,
            application_id: availability.application_id,
            location: availability.location,
        });
        setOpen(true);
    };

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
                {/* Select System */}
                <Typography variant="h6" mt={2}>
                    Select System
                </Typography>
                <FormControl
                    variant="standard"
                    sx={{
                        minWidth: '50%',
                    }}
                >
                    <InputLabel>System</InputLabel>
                    <Select
                        value={selectedSystem || ''}
                        label="System"
                        onChange={(e) => handleSelectSystem(e.target.value)}
                    >
                        {systems.map(system => (
                            <MenuItem
                                key={system.id}
                                value={system}
                                disabled={system.scheduled}
                            >
                                {system.name} {system.scheduled ? "(Scheduled)" : ""}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Calendar */}
                <br />
                <br />
                <ReactCalendar
                    value={value}
                    onChange={onChange}
                    tileContent={({ date }) => {
                        if (highlightedDays.has(new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString())) {
                          return (
                            <b>
                              {'*'}
                            </b>
                          );
                        }
                    }}
                />
                <Typography variant="h6" mt={2}>
                    {value.toDateString()}
                    </Typography>
                    <List>
                    {dayAvailabilities.map((availability, index) => (
                        <ListItem key={index}>
                            <ListItemButton
                                onClick={() => handleClickAvailability(availability)}
                            >
                                <ListItemText
                                    primary={availability.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + availability.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <CenterModal
                open={open}
                handleClose={() => setOpen(false)}
            >
                <ScheduleInterviewForm interview={selectedInterview} setSnackbarData={setSnackbarData} setOpen={setOpen} />
            </CenterModal>
        </Container>
    );
}
