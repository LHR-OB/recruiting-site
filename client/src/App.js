import { React, useState, useEffect, forwardRef } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
} from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MemberSignup from './pages/MemberSignup';
import ApplicantSignup from './pages/ApplicantSignup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Applications from './pages/Applications';
import Login from './pages/Login';
import Admin from './pages/Admin';
import TeamManagement from './pages/TeamManagement';
import SystemManagement from './pages/SystemManagement';
import Profile from './pages/Profile';
import InterviewAvailability from './pages/InterviewAvailability';
import Interviews from './pages/Interviews';
import Messages from './pages/Messages';
import PageNotFound from './pages/PageNotFound';
import usersApi from './api/endpoints/users';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ProtectedPage from './components/ProtectedPage';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {
  // States
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
      element: <Dashboard user={user} setSnackbarData={setSnackbarData} />
    },
    {
      path: "/login",
      element: <Login user={user} setSnackbarData={setSnackbarData} />
    },
    {
      path: "/applicant-signup",
      element: <ApplicantSignup user={user} setSnackbarData={setSnackbarData} />
    },
    {
      path: "/member-signup",
      element: <MemberSignup user={user} setSnackbarData={setSnackbarData} />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword user={user} setSnackbarData={setSnackbarData} />
    },
    {
      path: "/calendar",
      element: (
        <ProtectedPage user={user} requiredRole="APPLICANT">
          <Calendar user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/applications",
      element: (
        <ProtectedPage user={user} requiredRole="APPLICANT">
          <Applications user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/admin",
      element: (
        <ProtectedPage user={user} requiredRole="ADMIN">
          <Admin user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/team-management",
      element: (
        <ProtectedPage user={user} requiredRole="TEAM_MANAGEMENT">
          <TeamManagement user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/system-management",
      element: (
        <ProtectedPage user={user} requiredRole="SYSTEM_LEAD">
          <SystemManagement user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedPage user={user} requiredRole="APPLICANT">
          <Profile user={user} setUser={setUser} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/interview-availability",
      element: (
        <ProtectedPage user={user} requiredRole="APPLICANT">
          <InterviewAvailability user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/interviews",
      element: (
        <ProtectedPage user={user} requiredRole="INTERVIEWER">
          <Interviews user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "/messages",
      element: (
        <ProtectedPage user={user} requiredRole="APPLICANT">
          <Messages user={user} setSnackbarData={setSnackbarData} />
        </ProtectedPage>
      )
    },
    {
      path: "*",
      element: <PageNotFound user={user} setSnackbarData={setSnackbarData} />
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
      name: "Applications",
      path: "/applications",
      icon: <DescriptionIcon />
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
      name: "System Management",
      path: "/system-management",
      icon: <GroupIcon />
    },
    ...interviewerDrawerItems,
  ]

  const teamManagmentDrawerItems = [
    {
      name: "Team Management",
      path: "/team-management",
      icon: <GroupsIcon />
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

  // Theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#045F85',
      }
    },
    typography: {
      h1: {
        fontFamily: "'Montserrat', sans-serif",
      },
      h2: {
        fontFamily: "'Montserrat', sans-serif",
      },
      h3: {
        fontFamily: "'Montserrat', sans-serif",
      },
      h4: {
        fontFamily: "'Montserrat', sans-serif",
      },
      h5: {
        fontFamily: "'Montserrat', sans-serif",
      },
      h6: {
        fontFamily: "'Montserrat', sans-serif",
      },
      body1: {
        fontFamily: "'Urbanist', sans-serif",
      },
      body2: {
        fontFamily: "'Urbanist', sans-serif",
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Navbar */}
        <Navbar user={user} setOpen={setOpen} />
        {/* Side drawer */}
        <Drawer
          anchor={'left'}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box>
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
        {/* Alerts */}
        <Snackbar open={snackbarData.open} autoHideDuration={6000} onClose={() => setSnackbarData((curr) => ({...curr, open: false}))}>
          <Alert onClose={() => setSnackbarData((curr) => ({...curr, open: false}))} severity={snackbarData.severity} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar>
        {/* Main Body */}
        <Box
          sx={{
            flex: 10, // Honestly unsure why 10 here but it makes it look decent
          }}
        >
          <RouterProvider
            router={router}
          />
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
