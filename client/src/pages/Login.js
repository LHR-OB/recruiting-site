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

export default function Login({ user, setSnackbarData }) {
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getToken = () => {
    usersApi.getToken({
      username: email,
      password: password,
    }).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data.access_token);
        window.location.href = '/';
      }
    }, (error) => {
      setSnackbarData({
        open: true,
        message: 'Login failed!',
        severity: 'error',
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
          Login
        </Typography>
        <TextField
          required
          fullWidth
          autoFocus
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
          onClick={getToken}
        >
          Login
        </Button>
        <Link href="/applicant-signup" variant="body2">
          New Applicant? Sign Up
        </Link>
        <Link href="/member-signup" variant="body2">
          Existing LHR Member? Sign Up
        </Link>
      </Box>
    </Container>
  );
}