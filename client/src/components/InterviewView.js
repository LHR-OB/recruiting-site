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

export default function InterviewView({ interview, setInterview, setInterviews, setSnackbarData, setOpen }) {
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
                setInterview((curr) => {
                    return {
                        ...curr,
                        notes: [...curr.notes, res.data],
                    }
                });
                setInterviews((curr) => {
                    const index = curr.findIndex((i) => i.id === interview.id);
                    if (curr[index].notes.findIndex((n) => n.id === res.data.id) === -1)
                        curr[index].notes.push(res.data);
                    return curr;
                });
                setSnackbarData({
                    open: true,
                    message: "Note added successfully",
                    severity: "success",
                });
                setNewNote("");
            }
        }, (err) => {
            setSnackbarData({
                open: true,
                message: "Error adding note",
                severity: "error",
            });
        });
    }

    const handleCompleteInterview = () => {
        applicationsApi.updateApplication(interview?.application?.id, {
            status: "INTERVIEW_COMPLETE",
        }).then((res) => {
            if (res.status === 200) {
                setInterview((curr) => {
                    return {
                        ...curr,
                        application: res.data,
                    }
                });
                setInterviews((curr) => {
                    const index = curr.findIndex((i) => i.id === interview.id);
                    curr[index].application = res.data;
                    return curr;
                });
                setSnackbarData({
                    open: true,
                    message: "Interview completed successfully",
                    severity: "success",
                });
                setOpen(false);
            }
        }, (err) => {
            setSnackbarData({
                open: true,
                message: "Error completing interview",
                severity: "error",
            });
        });
    }

    const handleUncompleteInterview = () => {
        applicationsApi.updateApplication(interview?.application?.id, {
            status: "INTERVIEW_SCHEDULED",
        }).then((res) => {
            if (res.status === 200) {
                setInterview((curr) => {
                    return {
                        ...curr,
                        application: res.data,
                    }
                });
                setInterviews((curr) => {
                    const index = curr.findIndex((i) => i.id === interview.id);
                    curr[index].application = res.data;
                    return curr;
                });
                setSnackbarData({
                    open: true,
                    message: "Interview uncompleted successfully",
                    severity: "success",
                });
                setOpen(false);
            }
        }, (err) => {
            setSnackbarData({
                open: true,
                message: "Error uncompleting interview",
                severity: "error",
            });
        });
    }

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
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
                        {note.note.split('\n').map((item, i) => (
                            <p key={i}>{item}<br /></p>
                        ))}
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