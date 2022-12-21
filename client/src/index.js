import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './pages/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar';
import ApplicantSignup from './pages/ApplicantSignup';
import MemberSignup from './pages/MemberSignup';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/applicant-signup",
    element: <ApplicantSignup />
  },
  {
    path: "/member-signup",
    element: <MemberSignup />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    <RouterProvider
      router={router}
    />
  </React.StrictMode>
);
