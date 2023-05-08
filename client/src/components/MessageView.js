import { React } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';


export default function MessageView({ message }) {
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
                <Typography variant="h6" margin={2}>
                    {message.title}
                </Typography>
                <Typography variant="body1" margin={2}>
                    {message.message}
                </Typography>
            </Box>
        </Container>
    );
}
