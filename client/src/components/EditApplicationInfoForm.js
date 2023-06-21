import { React, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { teamsApi } from '../api/endpoints/teams';
import eventsApi from '../api/endpoints/events';

export default function EditApplicationInfoForm({ team, setTeam, setTeams, setSnackbarData, setOpen }) {
    // States
    const [interviewTimeDuration, setInterviewTimeDuration] = useState(team?.interview_time_duration);
    const [interviewMessage, setInterviewMessage] = useState(team?.interview_message);
    const [trialWorkdayStartTime, setTrialWorkdayStartTime] = useState(dayjs(new Date(new Date(team?.trial_workday_event?.start_time).getTime() - team?.trial_workday_event?.offset * 60 * 60 * 1000)));
    const [trialWorkdayEndTime, setTrialWorkdayEndTime] = useState(dayjs(new Date(new Date(team?.trial_workday_event?.end_time).getTime() - team?.trial_workday_event?.offset * 60 * 60 * 1000)));
    const [trialWorkdayLocation, setTrialWorkdayLocation] = useState(team?.trial_workday_event?.location);
    const [trialWorkdayMessage, setTrialWorkdayMessage] = useState(team?.trial_workday_message);
    const [offerMessage, setOfferMessage] = useState(team?.offer_message);

    const handleUpdateApplicationInfo = () => {
        teamsApi.updateTeam(team.id, {
            interview_time_duration: interviewTimeDuration,
            interview_message: interviewMessage,
            trial_workday_message: trialWorkdayMessage,
            offer_message: offerMessage,
        }).then((res) => {
            if (res.status === 200) {
                const updatedTeam = res.data;
                // Event update
                if (team.trial_workday_event) {
                    eventsApi.updateEvent(team.trial_workday_event.id, {
                        start_time: new Date(trialWorkdayStartTime),
                        end_time: new Date(trialWorkdayEndTime),
                        offset: new Date().getTimezoneOffset() / 60,
                        location: trialWorkdayLocation,
                    }).then((res) => {
                        if (res.status === 200) {
                            updatedTeam.trial_workday_event = res.data;
                            setTeams((curr) => {
                                const index = curr.findIndex((team) => team.id === updatedTeam.id);
                                curr[index] = updatedTeam;
                                return curr;
                            });
                            setTeam(updatedTeam);
                            setSnackbarData({
                                severity: 'success',
                                message: 'Application Info updated successfully',
                                open: true,
                            });
                            setOpen(false);
                        }
                    }, (error) => {
                        setSnackbarData({
                            severity: 'error',
                            message: 'Error updating Application Info',
                            open: true,
                        });
                    });
                } else {
                    eventsApi.createEvent({
                        title: team.name + " Trial Workday",
                        description: "Trial Workday for " + team.name + ". Come see how we operate during a normal workday!",
                        start_time: new Date(trialWorkdayStartTime),
                        end_time: new Date(trialWorkdayEndTime),
                        offset: new Date().getTimezoneOffset() / 60,
                        location: trialWorkdayLocation,
                        trial_workday_team_id: team.id,
                        is_global: true,
                    }).then((res) => {
                        if (res.status === 200) {
                            setTeams((curr) => {
                                const index = curr.findIndex((team) => team.id === updatedTeam.id);
                                curr[index] = updatedTeam;
                                return curr;
                            });
                            setTeam(updatedTeam);
                            setSnackbarData({
                                severity: 'success',
                                message: 'Application Info updated successfully',
                                open: true,
                            });
                            setOpen(false);
                        }
                    }, (error) => {
                        setSnackbarData({
                            severity: 'error',
                            message: 'Error updating Application Info',
                            open: true,
                        });
                    });
                }
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
                <Typography variant="h6" mt={2}>
                    Edit Application Info for {team?.name}
                </Typography>
                <TextField
                    label="Interview Time Duration (minutes)"
                    variant="standard"
                    value={interviewTimeDuration || ''}
                    onChange={(e) => setInterviewTimeDuration(e.target.value)}
                    sx={{width: '100%' }}
                />
                <TextField
                    label="Interview Message"
                    variant="standard"
                    multiline
                    value={interviewMessage || ''}
                    onChange={(e) => setInterviewMessage(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Trial Workday Start"
                        value={trialWorkdayStartTime}
                        onChange={(date) => {setTrialWorkdayStartTime(date)}}
                        renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
                    />
                    <DateTimePicker
                        label="Trial Workday End"
                        value={trialWorkdayEndTime}
                        onChange={(date) => {setTrialWorkdayEndTime(date)}}
                        renderInput={(params) => <TextField {...params} sx={{ mt: 2 }} />}
                    />
                </LocalizationProvider>
                <TextField
                    label="Trial Workday Location"
                    variant="standard"
                    value={trialWorkdayLocation || ''}
                    onChange={(e) => setTrialWorkdayLocation(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Trial Workday Message"
                    variant="standard"
                    multiline
                    value={trialWorkdayMessage || ''}
                    onChange={(e) => setTrialWorkdayMessage(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Offer Message"
                    variant="standard"
                    multiline
                    value={offerMessage || ''}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleUpdateApplicationInfo}
                    sx={{ mt: 2 }}
                >
                    Update Application Info
                </Button>
            </Box>
        </Container>
    );
}
