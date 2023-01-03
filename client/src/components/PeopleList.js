import { React, useState, useEffect } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';

export default function PeopleList({ team }) {
  // States
  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (team) {
      usersApi.getUsersByTeam(team.id).then((res) => {
        if (res.status === 200) {
          setPeople(res.data);
        }
      });
    }
  }, [team]);

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        People
      </Typography>
      <List>
        {people.map((person) => (
          <ListItem key={person.id}>
            <ListItemText primary={person.first_name + ' ' + person.last_name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
