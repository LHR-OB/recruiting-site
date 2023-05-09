import { React, useState, useEffect } from 'react';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import CenterModal from './CenterModal';
import availabilitiesApi from '../api/endpoints/availabilities';
import eventsApi from '../api/endpoints/events';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';
import ScheduleInterviewForm from './ScheduleInterviewForm';

export default function InterviewAvailabilityList({ user, setSnackbarData }) {
    // States
    const [availabilities, setAvailabilities] = useState({});
    const [applicationCycle, setApplicationCycle] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // This function is long and ugly, but breaking it up caused issues with state transfer, so I left it as is. If it works it works yaknow
        if (user && applicationCycle) {
            applicationsApi.getApplicationsByUser(applicationCycle.id, user.id).then((res) => {
                if (res.status === 200) {
                    for (let application of res.data) {
                        if (application.status === "INTERVIEW") {
                            availabilitiesApi.getAvailabilitiesBySystem(application.system.id).then((res) => {
                                if (res.status === 200) {
                                    const availabilities = res.data;
                                    const interviewTimes = [];
                                    for (let availability of availabilities) {
                                        const start = new Date(availability.start_time).getTime() - availability.offset * 60 * 60 * 1000;
                                        const end = new Date(availability.end_time).getTime() - availability.offset * 60 * 60 * 1000;
                                        eventsApi.getEventsByUser(availability.user_id).then((res) => {
                                            // TODO: also check conflicts with current user
                                            if (res.status === 200) {
                                                for (let i = start; i + (application.team.interview_time_duration * 60 * 1000) <= end + (30 * 60 * 1000); i += application.team.interview_time_duration * 60 * 1000) {
                                                    const start_time = i;
                                                    const end_time = i + application.team.interview_time_duration * 60 * 1000;
                                                    const events = res.data;
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
                                                            location: application.system.interview_default_location,
                                                        });
                                                    }
                                                }
                                            }
                                            interviewTimes.sort((a, b) => a.start_time - b.start_time);
                                            setAvailabilities((oldAvailabilities) => ({
                                                ...oldAvailabilities,
                                                [application.team.name + " " + application.system.name]: interviewTimes,
                                            }));
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }, [user, applicationCycle]);

    useEffect(() => {
        applicationCyclesApi.getApplicationCycleActive().then((res) => {
            if (res.status === 200) {
                setApplicationCycle(res.data);
            }
        });
    }, []);

    const handleClickAvailability = (system, availability) => {
        setSelectedInterview({
            system: system,
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
                {
                    availabilities.length ? Object.keys(availabilities).map((systemNameFull) => (
                        <Box key={systemNameFull}>
                            <Typography variant="h6" component="h2">
                                {systemNameFull}
                            </Typography>
                            <List>
                                {availabilities[systemNameFull].map((availability, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemButton
                                            onClick={() => handleClickAvailability(systemNameFull, availability)}
                                        >
                                            <ListItemText primary={new Date(availability.start_time).toLocaleString() + " - " + new Date(availability.end_time).toLocaleString()} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))
                    :
                    <Container>
                        <Typography variant="h6">
                            No Remaining Interview Availabilities
                        </Typography>
                        <Typography variant="body1">
                            If you still need to schedule an interview, please contact an administrator to ask for more times to be made available.
                        </Typography>
                    </Container>
                }
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
