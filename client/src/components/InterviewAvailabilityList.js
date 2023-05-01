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
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';
import ScheduleInterviewForm from './ScheduleInterviewForm';

export default function InterviewAvailabilityList({ user }) {
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
                                        for (let i = start; i + (application.team.interview_time_duration * 60 * 1000) <= end + (30 * 60 * 1000); i += application.team.interview_time_duration * 60 * 1000) {
                                            interviewTimes.push({
                                                start_time: new Date(i),
                                                end_time: new Date(i + application.team.interview_time_duration * 60 * 1000),
                                                interviewer_id: availability.user_id,
                                            });
                                        }
                                    }
                                    setAvailabilities((oldAvailabilities) => ({
                                        ...oldAvailabilities,
                                        [application.team.name + " " + application.system.name]: interviewTimes,
                                    }));
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
            interviewer_id: availability.interviewer_id,
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
                    Object.keys(availabilities).map((systemNameFull) => (
                        <Box key={systemNameFull}>
                            <Typography variant="h6" component="h2">
                                {systemNameFull}
                            </Typography>
                            <List>
                                {availabilities[systemNameFull].map((availability) => (
                                    <ListItem key={availability.start_time}>
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
                }
            </Box>
            <CenterModal
                open={open}
                handleClose={() => setOpen(false)}
            >
                <ScheduleInterviewForm interview={selectedInterview} />
            </CenterModal>
        </Container>
    );
}
