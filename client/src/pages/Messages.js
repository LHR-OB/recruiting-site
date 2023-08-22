import { React, useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import MessagesList from '../components/MessagesList';
import messagesApi from '../api/endpoints/messages';
import MessageView from '../components/MessageView';

export default function Messages({ user }) {
    // States
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState({});

    useEffect(() => {
        if (user) {
            messagesApi.getMessagesCurrentUser().then((res) => {
                if (res.status === 200) {
                    setMessages(res.data.reverse());
                }
            });
        }
    }, [user])

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
                <Typography variant="h4" margin={2}>
                    Messages
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="h5" mt={2}>
                            Inbox
                        </Typography>
                        {
                            messages.length === 0 &&

                            <Typography variant="body1" mt={2} sx={{ fontStyle: "italic" }}>
                                You have no messages
                            </Typography>
                        }
                        <MessagesList
                            messages={messages}
                            selectedMessage={selectedMessage}
                            setSelectedMessage={setSelectedMessage}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" mt={2}>
                            Message
                        </Typography>
                        {
                            !selectedMessage.id &&
                            <Typography variant="body1" mt={2} sx={{ fontStyle: "italic" }}>
                                Select a message to view
                            </Typography>
                        }
                        <MessageView message={selectedMessage} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
