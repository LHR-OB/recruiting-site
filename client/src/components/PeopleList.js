import { React, useState, useEffect } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';
import CenterModal from './CenterModal';
import PersonSummary from './PersonSummary';

export default function PeopleList({ team, system, setSnackbarData }) {
  // States
  const [people, setPeople] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    if (team) {
      usersApi.getUsersByTeam(team.id).then((res) => {
        if (res.status === 200) {
          setPeople(res.data);
        }
      });
    } else if (system) {
      usersApi.getUsersBySystem(system.id).then((res) => {
        if (res.status === 200) {
          setPeople(res.data);
        }
      });
    } else {
      usersApi.getUsersMembers().then((res) => {
        if (res.status === 200) {
          setPeople(res.data);
        }
      });
    }
  }, [team, system]);

  const handleClickPerson = (person) => {
    setOpen(true);
    setSelectedPerson(person);
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        People
      </Typography>
      <List>
        {people.map((person) => (
          <ListItem key={person.id}>
            <ListItemButton
              onClick={() => {handleClickPerson(person)}}
            >
              <ListItemText
                primary={person.first_name + ' ' + person.last_name}
                secondary={person.status === "UNAPPROVED" ? "UNAPPROVED" : null}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        <PersonSummary person={selectedPerson} setPeople={setPeople} setSnackbarData={setSnackbarData} setOpen={setOpen} />
      </CenterModal>
    </Container>
  );
}
