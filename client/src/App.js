import { React, useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar';
import ApplicantSignup from './pages/ApplicantSignup';
import MemberSignup from './pages/MemberSignup';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import usersApi from './api/endpoints/users';

export default function App() {
  // States
  const [user, setUser] = useState(null);

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

  return (
    <div>
      <Navbar user={user} />
      <RouterProvider
        router={router}
      />
    </div>
  );
}
