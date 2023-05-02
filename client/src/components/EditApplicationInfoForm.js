import { React, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';

export default function EditApplicationInfoForm({ team }) {
    // States
    const [interviewTimeDuration, setInterviewTimeDuration] = useState(team?.interview_time_duration);

    const handleUpdateApplicationInfo = () => {
        teamsApi.updateTeam(team.id, {
            interview_time_duration: interviewTimeDuration,
        }).then((res) => {
            if (res.status === 200) {
                console.log("Updated application info successfully");
            }
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
                <Typography variant="h6" mt={2}>
                    Edit Application Info for {team?.name}
                </Typography>
                <TextField
                    label="Interview Time Duration (minutes)"
                    variant="standard"
                    value={interviewTimeDuration}
                    onChange={(e) => setInterviewTimeDuration(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleUpdateApplicationInfo}
                    sx={{ mt: 2 }}
                >
                    Update Application Info
                </Button>
            </Box>
        </Container>
    );
}
