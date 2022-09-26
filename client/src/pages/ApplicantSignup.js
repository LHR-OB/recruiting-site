import React from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';

export default function ApplicantSignup() {
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