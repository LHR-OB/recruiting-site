import { React, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';
import { teamsApi } from '../api/endpoints/teams';
import consts from '../config/consts';

export default function MemberSignup() {
  // States
  const [teams, setTeams] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState(null);

  useEffect(() => {
    teamsApi.getTeams().then((res) => {
      if (res.status === 200) {
        setTeams(res.data);
      }
    });
  }, []);

  const createMember = () => {
    usersApi.createMember({
      first_name: firstName,
      last_name: lastName,
      email: email,
      type: role.toUpperCase().replace(' ', '_'),
      password: password,
      team_id: team.id,
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        window.location.href = '/login';
      }
    });
  }

  return (
    <Container component="form" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Member Signup
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
          id="firstName"
          label="First Name"
          variant="standard"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id="lastName"
          label="Last Name"
          variant="standard"
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id="email"
          label="Email"
          variant="standard"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id="password"
          label="Password"
          variant="standard"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl variant="standard" fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select
            fullWidth
            id="role"
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {consts.USER_ROLES.map((r, i) => (
              <MenuItem
                value={r}
                key={i}
              >
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth required>
          <InputLabel>Team</InputLabel>
          <Select
            fullWidth
            id="team"
            label="Team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            {teams.map((t, i) => (
              <MenuItem
                value={t}
                key={i}
              >
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={createMember}
        >
          Sign Up
        </Button>
        <Link href="/login" variant="body2">
          Already have an account? Log In
        </Link>
      </Box>
    </Container>
  );
}