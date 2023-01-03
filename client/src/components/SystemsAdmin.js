import { React, useState } from 'react';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import NewSystemForm from './NewSystemForm';
import ModalForm from './ModalForm';

export default function SystemsAdmin({ team, systems }) {
  // States
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

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
            <ListItemText primary={system.name} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        onClick={handleOpen}
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
        <NewSystemForm team={team} />
      </ModalForm>
    </Container>
  );
}
