import { React, useState, useEffect } from 'react';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import NewSystemForm from './NewSystemForm';
import EditSystemForm from './EditSystemForm';
import CenterModal from './CenterModal';
import { systemsApi } from '../api/endpoints/teams';

export default function SystemsAdmin({ team, setSnackbarData }) {
  // States
  const [systems, setSystems] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [editSystem, setEditSystem] = useState(null);

  useEffect(() => {
    if (team) {
      systemsApi.getSystemsByTeam(team.id).then((res) => {
        if (res.status === 200) {
          setSystems(res.data);
        }
      });
    }
  }, [team]);

  const handleNewSystemButton = () => {
    setOpen(true);
    setModalMode('NEW');
  };

  const handleClickSystem = (system) => {
    setOpen(true);
    setModalMode('EDIT');
    setEditSystem(system);
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        Systems
      </Typography>
      <List>
        {systems.map((system) => (
          <ListItem key={system.id}>
            <ListItemButton
              onClick={() => {handleClickSystem(system)}}
            >
              <ListItemText primary={system.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        onClick={handleNewSystemButton}
        sx={{
          marginTop: 2,
        }}
      >
        New System
      </Button>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        {
          modalMode === 'NEW' ?
          <NewSystemForm team={team} setSystems={setSystems} setSnackbarData={setSnackbarData} setOpen={setOpen} /> 
          : <EditSystemForm system={editSystem} setSystems={setSystems} setSnackbarData={setSnackbarData} setOpen={setOpen} />
        }
      </CenterModal>
    </Container>
  );
}
