import { React, useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';
import eventsApi from '../api/endpoints/events';
import { interviewsApi } from '../api/endpoints/interviews';
import { applicationsApi } from '../api/endpoints/applications';

export default function EventView({ user, event, setEvent, setSnackbarData }) {
    // States
    const [invitees, setInvitees] = useState([]);
    const [addInvitee, setAddInvitee] = useState("");
    const [newLocation, setNewLocation] = useState("");

    useEffect(() => {
        if (event) {
            usersApi.getUsersByEvent(event.id).then((res) => {
                if (res.status === 200) {
                    setInvitees(res.data);
                }
            });
        }
    }, [event]);

    const handleCancelInterview = () => {
        eventsApi.deleteEvent(event.id).then((res) => {
            if (res.status === 200) {
                interviewsApi.getInterview(event.interview_id).then((res) => {
                    if (res.status === 200) {
                        applicationsApi.updateApplication(res.data.application.id, {
                            status: 'INTERVIEW'
                        }).then((res) => {
                            if (res.status === 200) {
                                setSnackbarData({
                                    open: true,
                                    message: 'Interview cancelled',
                                    severity: 'success',
                                });
                            } else {
                                setSnackbarData({
                                    open: true,
                                    message: 'Error cancelling interview',
                                    severity: 'error',
                                });
                            }
                        });
                    } else {
                        setSnackbarData({
                            open: true,
                            message: 'Error cancelling interview',
                            severity: 'error',
                        });
                    }
                });
            } else {
                setSnackbarData({
                    open: true,
                    message: 'Error cancelling interview',
                    severity: 'error',
                });
            }
        });
    }

    const handleChangeLocation = () => {
        eventsApi.updateEvent(event.id, {
            location: newLocation,
        }).then((res) => {
            if (res.status === 200) {
                setSnackbarData({
                    open: true,
                    message: 'Location changed',
                    severity: 'success',
                });
                setEvent((curr) => {
                    return {
                        ...curr,
                        location: newLocation,
                    };
                });
            } else {
                setSnackbarData({
                    open: true,
                    message: 'Error changing location',
                    severity: 'error',
                });
            }
        });
    }

    const handleAddInvitee = () => {
        usersApi.getUserByEmail(addInvitee).then((res) => {
            const invitee = res.data;
            if (res.status === 200) {
                eventsApi.addUserToEvent(event.id, invitee.id).then((res) => {
                    if (res.status === 200) {
                        setSnackbarData({
                            open: true,
                            message: 'Invitee added',
                            severity: 'success',
                        });
                        setInvitees((curr) => {
                            return [...curr, invitee];
                        });
                    }
                }, (err) => {
                    setSnackbarData({
                        open: true,
                        message: 'Error adding invitee',
                        severity: 'error',
                    });
                });
            }
        }, (err) => {
            setSnackbarData({
                open: true,
                message: 'Error adding invitee',
                severity: 'error',
            });
        });
    }

    const handleLeaveEvent = () => {
        eventsApi.leaveEvent(event.id).then((res) => {
            if (res.status === 200) {
                setSnackbarData({
                    open: true,
                    message: 'Left event',
                    severity: 'success',
                });
                setInvitees((curr) => {
                    return curr.filter((invitee) => invitee.id !== user.id);
                });
            } else {
                setSnackbarData({
                    open: true,
                    message: 'Error leaving event',
                    severity: 'error',
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
                    {event?.title}
                </Typography>
                <br />
                <Typography variant="h6" mt={2}>
                    {event?.description}
                </Typography>
                <br />
                <Typography variant="body1" mt={2}>
                    Location: {event?.location}
                </Typography>
                {/* Edit Location */}
                {
                    user?.type !== "APPLICANT" && !event?.is_global &&
                    <Container>
                        <TextField
                            label="Change Location"
                            variant="standard"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            sx={{ width: '100%' }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleChangeLocation}
                            sx={{ marginTop: 2 }}
                        >
                            Change Location
                        </Button>
                    </Container>
                }
                <br />
                <Typography variant="body1" mt={2}>
                    {new Date(new Date(event?.start_time).getTime() - (event.offset * 60 * 60 * 1000)).toLocaleTimeString() + " - " + new Date(new Date(event?.end_time).getTime() - (event.offset * 60 * 60 * 1000)).toLocaleTimeString()}
                </Typography>
                <br />
                {
                    !event?.is_global && 
                    <Typography variant="h6" mt={2}>
                        Invitees
                    </Typography>
                }
                <List>
                    {invitees.map((invitee, index) => (
                        <ListItem key={index}>
                            <ListItemButton
                                onClick={() => {window.location.href = `/profile/${invitee.id}`}}
                            >
                                <ListItemText
                                    primary={invitee.first_name + ' ' + invitee.last_name}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {
                    event?.interview_id && user?.type === "APPLICANT" &&
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCancelInterview}
                        sx={{
                            marginTop: 2,
                        }}
                    >
                        Cancel Interview
                    </Button>
                }
                {
                    user?.type !== "APPLICANT" && !event?.is_global &&
                    <Container>
                        <TextField
                            label="Add Invitee"
                            variant="standard"
                            value={addInvitee}
                            onChange={(e) => setAddInvitee(e.target.value)}
                            sx={{ width: '100%' }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleAddInvitee}
                            sx={{ marginTop: 2 }}
                        >
                            Add Invitee
                        </Button>
                    </Container>
                }
                {
                    user?.type !== "APPLICANT" && !event?.is_global && invitees.some((invitee) => invitee.id === user?.id) &&
                    <Container>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLeaveEvent}
                            sx={{ marginTop: 2 }}
                        >
                            Leave Event
                        </Button>
                    </Container>
                }
            </Box>
        </Container>
    );
}
