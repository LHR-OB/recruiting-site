import { React, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import { applicationsApi } from '../api/endpoints/applications';
import { interviewNotesApi } from '../api/endpoints/interviews';

export default function InterviewView({ interview }) {
    // States
    const [newNote, setNewNote] = useState("");

    const getApplicantName = (interview) => {
        const invitees = interview?.event?.users;
        for (let user of invitees) {
            if (user.type === 'APPLICANT') {
                return user.first_name + " " + user.last_name;
            }
        }
        return "";
    }

    const handleAddNote = () => {
        interviewNotesApi.createInterviewNote({
            interview_id: interview.id,
            note: newNote,
        }).then((res) => {
            if (res.status === 200) {
                console.log('Note created successfully');
            }
        });
    }

    const handleCompleteInterview = () => {
        applicationsApi.updateApplication(interview?.application?.id, {
            status: "INTERVIEW_COMPLETE",
        }).then((res) => {
            if (res.status === 200) {
                console.log('Application updated successfully');
            }
        });
    }

    const handleUncompleteInterview = () => {
        applicationsApi.updateApplication(interview?.application?.id, {
            status: "INTERVIEW_SCHEDULED",
        }).then((res) => {
            if (res.status === 200) {
                console.log('Application updated successfully');
            }
        });
    }

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
                    {interview?.event?.title} with {getApplicantName(interview)}
                </Typography>
                <Typography variant="h6" mt={2}>
                    Notes
                </Typography>
                {interview?.notes.map((note, i) => (
                    <Typography
                        key={i}
                        variant="body1"
                        mt={2}
                    >
                        {note.note}
                    </Typography>
                ))}
                <TextField
                    label="New Note"
                    variant="standard"
                    value={newNote}
                    multiline
                    onChange={(e) => setNewNote(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleAddNote}
                    sx={{ marginTop: 2 }}
                >
                    Add New Note
                </Button>

                {
                    interview?.application?.status === "INTERVIEW_SCHEDULED" &&
                    <Button
                        variant="outlined"
                        onClick={handleCompleteInterview}
                        sx={{ marginTop: 2 }}
                    >
                        Complete Interview
                    </Button>
                }
                {
                    interview?.application?.status === "INTERVIEW_COMPLETE" &&
                    <Button
                        variant="outlined"
                        onClick={handleUncompleteInterview}
                        sx={{ marginTop: 2 }}
                    >
                        Uncomplete Interview
                    </Button>
                }
            </Box>
        </Container>
    );
}