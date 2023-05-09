import { React } from 'react';
import {
    Box,
    Container,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import messagesApi from '../api/endpoints/messages';

export default function MessagesList({ messages, selectedMessage, setSelectedMessage }) {
    const handleClickMessage = (message) => {
        if (!message.is_read) {
            messagesApi.readMessage(message.id).then((res) => {
                if (res.status === 200) {
                    setSelectedMessage(message);
                }
            });
        } else {
            setSelectedMessage(message);
        }
    };

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
                    {messages.map((message) => (
                        <ListItemButton
                            key={message.id}
                            onClick={() => handleClickMessage(message)}
                            selected={message.id === selectedMessage.id}
                        >
                            <ListItemText
                                primary={message.title}
                                secondary={message.is_read ? '' : 'Unread'}
                            />
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Container>
    );
}
