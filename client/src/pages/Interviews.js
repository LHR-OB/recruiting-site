import { React, useState } from 'react';
import {
    Box,
    Container,
    Typography,
} from '@mui/material';
import InterviewsTable from '../components/InterviewsTable';
import CenterModal from '../components/CenterModal';
import InterviewView from '../components/InterviewView';


export default function Interviews({ user })  {
    // States
    const [open, setOpen] = useState(false);
    const [interview, setInterview] = useState(null);
    
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
                />
                <CenterModal
                    open={open}
                    handleClose={() => setOpen(false)}
                >
                    <InterviewView interview={interview} />
                </CenterModal>
            </Box>
        </Container>
    );
}
