import React from 'react';
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

// Constants
const USER_ROLES = [
  "Admin",
  "Team Management",
  "System Lead",
  "Interviewer",
];

const TEAMS = [
  "Combustion",
  "Electric",
  "Solar",
];

export default function MemberSignup() {
  // States
  const [role, setRole] = React.useState("");
  const [team, setTeam] = React.useState("");

  // Change Handlers
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  }

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
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
        />
        <TextField
          required
          fullWidth
          id="lastName"
          label="Last Name"
          variant="standard"
        />
        <TextField
          required
          fullWidth
          id="email"
          label="Email"
          variant="standard"
        />
        <TextField
          required
          fullWidth
          id="password"
          label="Password"
          variant="standard"
        />
        <FormControl variant="standard" fullWidth required>
          <InputLabel>Role</InputLabel>
          <Select
            fullWidth
            id="role"
            label="Role"
            value={role}
            onChange={handleRoleChange}
          >
            {USER_ROLES.map((r) => (
              <MenuItem value={r}>{r}</MenuItem>
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
            onChange={handleTeamChange}
          >
            {TEAMS.map((t) => (
              <MenuItem value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Link href="/login" variant="body2">
          Already have an account? Log In
        </Link>
      </Box>
    </Container>
  );
}