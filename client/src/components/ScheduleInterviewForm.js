import { React} from 'react';
import {
    Box,
    Button,
    Container,
    Typography
} from '@mui/material';
import eventApi from '../api/endpoints/events';

export default function ScheduleInterviewForm({ interview }) {

    const handleScheduleInterview = () => {
        eventApi.createEvent({
            title: interview.system + " Interview",
            start_time: interview.start_time,
            end_time: interview.end_time,
            location: "TODO",
            description: "Interview",
        }).then((res) => {
            if (res.status === 200) {
                // Add the event to user's and interviewer's calendars
                const event = res.data;
                eventApi.joinEvent(event.id).then((res) => {
                    if (res.status === 200) {
                        eventApi.addUserToEvent(event.id, interview.interviewer_id).then((res) => {
                            if (res.status === 200) {
                                console.log("Successfully scheduled interview");
                            }
                        });
                    }
                });
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
                <Typography variant="h4" mt={2}>
                    Schedule Interview
                </Typography>
                <Typography variant="h6" mt={2}>
                    {new Date(interview?.start_time).toLocaleString() + " - " + new Date(interview?.end_time).toLocaleString()}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={handleScheduleInterview}
                    sx={{ margin: 4 }}
                >
                    Schedule Interview
                </Button>
            </Box>
        </Container>
    );
}
