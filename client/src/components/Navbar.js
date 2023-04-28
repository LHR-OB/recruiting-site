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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Navbar({ user, setOpen }) {
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
          {user ? <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton> : null}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Longhorn Racing Recruiting Portal
          </Typography>
          {
            user &&
            <IconButton
              size="large"
              color="inherit"
              onClick={() => window.location.href = '/profile'}
            >
              <AccountCircleIcon />
            </IconButton>
          }
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
