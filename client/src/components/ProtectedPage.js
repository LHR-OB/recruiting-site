import { React } from 'react';
import Unauthorized from '../pages/Unauthorized';
import consts from '../config/consts';

export default function ProtectedPage({ user, requiredRole, children }) {
    const capsRoles = consts.USER_ROLES.map((role) => role.toUpperCase().replace(' ', '_'));
    if (user && capsRoles.indexOf(user.type) >= 0 && capsRoles.indexOf(user.type) <= capsRoles.indexOf(requiredRole)) {
        return children;
    } else {
        return <Unauthorized />;
    }
}
