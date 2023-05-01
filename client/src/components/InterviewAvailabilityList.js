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
import availabilitiesApi from '../api/endpoints/availabilities';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';

export default function InterviewAvailabilityList({ user }) {
    // States
    const [availabilities, setAvailabilities] = useState({});
    const [applicationCycle, setApplicationCycle] = useState(null);

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
                    Object.keys(availabilities).map((systemName) => (
                        <Box key={systemName}>
                            <Typography variant="h6" component="h2">
                                {systemName}
                            </Typography>
                            <List>
                                {availabilities[systemName].map((availability) => (
                                    <ListItem key={availability.start_time}>
                                        <ListItemButton
                                            onClick={() => { }}
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
        </Container>
    );
}
