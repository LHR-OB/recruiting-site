import { React } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';

export default function PageNotFound({ user }) {
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
                    Page Not Found
                </Typography>
                <Typography variant="body1" mt={2}>
                    Are you lost? The page you are looking for does not exist. If you think this is a mistake, please contact the administrator.
                </Typography>
            </Box>
        </Container>
    )
}
