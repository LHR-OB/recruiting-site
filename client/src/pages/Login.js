import React from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';

export default function Login() {
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
        />
        <TextField
          required
          fullWidth
          id="password"
          label="Password"
          variant="standard"
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Link href="/applicant-signup" variant="body2">
          New Applicant? Sign Up
        </Link>
        <Link href="/member-signup" variant="body2">
          Existing Member? Sign Up
        </Link>
      </Box>
    </Container>
  );
}