import { React, useState } from 'react';
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
import ModalForm from './ModalForm';

export default function SystemsAdmin({ team, systems }) {
  // States
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [editSystem, setEditSystem] = useState(null);

  const handleNewSystemButton = () => {
    setOpen(true);
    setModalMode('NEW');
  };

  const handleClickSystem = (system) => {
    setOpen(true);
    setModalMode('EDIT');
    setEditSystem(system);
  }

  const handleClose = () => {
    setOpen(false);
  };

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
      <ModalForm
        open={open}
        handleClose={handleClose}
      >
        {modalMode === 'NEW' ? <NewSystemForm team={team} /> : <EditSystemForm team={team} system={editSystem} />}
      </ModalForm>
    </Container>
  );
}
