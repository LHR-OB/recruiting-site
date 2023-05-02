import { React } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';

export default function EventView({ event }) {
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
                <Typography variant="h6" mt={2}>
                    {event?.location}
                </Typography>
                <br />
                <Typography variant="h6" mt={2}>
                    {event?.start_time}
                </Typography>
                <br />
                <Typography variant="h6" mt={2}>
                    {event?.end_time}
                </Typography>
            </Box>
        </Container>
    );
}
