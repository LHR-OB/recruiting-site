import { React, useState, useEffect } from 'react';
import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { teamsApi } from '../api/endpoints/teams';
import usersApi from '../api/endpoints/users';

export default function EditProfileForm({ user, setUser, setSnackbarData, setOpen }) {
    // States
    const [team, setTeam] = useState({});
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        if (user) {
            teamsApi.getTeams().then((res) => {
                if (res.status === 200) {
                    setTeams(res.data);
                }
            });
        }
    }, [user]);

    const handleUpdateUser = () => {
        usersApi.updateUser(user.id, {
            team_id: team.id,
            type: "INTERVIEWER",
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
            <Typography variant="h4" align="center" gutterBottom>Convert to Member</Typography>
            <Typography variant="body1" align="center" gutterBottom>
                Are you sure you want to convert to a member? You will still need to be approved.
            </Typography>
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
                Convert to Member
            </Button>
        </Container>
    )
}