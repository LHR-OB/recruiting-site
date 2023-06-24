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
import usersApi from '../api/endpoints/users';

export default function EventView({ event }) {
    // States
    const [invitees, setInvitees] = useState([]);

    useEffect(() => {
        if (event) {
            usersApi.getUsersByEvent(event.id).then((res) => {
                if (res.status === 200) {
                    setInvitees(res.data);
                }
            });
        }
    }, [event]);

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
                    {event?.location}
                </Typography>
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
            </Box>
        </Container>
    );
}
