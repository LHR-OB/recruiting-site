import { React, useState, useEffect } from 'react';
import Unauthorized from '../pages/Unauthorized';
import consts from '../config/consts';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProtectedPage({ user, requiredRole, children }) {
    // States
    const [loading, setLoading] = useState(true);

    const TIMEOUT = 5; // seconds

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, TIMEOUT * 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    const capsRoles = consts.USER_ROLES.map((role) => role.toUpperCase().replace(' ', '_'));

    const isApproved = (user) => {
        return user.type === "APPLICANT" || user.status === "APPROVED";
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        )
    } else {
        if (user && isApproved(user) && capsRoles.indexOf(user.type) >= 0 && capsRoles.indexOf(user.type) <= capsRoles.indexOf(requiredRole)) {
            return children;
        } else {
            return <Unauthorized />;
        }
    }
}
