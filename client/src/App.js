import { React, useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import MemberSignup from './pages/MemberSignup';
import ApplicantSignup from './pages/ApplicantSignup';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import usersApi from './api/endpoints/users';

export default function App() {
  // States
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      usersApi.getUser().then((res) => {
        if (res.status === 200) {
          setUser(res.data);
        }
      });
    }
  }, []);
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard user={user} />
    },
    {
      path: "/login",
      element: <Login user={user} />
    },
    {
      path: "/applicant-signup",
      element: <ApplicantSignup user={user} />
    },
    {
      path: "/member-signup",
      element: <MemberSignup user={user} />
    }
  ]);

  const interviewerDrawerItems = [
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />
    }
  ]

  const leadDrawerItems = [
    ...interviewerDrawerItems,
    {
      name: "Applications",
      path: "/applications",
      icon: <DescriptionIcon />
    },
  ]

  const applicantDrawerItems = [
    {
      name: "Application",
      path: "/application",
      icon: <DescriptionIcon />
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />
    },
  ]

  let drawerItems = [];
  if (user) {
    switch (user.type) {
      case "APPLICANT":
        drawerItems = applicantDrawerItems;
        break;
      case "INTERVIEWER":
        drawerItems = interviewerDrawerItems;
        break;
      default:
        drawerItems = leadDrawerItems;
        break;
    }
  }


  return (
    <div>
      <Navbar user={user} setOpen={setOpen} />
      <Drawer
        anchor={'left'}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
        >
          <List>
            {drawerItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {window.location.href = item.path;}}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <RouterProvider
        router={router}
      />
    </div>
  );
}
