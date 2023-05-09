import { React } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';

export default function Unauthorized({ user }) {
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
                    You are not authorized to perform that action
                </Typography>
                <Typography variant="body1" mt={2}>
                    If you think this is an error, please try logging in again or contact the administrator.
                </Typography>
            </Box>
        </Container>
    );
}
