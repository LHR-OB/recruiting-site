import { React, useState, useEffect } from 'react';
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
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import messagesApi from '../api/endpoints/messages';

export default function Navbar({ user, setOpen }) {
  // States
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      messagesApi.getMessagesByUser(user.id).then((res) => {
        if (res.status === 200) {
          setMessages(res.data);
        }
      });
    }
  }, [user]);


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
          <img
            src="/lhrnew.gif"
            alt="Longhorn Racing Logo"
            style={{ height: '50px', width: '75px', marginRight: '10px' }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Longhorn Racing Recruiting Portal
          </Typography>
          {
            user &&
            <IconButton
              size="large"
              color="inherit"
              onClick={() => window.location.href = '/messages'}
            >
              {
                messages.some((message) => (!message.is_read)) ? <MarkEmailUnreadIcon /> : <MailIcon />
              }
            </IconButton>
          }
          {
            user &&
            <IconButton
              size="large"
              color="inherit"
              onClick={() => window.location.href = `/profile/${user.id}`}
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
