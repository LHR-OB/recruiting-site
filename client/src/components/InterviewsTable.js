import { React, useEffect, useState } from 'react';
import {
    Container,
    FormControl,
    FormGroup,
    FormControlLabel,
    Switch,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { interviewsApi } from '../api/endpoints/interviews';

export default function InterviewsTable({ user, setOpen, setInterview, interviews, setInterviews }) {
    // States
    const [showMine, setShowMine] = useState(false);

    useEffect(() => {
        if (setInterviews && user) {
            switch (user?.type) {
                case 'ADMIN':
                    interviewsApi.getInterviews().then((res) => {
                        if (res.status === 200) {
                            const newInterviews = res.data;
                            newInterviews.sort((a, b) => {
                                return new Date(a.event.start_time) - new Date(b.event.start_time);
                            });
                            setInterviews(newInterviews);
                        }
                    });
                    break;
                case 'TEAM_MANAGEMENT':
                    interviewsApi.getInterviewsByTeam(user?.team?.id).then((res) => {
                        if (res.status === 200) {
                            const newInterviews = res.data;
                            console.log(newInterviews);
                            newInterviews.sort((a, b) => {
                                return new Date(a.event.start_time) - new Date(b.event.start_time);
                            });
                            setInterviews(newInterviews);
                        }
                    });
                    break;
                case 'SYSTEM_LEAD':
                    for (let system of user?.systems) {
                        interviewsApi.getInterviewsBySystem(system.id).then((res) => {
                            if (res.status === 200) {
                                const newInterviews = res.data;
                                console.log(newInterviews);
                                newInterviews.sort((a, b) => {
                                    return new Date(a.event.start_time) - new Date(b.event.start_time);
                                });
                                setInterviews((prev) => [...prev, ...newInterviews].filter((interview, index, self) => index === self.findIndex((t) => (t.id === interview.id))));
                            }
                        });
                    }
                    break;
                case 'INTERVIEWER':
                    interviewsApi.getInterviewsCurrentUser().then((res) => {
                        if (res.status === 200) {
                            const newInterviews = res.data;
                            newInterviews.sort((a, b) => {
                                return new Date(a.event.start_time) - new Date(b.event.start_time);
                            });
                            setInterviews(newInterviews);
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }, [setInterviews, user]);
    
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
            <FormControl>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={showMine} onChange={() => setShowMine(!showMine)} />}
                        label="Show Only My Interviews"
                    />
                </FormGroup>
            </FormControl>
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
                        {interviews.filter((interview) => (!(showMine && !interview.event.users.some((u) => (u.id === user.id))))).map((interview, index) => (
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
