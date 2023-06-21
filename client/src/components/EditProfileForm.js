import { React, useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';
import { teamsApi } from '../api/endpoints/teams';
import consts from '../config/consts';

export default function EditProfileForm({ user, setUser, setSnackbarData, setOpen }) {
    // States
    const [firstName, setFirstName] = useState(user?.first_name);
    const [lastName, setLastName] = useState(user?.last_name);
    const [email, setEmail] = useState(user?.email);
    const [interviewLocation, setInterviewLocation] = useState(user?.interview_location);
    const [type, setType] = useState(consts.USER_ROLES.find((role) => role.toLowerCase() === user?.type.toLowerCase().replace('_', ' ')));
    const [team, setTeam] = useState({});
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        if (user) {
            teamsApi.getTeams().then((res) => {
                if (res.status === 200) {
                    setTeams(res.data);
                    setTeam(res.data.find((team) => team.id === user.team_id));
                }
            });
        }
    }, [user]);

    const handleUpdateUser = () => {
        usersApi.updateUser(user.id, {
            first_name: firstName,
            last_name: lastName,
            email: email,
            interview_location: interviewLocation,
            type: type.toUpperCase().replace(' ', '_'),
            team_id: team.id,
        }).then((res) => {
            if (res.status === 200) {
                setUser(res.data);
                setSnackbarData({
                    severity: 'success',
                    message: 'Profile updated successfully',
                    open: true,
                });
                setOpen(false);
            }
        }, (error) => {
            setSnackbarData({
                severity: 'error',
                message: 'Error updating profile',
                open: true,
            });
        });
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
                    Edit Profile
                </Typography>
                <TextField
                    label="First Name"
                    variant="standard"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Email"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    label="Interview Location"
                    variant="standard"
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="type-label">Role</InputLabel>
                    <Select
                        fullWidth
                        id="role"
                        label="role"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {consts.USER_ROLES.map((r, i) => (
                            <MenuItem key={i} value={r}>{r}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id="team-label">Team</InputLabel>
                    <Select
                        fullWidth
                        id="team"
                        label="team"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                    >
                        {teams.map((t, i) => (
                            <MenuItem key={i} value={t}>{t.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleUpdateUser}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Update Profile
                </Button>
            </Box>
        </Container>
    );
}
