import { React, useState } from 'react';
import {
  Button,
  Container,
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
      <Button
        variant="outlined"
        onClick={handleOpen}
        >
        New System
      </Button>
        {systems.map((system) => (
          <Typography
            key={system.id}
            variant="h6"
            mt={2}
          >
            {system.name}
          </Typography>
        ))}
      <ModalForm
        open={open}
        handleClose={handleClose}
      >
        <NewSystemForm team={team} />
      </ModalForm>
    </Container>
  );
}
