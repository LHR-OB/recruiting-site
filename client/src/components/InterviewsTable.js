import { React, useEffect } from 'react';
import {
    Container,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { interviewsApi } from '../api/endpoints/interviews';

export default function InterviewsTable({ setOpen, setInterview, interviews, setInterviews }) {
    useEffect(() => {
        if (setInterviews) {
            interviewsApi.getInterviewsCurrentuser().then((res) => {
                if (res.status === 200) {
                    const newInterviews = res.data;
                    newInterviews.sort((a, b) => {
                        return new Date(a.event.start_time) - new Date(b.event.start_time);
                    });
                    setInterviews(newInterviews);
                }
            });
        }
    }, [setInterviews]);
    
    const handleInterviewClick = (interview) => {
        setOpen(true);
        setInterview(interview);
    }

    const getApplicantName = (interview) => {
        const invitees = interview?.event?.users;
        for (let user of invitees) {
            if (user.type === 'APPLICANT') {
                return user.first_name + " " + user.last_name;
            }
        }
        return "";
    }

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Event</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {interviews.map((interview, index) => (
                            <TableRow
                                key={index}
                                onClick={() => handleInterviewClick(interview)}
                                sx={{
                                '&:hover': {cursor: 'pointer', backgroundColor: 'grey.100'},
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {getApplicantName(interview)}
                                </TableCell>
                                <TableCell align="right">{interview?.event.title}</TableCell>
                                <TableCell align="right">{new Date(new Date(interview?.event.start_time).getTime() - (interview?.event.offset * 60 * 60 * 1000)).toLocaleString()}</TableCell>
                                <TableCell align="right">{interview?.event.location}</TableCell>
                                <TableCell align="right">{interview?.application?.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
