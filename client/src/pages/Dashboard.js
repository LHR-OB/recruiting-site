import { React, useEffect } from 'react';
import usersApi from '../api/endpoints/users';

export default function Dashboard() {
  useEffect(() => {
    console.log(usersApi.protected());
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
