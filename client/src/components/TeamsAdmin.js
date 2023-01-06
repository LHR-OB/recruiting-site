import { React, useEffect, useState } from 'react';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import CenterModal from './CenterModal';
import { teamsApi } from '../api/endpoints/teams';
import NewTeamForm from './NewTeamForm';
import EditTeamForm from './EditTeamForm';

export default function TeamsAdmin() {
  // States
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {
    teamsApi.getTeams().then((res) => {
      if (res.status === 200) {
        setTeams(res.data);
      }
    });
  }, []);

  const handleNewTeamButton = () => {
    setOpen(true);
    setModalMode('NEW');
  };

  const handleClickTeam = (team) => {
    setOpen(true);
    setModalMode('EDIT');
    setEditTeam(team);
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        Teams
      </Typography>
      <List>
        {teams.map((team) => (
          <ListItem key={team.id}>
            <ListItemButton
              onClick={() => {handleClickTeam(team)}}
            >
              <ListItemText primary={team.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        onClick={handleNewTeamButton}
        sx={{
          marginTop: 2,
        }}
      >
        New Team
      </Button>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        {modalMode === 'NEW' ? <NewTeamForm /> : <EditTeamForm team={editTeam} />}
      </CenterModal>
    </Container>
  );
}
