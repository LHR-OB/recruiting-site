import { React } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';


export default function ApplicationCycleClosed() {
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
                <Typography variant="h4" mt={2}>
                    Applications are currently closed
                </Typography>
                <Typography variant="body1" mt={2}>
                    Applications will typically open at the beginning of the Fall semester. Please check back later or contact the club for more information.
                </Typography>
            </Box>
        </Container>
    );
}
