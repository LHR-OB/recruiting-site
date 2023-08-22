import { React, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';

export default function ForgotPassword({ setSnackbarData }) {
    // States
    const [email, setEmail] = useState('');
    const [passwordCode, setPasswordCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const generateCode = () => {
        usersApi.generatePasswordResetCode(email).then((res) => {
            if (res.status === 200) {
                setSnackbarData({
                    open: true,
                    message: 'Code sent to ' + email + '.',
                    severity: 'success',
                });
            }
        }, (error) => {
            setSnackbarData({
                open: true,
                message: 'Error: ' + error.response?.data?.detail,
                severity: 'error',
            })
        });
    }

    const resetPassword = () => {
        if (newPassword !== confirmPassword) {
            setSnackbarData({
                open: true,
                message: 'Passwords do not match.',
                severity: 'error',
            });
            return;
        }
        usersApi.resetPassword({
            email: email,
            code: passwordCode,
            password: newPassword,
        }).then((res) => {
            if (res.status === 200) {
                setSnackbarData({
                    open: true,
                    message: 'Password reset successfully.',
                    severity: 'success',
                });
            }
        }, (error) => {
            console.log(error.response);
            setSnackbarData({
                open: true,
                message: 'Error: ' + error.response?.data?.detail,
                severity: 'error',
            })
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
                    Forgot Password
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
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={generateCode}
                >
                    Send Code
                </Button>
                <TextField
                    required
                    fullWidth
                    id="passwordCode"
                    label="Code"
                    variant="standard"
                    onChange={(e) => setPasswordCode(e.target.value)}
                />
                <TextField
                    required
                    fullWidth
                    id="newPassword"
                    label="New Password"
                    variant="standard"
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    variant="standard"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={resetPassword}
                >
                    Reset Password
                </Button>
            </Box>
        </Container>
    );
}