import { React, useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';
import InterviewsTable from '../components/InterviewsTable';
import CenterModal from '../components/CenterModal';
import InterviewView from '../components/InterviewView';
import ApplicationCycleClosed from '../components/ApplicationCycleClosed';
import { applicationCyclesApi } from '../api/endpoints/applications';


export default function Interviews({ user, setSnackbarData })  {
    // States
    const [open, setOpen] = useState(false);
    const [interview, setInterview] = useState(null);
    const [applicationCycle, setApplicationCycle] = useState(null);
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        applicationCyclesApi.getApplicationCycleActive().then((res) => {
            if (res.status === 200) {
                setApplicationCycle(res.data);
            }
        });
    }, []);

    if (!applicationCycle) {
        return (
            <ApplicationCycleClosed />
        );
    }

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
                    Interviews
                </Typography>
                <InterviewsTable 
                    setOpen={setOpen}
                    setInterview={setInterview}
                    interviews={interviews}
                    setInterviews={setInterviews}
                />
                <CenterModal
                    open={open}
                    handleClose={() => setOpen(false)}
                >
                    <InterviewView interview={interview} setInterview={setInterview} setInterviews={setInterviews} setSnackbarData={setSnackbarData} setOpen={setOpen} />
                </CenterModal>
            </Box>
        </Container>
    );
}
