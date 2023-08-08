import { React, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';


export default function ApplicantSignup({ setSnackbarData }) {
  // States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createApplicant = () => {
    const type = 'APPLICANT';
    usersApi.createApplicant({
      first_name: firstName,
      last_name: lastName,
      email: email,
      type: type,
      password: password,
    }).then((res) => {
      if (res.status === 200) {
        window.location.href = '/login';
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Error creating account. ' + error.response?.data?.detail,
        severity: 'error'
      });
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
          Applicant Signup
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
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={createApplicant}
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