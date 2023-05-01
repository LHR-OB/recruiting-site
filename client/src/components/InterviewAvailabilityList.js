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
import { applicationCyclesApi } from '../api/endpoints/applications';

export default function InterviewAvailabilityList({ user }) {
    // States
    const [availabilities, setAvailabilities] = useState([]);
    const [applicationCycle, setApplicationCycle] = useState(null);

    useEffect(() => {
        if (user) {
            availabilitiesApi.getAvailabilitiesApplicant().then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setAvailabilities(res.data);
                }
            });
        }
    }, [user]);

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
                <List>
                    {availabilities.map((availability) => (
                        <ListItem key={availability.id}>
                            <ListItemButton
                                onClick={() => { }}
                            >
                                <ListItemText primary={availability.start_time} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
}
