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
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MemberSignup from './pages/MemberSignup';
import ApplicantSignup from './pages/ApplicantSignup';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Applications from './pages/Applications';
import Login from './pages/Login';
import Admin from './pages/Admin';
import TeamManagement from './pages/TeamManagement';
import Profile from './pages/Profile';
import InterviewAvailability from './pages/InterviewAvailability';
import Interviews from './pages/Interviews';
import Messages from './pages/Messages';
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
    },
    {
      path: "/calendar",
      element: <Calendar user={user} />
    },
    {
      path: "/applications",
      element: <Applications user={user} />
    },
    {
      path: "/admin",
      element: <Admin user={user} />
    },
    {
      path: "/team-management",
      element: <TeamManagement user={user} />
    },
    {
      path: "/profile",
      element: <Profile user={user} />
    },
    {
      path: "/interview-availability",
      element: <InterviewAvailability user={user} />
    },
    {
      path: "/interviews",
      element: <Interviews user={user} />
    },
    {
      path: "/messages",
      element: <Messages user={user} />
    }
  ]);

  const commonDrawerItems = [
    {
      name: "Home",
      path: "/",
      icon: <HomeIcon />
    },
  ]

  const interviewerDrawerItems = [
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />
    },
    {
      name: "Interview Availability",
      path: "/interview-availability",
      icon: <AccessTimeIcon />
    },
    {
      name: "Interviews",
      path: "/interviews",
      icon: <QuestionAnswerIcon />
    }
  ]

  const leadDrawerItems = [
    {
      name: "Applications",
      path: "/applications",
      icon: <DescriptionIcon />
    },
    ...interviewerDrawerItems,
  ]

  const teamManagmentDrawerItems = [
    {
      name: "Team Management",
      path: "/team-management",
      icon: <GroupIcon />
    },
    ...leadDrawerItems,
  ]

  const adminDrawerItems = [
    {
      name: "Admin",
      path: "/admin",
      icon: <AdminPanelSettingsIcon />
    },
    ...teamManagmentDrawerItems,
  ]

  const applicantDrawerItems = [
    {
      name: "Applications",
      path: "/applications",
      icon: <DescriptionIcon />
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: <CalendarMonthIcon />
    },
    {
      name: "Interview Availability",
      path: "/interview-availability",
      icon: <AccessTimeIcon />
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
      case "SYSTEM_LEAD":
        drawerItems = leadDrawerItems;
        break;
      case "TEAM_MANAGEMENT":
        drawerItems = teamManagmentDrawerItems;
        break;
      case "ADMIN":
        drawerItems = adminDrawerItems;
        break;
      default:
        break;
    }
  }
  drawerItems = [...commonDrawerItems, ...drawerItems];

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
