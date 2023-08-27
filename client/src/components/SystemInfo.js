import { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Typography,
} from '@mui/material';
import EditSystemForm from './EditSystemForm';
import CenterModal from './CenterModal';

export default function SystemInfo({ system, setSystem, setSystems, setSnackbarData }) {
    // States
    const [open, setOpen] = useState(false);

    return (
        <Container>
            <Typography variant="h6" mt={2}>
                System Info
            </Typography>
            <Typography variant="body1" mt={2}>
                Interview Default Location: {system?.interview_default_location}
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {setOpen(true)}}
                sx={{ mt: 2 }}
            >
                Edit System
            </Button>
            <CenterModal
                open={open}
                handleClose={() => setOpen(false)}
            >
                <EditSystemForm system={system} setSystem={setSystem} setSystems={setSystems} setSnackbarData={setSnackbarData} setOpen={setOpen} />
            </CenterModal>
        </Container>
    );
}
