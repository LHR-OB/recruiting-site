import { React} from 'react';
import {
    Box,
    Button,
    Container,
    Typography
} from '@mui/material';
import eventApi from '../api/endpoints/events';
import { applicationsApi } from '../api/endpoints/applications';
import { interviewsApi } from '../api/endpoints/interviews';

export default function ScheduleInterviewForm({ interview }) {

    const handleScheduleInterview = () => {
        eventApi.createEvent({
            title: interview.system + " Interview",
            start_time: interview.start_time,
            end_time: interview.end_time,
            offset: interview.offset,
            location: interview.location,
            description: "System interview",
            is_global: false,
        }).then((res) => {
            if (res.status === 200) {
                // Add the event to user's and interviewer's calendars
                const event = res.data;
                eventApi.joinEvent(event.id).then((res) => {
                    if (res.status === 200) {
                        eventApi.addUserToEvent(event.id, interview.interviewer_id).then((res) => {
                            if (res.status === 200) {
                                interviewsApi.createInterview({}).then((res) => {
                                    if (res.status === 200) {
                                        const newInterview = res.data;
                                        eventApi.updateEvent(event.id, {
                                            interview_id: res.data.id,
                                        }).then((res) => {
                                            if (res.status === 200) {
                                                applicationsApi.updateApplication(interview.application_id, {
                                                    status: "INTERVIEW_SCHEDULED",
                                                    interview_id: newInterview.id,
                                                }).then((res) => {
                                                    if (res.status === 200) {
                                                        console.log("Interview scheduled");
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
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
