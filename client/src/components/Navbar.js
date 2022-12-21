import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar({ user }) {
  const handleLoginLogout = (e) => {
    e.preventDefault();
    if (user) {
      localStorage.removeItem('token');
    }
    window.location.href = '/login';
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Longhorn Racing Recruiting Portal
          </Typography>
          <Button
            color="inherit"
            onClick={handleLoginLogout}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
